const sgMail = require('@sendgrid/mail');
const config = require('./config');

sgMail.setApiKey(config.get('SENDGRID_API_KEY'));

const orderTemplateId = 'd-230c4bb4715b49339d6c4804f58efdb8';
let msg = {
  from: {
    email: 'info@doma-doma.org'
  },
  personalizations: [],
  // шаблон списка товаров при заказе
  template_id: 'd-230c4bb4715b49339d6c4804f58efdb8'
};

const setFromEmail = shopId => {
  switch (shopId) {
    case '001':
      return { email: 'aktau@doma-doma.org' };

    case '002':
      return { email: 'saransk@doma-doma.org' };

    case '003':
      return { email: 'uralsk@doma-doma.org' };

    default:
      return { email: 'info@doma-doma.org' };
  }
};

let personalization = {
  to: [
    {
      email: '9111721308@mail.ru'
    }
  ],
  bcc: [
    {
      email: '9111721308@mail.ru'
    },
    {
      email: 'dysya84@mail.ru'
    }
  ],
  dynamic_template_data: {
    name: 'Egor Chebotarev',
    orderId: '123456',
    assembly: 20,
    total: 200,
    products: [
      {
        name: 'Bed',
        qnt: 1,
        price: 100,
        priceTotal: 100
      },
      {
        name: 'Bed',
        qnt: 1,
        price: 100,
        priceTotal: 100
      }
    ]
  }
};

module.exports = (to, data) => {
  personalization.bcc = {
    orders: {
      '001': [
        {
          email: '9111721308@mail.ru'
        },
        {
          email: 'dysya84@mail.ru'
        },
        {
          email: 'sofya.kluchnikova@yandex.ru'
        },
        {
          email: '92zayka777@gmail.com'
        },
        {
          email: 'elfinab19@gmail.com'
        }
      ],
      '002': [
        {
          email: '9111721308@mail.ru'
        },
        {
          email: 'zakaz@ikea13.ru'
        }
      ],
      '003': [
        {
          email: '9111721308@mail.ru'
        },
        {
          email: 'dysya84@mail.ru'
        },
        {
          email: 'sofya.kluchnikova@yandex.ru'
        },
        {
          email: 'uralsk.samara.ikea@gmail.com'
        },
        {
          email: '92zayka777@gmail.com'
        },
        {
          email: 'elfinab19@gmail.com'
        }
      ]
    },
    other: [
      {
        email: '9111721308@mail.ru'
      }
    ]
  };
  msg.template_id = data.template_id || orderTemplateId;

  // если речь о сообщениях с заказом, то отсылаем мне и Даше,
  // если о чем то другом, отсылаем только мне
  personalization.bcc = data.template_id
    ? personalization.bcc.other
    : // почты для заказов в зависимости от shopId
      personalization.bcc.orders[data.shopId];

  personalization.bcc = personalization.bcc.filter(
    item => item.email !== to.toLowerCase()
  );
  // фильтруем Дашину и почту Саранска, чтобы им не приходили тестовые письма
  personalization.bcc = personalization.bcc.filter(
    item =>
      !(
        (item.email === 'dysya84@mail.ru' ||
          item.email === 'zakaz@ikea13.ru' ||
          item.email === 'uralsk.samara.ikea@gmail.com' ||
          item.email === 'sofya.kluchnikova@yandex.ru' ||
          item.email === 'elfinab19@gmail.com' ||
          item.email === '92zayka777@gmail.com') &&
        to === 'e.chebotarew@ya.ru'
      )
  );

  personalization.to = [{ email: to.trim() }];
  personalization.dynamic_template_data = data;

  msg.personalizations = [personalization];
  msg.from = setFromEmail(data.shopId);

  console.log('Person', personalization);

  sgMail
    .send(msg)
    .then()
    .catch(error => {
      console.error(error);
      console.error(error.response.body);
    });
};
