const express = require('express');
const db = require('./../libs/db');

const router = express.Router();

router
  .get('/SNMb0pmYka0bSi', async (req, res) => {
    const orders = await db.Order.getOrders({ checkout: true });
    res.send(orders);
  });

module.exports = router;
