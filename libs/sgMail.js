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
    orders: [
      {
        email: '9111721308@mail.ru'
      },
      {
        email: 'dysya84@mail.ru'
      }
    ],
    other: [
      {
        email: '9111721308@mail.ru'
      }
    ]
  };
  // personalization.bcc = [
  //   {
  //     email: '9111721308@mail.ru'
  //   },
  //   {
  //     email: 'dysya84@mail.ru'
  //   }
  // ];
  msg.template_id = data.template_id || orderTemplateId;

  // если речь о сообщениях с заказом, то отсылаем мне и Даше,
  // если о чем то другом, отсылаем только мне
  personalization.bcc = data.template_id
    ? personalization.bcc.other
    : personalization.bcc.orders;
  personalization.bcc = personalization.bcc.filter(
    item => item.email !== to.toLowerCase()
  );
  // фильтруем Дашину почту, чтобы ей не приходили тестовые письма
  personalization.bcc = personalization.bcc.filter(
    item => !(item.email === 'dysya84@mail.ru' && to === 'e.chebotarew@ya.ru')
  );

  personalization.to = [{ email: to }];
  personalization.dynamic_template_data = data;

  msg.personalizations = [personalization];

  sgMail
    .send(msg)
    .then()
    .catch(error => {
      console.error(error);
      console.error(error.response.body);
    });
};
