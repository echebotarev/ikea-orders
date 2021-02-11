const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
  cookieId: {
    type: String,
    default: null
  },

  name: {
    type: String,
    default: 'Noname'
  },

  phone: {
    type: String,
    default: null
  },

  email: {
    type: String,
    default: null
  },

  address: {
    type: String,
    default: null
  },

  /**
   * Вложенные объекты будут выглядеть:
   * { id: [id], createdAt: [Date.now] }
   * */
  goodsWaiting: {
    type: Array,
    default: []
  },

  createdAt: { type: Date, default: Date.now }
});

// eslint-disable-next-line no-underscore-dangle,func-names
User.virtual('id').get(function () {
  // eslint-disable-next-line no-underscore-dangle
  return this._id;
});

User.set('toJSON', {
  getters: true,
  virtuals: false,
  versionKey: false
});

module.exports = mongoose.model('User', User);
