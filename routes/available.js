const samaraShopId = 442;

const express = require('express');
const fetch = require('node-fetch');
const db = require('./../libs/db');

const router = express.Router();

const checkItemAvailable = async payload =>
  new Promise((res, rej) => {
    const { shopId, type, id } = payload;
    const url = `https://iows.ikea.com/retail/iows/ru/ru/stores/${shopId}/availability/${type}/${id}`;
    fetch(url, {
      headers: {
        Authority: 'iows.ikea.com',
        Accept: 'application/vnd.ikea.iows+json;version=1.0',
        Origin: 'https://order.ikea.com',
        Consumer: 'MAMMUT',
        Contract: '37249'
      }
    })
      .then(response => response.json())
      .then(available => setTimeout(() => res(Object.assign(payload, { available })), 300));
  });
const checkItemsAvailable = async (items, acc = []) => {
  if (items.length === 0) {
    return acc;
  }

  const result = await checkItemAvailable(items.splice(0, 1)[0]);
  acc.push(result);
  // eslint-disable-next-line no-return-await
  return await checkItemsAvailable(items, acc);
};

router
  .get('/check-available', async () => {
    const users = await db.User.find({
      expectedItems: { $exists: true, $not: { $size: 0 } }
    });
    const expectedItems = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      expectedItems.push(...user.expectedItems);
    }

    const results = await checkItemsAvailable(expectedItems);
    console.log('Results', results);
  })
  .put('/', async (req, res) => {
    const { cookieId } = req.cookies;
    const { shopId = samaraShopId } = req.body;
    const { email } = req.body;
    const { id } = req.body;
    const { type } = req.body;

    if (!email || !id || !type) {
      return res.json({ msg: "Email or id doesn't defined" });
    }

    let user = await db.User.get(cookieId);
    if (user === null) {
      user = await db.User.create({ cookieId, email });
    } else if (user.email === null) {
      user.email = email;
      user.save();
    }

    user = await db.User.addExpectedItem({
      ...req.body,
      shopId,
      cookieId,
      user
    });

    return res.json(user);
  });

module.exports = router;
