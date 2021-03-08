const samaraShopId = 442;

const express = require('express');
const fetch = require('node-fetch');
const db = require('./../libs/db');

const router = express.Router();

const sgMail = require('../libs/sgMail');

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
      .then(response => {
        if (response.status !== 200) {
          return null;
        }

        return response.json();
      })
      .then(available =>
        setTimeout(() => res(Object.assign(payload, { available })), 300)
      );
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
const getProducts = async ids =>
  fetch(
    `http://localhost:8080/api/v1/products?ids=${ids.join(',')}`
  ).then(response => response.json());
const updateProduct = payload =>
  fetch(
    `http://localhost:8080/api/v1/available/${payload.type}/${payload.id}`,
    { method: 'PUT' }
  );

router
  .get('/check-available', async (req, res) => {
    console.log('Check Available');

    let users = await db.User.find({
      expectedItems: { $exists: true, $not: { $size: 0 } }
    });
    const expectedItems = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      expectedItems.push(...user.expectedItems);
    }

    // Получаем данные о наличии
    let results = await checkItemsAvailable(expectedItems);

    // оставляем те, что появились
    results = results.filter(
      result => {
        if (result.available && result.available.StockAvailability.RetailItemAvailability) {
          return result.available.StockAvailability.RetailItemAvailability.AvailableStock.$ > 0;
        }
        else {
          return false;
        }
      }
    );
    const ids = results.map(result => result.id);

    // eslint-disable-next-line new-cap
    users = await db.User.find({ 'expectedItems.id': { $in: ids } });
    // удаляем появившиеся из ожидаемых
    users.map(user => {
      // eslint-disable-next-line no-param-reassign
      user.expectedItems = user.expectedItems.filter(
        item => !ids.includes(item.id)
      );
      user.save();
    });

    const products = await getProducts(ids);

    // формируем товары по пользователям, чтобы не дублировать письма, если
    // клиент ждет несколько товаров
    const output = {};
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      // посылаем сигнал в Rest, чтобы обновить наличи товара
      updateProduct({
        id: result.id,
        type: result.type
      });

      output[result.email] = output[result.email]
        ? [...output[result.email], result.id]
        : [result.id];
    }

    // отправляем
    Object.entries(output).forEach(([email, identifiers]) =>
      sgMail(email, {
        template_id: 'd-fd20e725203b4591b653c60f45fe60ba',
        products: products.filter(product =>
          identifiers.includes(product.identifier)
        )
      })
    );

    res.send('Ok');
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
