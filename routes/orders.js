const express = require('express');
const db = require('./../libs/db');

const config = require('./../libs/config');

const router = express.Router();

router
  .get('/:orderId', (req, res) => {
    res.send(req.cookies.cookieId);
  })

  .post('/', async (req, res) => {
    const { cookieId } = req.cookies;
    const { qnt } = req.body;
    const { identifier, price } = req.body.product;

    let order = await db.Order.get(cookieId);

    if (order) {
      order = await db.Order.addProduct(order, cookieId, { qnt, identifier, price });
    }
    else {
      order = await db.Order.create(cookieId, { qnt, identifier, price });
    }

    res.send(order);
  });

module.exports = router;
