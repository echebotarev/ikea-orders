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

  kaspiOrderId: {
    type: Number,
    default: null
  },

  weekNumber: {
    type: String,
    default: null
  },

  shopId: {
    type: String,
    default: ''
  },

  name: {
    type: String,
    default: null
  },

  address: {
    type: String,
    default: null
  },

  email: {
    type: String,
    default: null
  },

  phone: {
    type: String,
    default: null
  },

  products: {
    type: Array,
    default: []
  },

  // заказ оформлен
  checkout: {
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
  // поле используется в случае оплаты на сайте.
  paid: {
    type: Boolean,
    default: false
  },
  // указываем в админке
  paidValue: {
    type: Number,
    default: 0
  },

  // нужна ли сборка
  isAssembly: {
    type: Boolean,
    default: false
  },
  // стоимость сборки
  assembly: {
    type: Number,
    default: 0
  },

  // TODO: обработать на основном сайте
  isDelivery: {
    type: Boolean,
    default: false
  },
  deliveryCost: {
    type: Number,
    default: 0
  },

  /**
   * @example: {
   *   type: 'percent',
   *   value: 5
   * }
   * */
  sale: {
    type: Object,
    default: null
  },

  status: {
    type: String,
    default: 'new'
  },

  payMethod: {
    type: String,
    default: ''
  },
  // ошибка оплаты
  errorPay: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
  checkoutCreatedAt: { type: Date, default: null }
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
