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
    const volumes = getVolume(orders);

    const total = volumes.reduce((acc, value) => {
      acc.volume += value.volume;
      acc.volumeWeight += value.volumeWeight;
      acc.weight += value.weight;

      return acc;
    }, {
      volume: 0,
      volumeWeight: 0,
      weight: 0
    });

    res.send({ total, volumes });
  });

module.exports = router;
