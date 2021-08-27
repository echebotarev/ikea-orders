let volume = 0;
let volumeWeight = 0;
let weight = 0;

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

const calculateProducts = products =>
  products.map(product => {
    const productQnt = product.qnt;
    const packages =
      product.information.productDetailsProps.accordionObject.packaging
        .contentProps.packages;

    let scopeVolume = 0;
    let scopeVolumeWeight = 0;
    let scopeWeight = 0;
    packages.map(pack => {
      console.log('Name', pack.name, pack.typeName, pack.articleNumber.value);
      console.log('Package Qnt', pack.quantity.value);
      console.log('Measurement', pack.measurements);
      console.log(
        '========================================================================'
      );

      if (pack.measurements.length === 0) {
        return false;
      }

      scopeVolume = getVolume(pack.measurements) * pack.quantity.value;
      scopeVolumeWeight =
        getVolumeWeight(pack.measurements) * pack.quantity.value;
      scopeWeight = getWeight(pack.measurements) * pack.quantity.value;

      console.log('Scope Volume', scopeVolume);
      console.log('Scope Volume Weight', scopeVolume);
      console.log('Scope Weight', scopeWeight);
      console.log('====================================');
    });

    volume += scopeVolume * productQnt;
    volumeWeight += scopeVolumeWeight * productQnt;
    weight += scopeWeight * productQnt;

    console.log('Volume', volume);
    console.log('Volume Weight', volumeWeight);
    console.log('Weight', weight);
    console.log('====================================');

    return { volume, volumeWeight, weight };
  });

console.log('Volume', volume);
console.log('Volume Weight', volumeWeight);
console.log('Weight', weight);

console.log('Max Width', maxWidth);
console.log('Max Height', maxHeight);
console.log('Max Length', maxLength);

module.exports = orders =>
  orders.map(order => ({ [order.orderId]: calculateProducts(order.products) }));
