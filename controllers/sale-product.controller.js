const SaleProductModel = require('./../model/sale-product');
const handleError = require('../libs/handleError');

const SaleProduct = {
  /**
  *  @param shopId - id магазина
   * @param [productId] - id товара согласно IKEA
   *
   * @description Если передан id магазина, то возвращаем все товары
   * @description Если передан id товара, то только один товар
  * */
  async get(shopId, productId) {
    if (productId) {
      return SaleProductModel.findOne({
        identifier: productId,
        shopId
      });
    }

    return SaleProductModel.find({ shopId });
  },

  async create(payload) {
    const saleProduct = new SaleProductModel(payload);

    try {
      await saleProduct.save();
    } catch (e) {
      handleError(e);
    }

    return saleProduct;
  },

  async add(payload) {
    const { shopId, productId, qnt } = payload;
    const product = await SaleProduct.get(shopId, productId);

    if (product) {
      const increment = { $inc: { qnt } };
      await SaleProductModel.updateOne(
        {
          shopId,
          identifier: productId
        },
        increment
      );
    }
    else {
      await SaleProduct.create(payload);
    }

    return true;
  },

  async delete({ shopId, productId, qnt }) {
    const decrement = { $inc: { qnt: -qnt } };
    await SaleProductModel.updateOne(
      {
        shopId,
        identifier: productId
      },
      decrement
    );

    const product = await SaleProduct.get(shopId, productId);
    if (product.qnt <= 0) {
      await SaleProductModel.deleteOne({ shopId, identifier: productId });
    }

    return true;
  },
};

module.exports = SaleProduct;
