const Order = require('./../../controllers/order.controller');
const User = require('./../../controllers/user.controller');
const Admin = require('./../../controllers/authentication.controller');
const SaleProduct = require('./../../controllers/sale-product.controller');

module.exports = {
  Order,
  User,
  Admin,
  SaleProduct
};
