const express = require('express');
const fetch = require('node-fetch');
const config = require('./../libs/config');
const Client = require('./../libs/mongoClient');

const router = express.Router();

router
  .get('/', (req, res) => {
    res.send(req.cookies.cookieId);
  });

module.exports = router;
