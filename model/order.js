const mongoose = require('mongoose');

const { Schema } = mongoose;
const Order = new Schema({
  refsCookieId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },

  refsUserId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },

  products: {
    type: Array,
    default: []
  },

  // собран ли заказ
  assembled: {
    type: Boolean,
    default: false
  },
  // отправлен
  sent: {
    type: Boolean,
    default: false
  },
  // отменен администратором
  canceled: {
    type: Boolean,
    default: false
  },
  // удален пользователем
  deleted: {
    type: Boolean,
    default: false
  },
  // оплачен
  paid: {
    type: Boolean,
    default: false
  },
  // оплачивается
  paying: {
    type: Boolean,
    default: false
  },
  // ошибка оплаты
  errorPay: {
    type: Boolean,
    default: false
  },
  // доставлен
  delivered: {
    type: Boolean,
    default: false
  }
});

// eslint-disable-next-line no-underscore-dangle,func-names
Order.virtual('id').get(function() {
  // eslint-disable-next-line no-underscore-dangle
  return this._id;
});

Order.set('toJSON', {
  getters: true,
  virtuals: false,
  versionKey: false
});

module.exports = mongoose.model('Order', Order);
