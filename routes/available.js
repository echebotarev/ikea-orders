const samaraShopId = 442;

const express = require('express');
const fetch = require('node-fetch');
const db = require('./../libs/db');

const router = express.Router();

router
  .get('/check-available', async (req, res) => {
    const users = await db.User.find({ expectedItems: { $exists: true, $not: { $size: 0 } } });
    console.log('Users', users);
    const expectedItems = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      expectedItems.push(...user.expectedItems);
    }

    console.log('Items', expectedItems);
  })
  .put('/', async (req, res) => {
    const { cookieId } = req.cookies;
    const { shopId = samaraShopId } = req.body;
    const { email } = req.body;
    const { id } = req.body;

    if (!email || !id) {
      return res.json({ msg: 'Email or id doesn\'t defined' });
    }

    let user = await db.User.get(cookieId);
    if (user === null) {
      user = await db.User.create({ cookieId, email });
    }
    else if (user.email === null) {
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
