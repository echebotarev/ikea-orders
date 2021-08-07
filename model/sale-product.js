const mongoose = require('mongoose');

const { Schema } = mongoose;

const SaleProductSchema = new Schema({
  identifier: { type: String, required: true },
  shopId: { type: String, required: true },

  price: { type: Number, required: true },
  qnt: { type: Number, default: 1 },
  description: { type: String, default: '' }
});

module.exports = mongoose.model('SaleProduct', SaleProductSchema);
