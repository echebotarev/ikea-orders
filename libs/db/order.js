const OrderModel = require('../../model/order');
const handleError = require('../handleError');

const Order = {
  async get(cookieId) {},

  async create(cookieId, payload) {},

  async update(cookieId, payload) {},

  async deleteOrder(cookieId) {},

  async deleteProduct(cookieId, productId) {}
};

module.exports = Order;
