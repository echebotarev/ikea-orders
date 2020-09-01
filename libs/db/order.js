const OrderModel = require('../../model/order');
const handleError = require('../handleError');

const Order = {
  async get(cookieId) {
    if (Array.isArray(cookieId)) {
      return OrderModel.find({
        cookieId: { $in: cookieId },
        deleted: false
      });
    }

    return OrderModel.findOne({ cookieId, deleted: false });
  },

  async create(cookieId, payload) {
    const order = new OrderModel({ cookieId, products: [payload] });

    try {
      await order.save();
    } catch (e) {
      handleError(e);
    }

    return order;
  },

  async addProduct(order, cookieId, payload) {
    const increment = { $inc: { 'products.$.qnt': payload.qnt } };
    const result = await OrderModel.updateOne(
      {
        cookieId,
        'products.identifier': payload.identifier
      },
      increment
    );

    if (result.nModified === 0) {
      await order.products.push(payload);
      order.save();
    }

    return order;
  },

  async deleteOrder(cookieId) {},

  async deleteProduct(cookieId, productId) {}
};

module.exports = Order;
