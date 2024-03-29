const express = require('express');
const db = require('./../libs/db');

const sendMail = require('./../libs/sgMail');

const router = express.Router();

router
  .get('/:orderId?', async (req, res) => {
    const { cookieId } = req.cookies;
    const order = await db.Order.get(cookieId);
    res.send(order);
  })

  .post('/', async (req, res) => {
    const { cookieId } = req.cookies;
    const { qnt, product } = req.body;

    let order = await db.Order.get(cookieId);

    if (order) {
      order = await db.Order.addProduct(order, cookieId, Object.assign(product, { qnt }));
    }
    else {
      order = await db.Order.create(cookieId, Object.assign(product, { qnt }));
    }

    res.send(order);
  })

  .delete('/:productId', async (req, res) => {
    const { cookieId } = req.cookies;
    const { productId } = req.params;
    const { qnt } = req.query;

    const order = await db.Order.deleteProduct(cookieId, { productId, qnt });

    res.send(order);

  })

  .put('/:orderId', async (req, res) => {
    const { cookieId } = req.cookies;
    const { orderId } = req.params;
    const { email } = req.body;

    let user = await db.User.get(cookieId);
    if (user === null) {
      user = await db.User.create({ cookieId, ...req.body });
    }

    const order = await db.Order.updateOrder(orderId, {
      userId: user.id,
      checkoutCreatedAt: Date.now(),
      ...req.body
    });

    const output = Object.assign({}, order.toJSON(), req.body);

    sendMail(email, output);

    res.send(order);
  });

module.exports = router;
