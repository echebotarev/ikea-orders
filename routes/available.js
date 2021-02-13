const samaraShopId = 442;

const express = require('express');
const fetch = require('node-fetch');
const db = require('./../libs/db');

const router = express.Router();

router.put('/', async (req, res) => {
  const { shopId = samaraShopId } = req.body;
  const { cookieId } = req.cookies;

  let user = await db.User.get(cookieId);
  if (user === null) {
    user = await db.User.create({ cookieId });
  }

  user = await db.User.addExpectedItem({
    ...req.body, shopId, cookieId, user
  });

  return res.json(user);
});

module.exports = router;
