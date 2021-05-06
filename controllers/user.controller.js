const UserModel = require('./../model/user');
const handleError = require('../libs/handleError');

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
  },

  async find(payload) {
    return UserModel.find(payload);
  },

  async addExpectedItem(payload) {
    const { cookieId } = payload;
    const { user } = payload;

    const result = await UserModel.updateOne(
      {
        cookieId,
        'expectedItems.id': payload.id
      },
      { 'expectedItems.$.createdAt': Date.now() }
    );

    if (result.nModified === 0) {
      await user.expectedItems.push({
        email: payload.email,
        id: payload.id,
        ikeaShopId: payload.ikeaShopId,
        type: payload.type,
        createdAt: Date.now()
      });
      await user.save();
    }

    return User.get(cookieId);
  },

  async removeExpectedItem() {}
};

module.exports = User;
