const Order = require('./../../controllers/order.controller');
const User = require('./../../controllers/user.controller');
const Admin = require('./../../controllers/authentication.controller');
const City = require('./../../controllers/city.controller');
const SaleProduct = require('./../../controllers/sale-product.controller');

module.exports = {
  Order,
  User,
  Admin,
  City,
  SaleProduct
};
