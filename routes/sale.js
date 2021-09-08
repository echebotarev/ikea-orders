const express = require('express');
const db = require('./../libs/db');

const router = express.Router();

const getShopData = require('./../utils/getShopData');

router
  .get('/products', async (req, res) => {
    const { domaDomaShopId = '001' } = getShopData(req);
    const products = await db.SaleProduct.get(domaDomaShopId);
    res.send(products);
  })

  /**
   * @example
   * await fetch('https://orders.doma-doma.org/sale/product?domaDomaShopId=001', {
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
    const { domaDomaShopId = '001' } = getShopData(req);
    console.log('ShopId', domaDomaShopId);

    const product = await db.SaleProduct.create(
      Object.assign(req.body, { shopId: domaDomaShopId })
    );
    res.send(product);
  })

  /**
   * @example
   * await fetch('https://orders.doma-doma.org/sale/product?domaDomaShopId=001', {
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
    const { domaDomaShopId = '001' } = getShopData(req);
    await db.SaleProduct.delete(
      Object.assign(req.body, { shopId: domaDomaShopId })
    );
    res.send('Ok');
  });

module.exports = router;
