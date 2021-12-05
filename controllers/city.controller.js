const CityModel = require('../model/city');

const handleError = require('../libs/handleError');

const City = {
  async get(shopId) {
    if (Array.isArray(shopId)) {
      return CityModel.find({
        shopId: { $in: shopId }
      });
    }

    return CityModel.findOne({ shopId });
  },

  async create(payload) {
    const city = new CityModel(payload);

    try {
      await city.save();
    } catch (e) {
      handleError(e);
    }

    return city;
  }
};

module.exports = City;
