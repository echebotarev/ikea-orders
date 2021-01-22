const express = require('express');
const db = require('./../libs/db');

const isValidDate = require('./../utils/isValidDate');

const router = express.Router();

router.get('/SNMb0pmYka0bSi/:date?', async (req, res) => {
  const { date } = req.params;

  const payload = Object.assign(
    { checkout: true },
    date && isValidDate(date) ? new Date(date) : {}
  );

  const orders = await db.Order.getOrders(payload);
  res.send(orders);
});

module.exports = router;
