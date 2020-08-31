const express = require('express');
const fetch = require('node-fetch');
const config = require('./../libs/config');

const router = express.Router();

router
  .get('/:orderId', (req, res) => {
    res.send(req.cookies.cookieId);
  })

  .post('/', (req, res) => {
    const { qnt } = req.body;
    const { identifier, price } = req.body.product;

    console.log('Body', identifier, price, qnt);

    res.send(req.cookies.cookieId);
  });

module.exports = router;
