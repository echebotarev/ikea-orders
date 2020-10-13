const UserModel = require('../../model/user');
const handleError = require('../handleError');

const User = {
  async get(cookieId) {
    return UserModel.findOne({ cookieId });
  },

  async create(payload) {
    const user = new UserModel(payload);

    try {
      await user.save();
    } catch (e) {
      handleError(e);
    }

    return user;
  }
};

module.exports = User;
