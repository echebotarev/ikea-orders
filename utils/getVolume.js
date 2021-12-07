let maxHeight = 0;
let maxWidth = 0;
let maxLength = 0;

const getVolume = (measurements, isMetres = true) => {
  let v = 0;
  measurements.map(measurement => {
    let scopeV = 0;
    let w = 0;
    let h = 0;
    let l = 0;
    let d = 0;
    measurement.map(m => {
      switch (m.label) {
        case 'Ширина':
          w = parseInt(m.value, 10) / (isMetres ? 100 : 1);
          break;

        case 'Высота':
          h = parseInt(m.value, 10) / (isMetres ? 100 : 1);
          break;

        case 'Длина':
          l = parseInt(m.value, 10) / (isMetres ? 100 : 1);
          break;

        case 'Диаметр':
          d = parseInt(m.value, 10) / (isMetres ? 100 : 1);
          break;
      }
    });

    if (isMetres) {
      maxWidth = maxWidth > w ? maxWidth : w;
      maxHeight = maxHeight > h ? maxHeight : h;
      maxLength = maxLength > l ? maxLength : l;
    }

    if (d) {
      const r = d / 2;
      scopeV = 3.14 * r * r * h;
    } else {
      scopeV = w * h * l;
    }

    v += scopeV;
  });

  return v;
};
const getVolumeWeight = measurements => getVolume(measurements, false) / 5000;
const getWeight = measurements => {
  let w = 0;
  measurements.map(measurement => {
    const v = measurement.find(m => m.label === 'Вес');
    w += Number(v.value.replace(' кг', ''));
  });

  return w;
};

const calculateProducts = products => {
  let volume = 0;
  let volumeWeight = 0;
  let weight = 0;

  products.map(product => {
    const productQnt = product.qnt;
    const {
      packages
    } = product.information.dimensionProps.packaging.contentProps;

    let scopeVolume = 0;
    let scopeVolumeWeight = 0;
    let scopeWeight = 0;
    packages.map(pack => {
      if (pack.measurements.length === 0) {
        return false;
      }

      scopeVolume += getVolume(pack.measurements) * pack.quantity.value;
      scopeVolumeWeight +=
        getVolumeWeight(pack.measurements) * pack.quantity.value;
      scopeWeight += getWeight(pack.measurements) * pack.quantity.value;
    });

    volume += scopeVolume * productQnt;
    volumeWeight += scopeVolumeWeight * productQnt;
    weight += scopeWeight * productQnt;
  });

  return { volume, volumeWeight, weight };
};

module.exports = orders =>
  orders.map(order => ({
    ...calculateProducts(order.products),
    orderId: order.orderId
  }));
