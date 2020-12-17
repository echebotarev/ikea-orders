const OrderModel = require('../../model/order');
const handleError = require('../handleError');

const Order = {
  async get(cookieId) {
    if (Array.isArray(cookieId)) {
      return OrderModel.find({
        cookieId: { $in: cookieId },
        deleted: false,
        checkout: false
      });
    }

    return OrderModel.findOne({ cookieId, deleted: false, checkout: false });
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
        'products.identifier': payload.identifier,
        // здесь мы предполагаем, что у user'a существует только один заказ
        // без этого товар может добавляться в предыдущий оплаченный заказ
        checkout: false
      },
      increment
    );

    if (result.nModified === 0) {
      await order.products.push(payload);
    }

    await order.save();

    return Order.get(cookieId);
  },

  async deleteOrder(cookieId) {},

  async deleteProduct(cookieId, { productId, qnt }) {
    const decrement = { $inc: { 'products.$.qnt': -qnt } };
    await OrderModel.updateOne(
      {
        cookieId,
        'products.identifier': productId,
        // здесь мы предполагаем, что у user'a существует только один заказ
        // без этого товар может добавляться в предыдущий оплаченный заказ
        checkout: false
      },
      decrement
    );

    const order = await Order.get(cookieId);
    if (order) {
      order.products = order.products.filter(product => product.qnt > 0);
      order.save();
    }

    return order;
  },

  async updateOrder(orderId, payload) {
    await OrderModel.updateOne({ _id: orderId }, payload);

    return OrderModel.findOne({ _id: orderId });
  },

  async getOrders(payload) {
    return OrderModel.find(payload);
  }
};

module.exports = Order;
