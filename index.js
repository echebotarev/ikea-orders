const path = require('path');
const express = require('express');

const config = require('./libs/config');

// eslint-disable-next-line no-unused-vars
const mongoose = require('./libs/connectMongoose');

/** ROUTES * */
const orders = require('./routes/orders');
/** ROUTES * */

const setMiddlewares = require('./libs/setMiddlewares');

const app = express();

// добавляем промежуточные ф-ии
setMiddlewares(app, path.join(__dirname, 'middlewares'));

app.get('/', (req, res) => res.end('API is Ok'));
app.use('/orders', orders);

app.listen(config.get('port'), () => {
  console.log(`Listening on port ${config.get('port')}!`);
});
