const mongoose = require('mongoose');

const { Schema } = mongoose;

const AdminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  displayName: { type: String, default: '' },

  /**
   * @types [
   *    0 - buyer - доступна ф-ия закупки товаров,
   *    1 - manager - доступна работа со статусами заказов и ф-ия сортировки товаров по заказам,
   *    2 - admin - доступно всё вышеперечисленное,
   *            плюс настройки самого магазина - скидки, даты поставки, адреса,
   *    3 - superAdmin - доступно все вышеперечисленное, плюс управление контентом магазина
   *                 и данными других админов
   * ]
   * */
  privilege: { type: Array, default: [] },

  /**
   * Список магазинов доступный этому user'у
   * */
  shopIds: { type: Array, default: [] }
});

module.exports = mongoose.model('Admin', AdminSchema);
