const sgMail = require('@sendgrid/mail');
const config = require('./config');

sgMail.setApiKey(config.get('SENDGRID_API_KEY'));

const getCosts = (price, qnt) => ({ price, priceTotal: price * qnt });

let msg = {
  from: {
    email: 'info@doma-doma.kz'
  },
  personalizations: [],
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
  personalization.bcc = personalization.bcc.filter(item => item.email !== to.toLowerCase());

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
