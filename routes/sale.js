const express = require('express');
const db = require('./../libs/db');

const router = express.Router();

router
  .get('/products', async (req, res) => {
    const { domaDomaShopId = '001' } = req.cookies;
    const products = await db.SaleProduct.get(domaDomaShopId);
    res.send(products);
  })

  .post('/product', async (req, res) => {
    const { domaDomaShopId = '001' } = req.cookies;
    const product = await db.SaleProduct.create(
      Object.assign(req.body, { shopId: domaDomaShopId })
    );
    res.send(product);
  })

  .delete('/product', async (req, res) => {
    const { domaDomaShopId = '001' } = req.cookies;
    const product = await db.SaleProduct.create(
      Object.assign(req.body, { shopId: domaDomaShopId })
    );
    res.send(product);
  });

module.exports = router;
