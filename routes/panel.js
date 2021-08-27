const express = require('express');
const db = require('./../libs/db');

const getVolume = require('./../utils/getVolume');
const isValidDate = require('./../utils/isValidDate');

const router = express.Router();

router
  .get('/SNMb0pmYka0bSi/:date?', async (req, res) => {
    const { date } = req.params;
    const payload = Object.assign(
      { checkout: true },
      date && isValidDate(new Date(date))
        ? { checkoutCreatedAt: { $gte: new Date(date) } }
        : {}
    );

    const orders = await db.Order.getOrders(payload);
    res.send(orders);
  })
  .get('/volume', async (req, res) => {
    let { orders } = req.query;
    orders = await db.Order.getOrderById(orders ? orders.split(',') : []);
    console.log('Ids', getVolume(orders));
    res.send('Ok');
  });

module.exports = router;
