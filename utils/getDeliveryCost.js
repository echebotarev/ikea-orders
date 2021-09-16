const { deliveryCost } = require('./../constant');

module.exports = ({ shopId, volumes = [] }) => {
  let price = 0;

  const prices = deliveryCost[shopId];
  if (prices === null) {
    return 0;
  }

  // eslint-disable-next-line no-return-assign
  volumes.forEach(volume => (price += volume.weight * prices.priceForKg));

  if (price < prices.minPrice) {
    return prices.minPrice;
  }

  if (price > prices.maxPrice) {
    return prices.maxPrice;
  }

  return Math.floor(price);
};
