const express = require('express');
const db = require('./../libs/db');

const router = express.Router();

// db.City.create({
//   shopId: '003',
//   ikeaShopId: 442,
//   displayName: 'Уральск',
//   percent: 45
// });
//
// db.City.create({
//   shopId: '004',
//   ikeaShopId: 442,
//   displayName: 'Атырау',
//   percent: 50
// });

router.get('/cities', async (req, res) => {
  const shopIds = req.query.shopIds.split(',');
  const cities = await db.City.get(shopIds);
  return res.send(cities);
});

module.exports = router;
