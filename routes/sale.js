const express = require('express');
const db = require('./../libs/db');

const router = express.Router();

router
  .get('/products', async (req, res) => {
    const { shopId = '001' } = req.query;
    const products = await db.SaleProduct.get(shopId);
    res.send(products);
  })

  /**
   * @example
   * await fetch('http://localhost:7070/sale/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId: '10491776',
            qnt: 1,
            price: 49000
        })
      });
   * */
  .post('/product', async (req, res) => {
    const { domaDomaShopId = '001' } = req.cookies;
    const product = await db.SaleProduct.create(
      Object.assign(req.body, { shopId: domaDomaShopId })
    );
    res.send(product);
  })

  /**
   * @example
   * await fetch('http://localhost:7070/sale/product', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId: '10491776',
            qnt: 1
        })
      });
   * */
  .delete('/product', async (req, res) => {
    const { domaDomaShopId = '001' } = req.cookies;
    const product = await db.SaleProduct.delete(
      Object.assign(req.body, { shopId: domaDomaShopId })
    );
    res.send(product);
  });

module.exports = router;
