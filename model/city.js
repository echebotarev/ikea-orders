const mongoose = require('mongoose');

const { Schema } = mongoose;

const CitySchema = new Schema({
  shopId: {
    type: String,
    default: ''
  },

  ikeaShopId: {
    type: Number,
    default: 442
  },

  displayName: {
    type: String,
    default: ''
  },

  percent: {
    type: Number,
    default: 0
  },

  timeToDeliveryData: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('City', CitySchema);
