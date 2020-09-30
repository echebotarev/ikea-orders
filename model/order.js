const mongoose = require('mongoose');

const { Schema } = mongoose;

const CounterSchema = Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 333 }
});
const Counter = mongoose.model('counter', CounterSchema);

const Order = new Schema({
  cookieId: {
    type: String,
    default: null
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },

  orderId: {
    type: Number,
    default: null
  },

  products: {
    type: Array,
    default: []
  },

  // нужна ли сборка
  isAssembly: {
    type: Boolean,
    default: false
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
  },
  createdAt: { type: Date, default: Date.now }
});

// eslint-disable-next-line no-underscore-dangle,func-names
Order.virtual('id').get(function () {
  // eslint-disable-next-line no-underscore-dangle
  return this._id;
});

Order.pre('save', function (next) {
  const doc = this;
  if (doc.orderId) {
    return next();
  }

  Counter.findByIdAndUpdate({ _id: 'orderId' }, { $inc: { seq: 1 }, new: true }, async (
    error,
    counter
  ) => {
    if (error) return next(error);
    if (counter === null) {
      // eslint-disable-next-line no-param-reassign
      counter = new Counter({ _id: 'orderId' });
      await counter.save();
    }

    doc.orderId = counter.seq;
    return next();
  });
});

Order.set('toJSON', {
  getters: true,
  virtuals: false,
  versionKey: false
});

module.exports = mongoose.model('Order', Order);
