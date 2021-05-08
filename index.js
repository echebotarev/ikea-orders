const path = require('path');
const express = require('express');

const passport = require('passport');

const dotenv = require('dotenv');
const config = require('./libs/config');

dotenv.config();

// eslint-disable-next-line no-unused-vars
const mongoose = require('./libs/connectMongoose');

/** ROUTES * */
const orders = require('./routes/orders');
const available = require('./routes/available');
const panel = require('./routes/panel');
const authentication = require('./routes/authentication');
const api = require('./routes/api');
/** ROUTES * */

const setMiddlewares = require('./libs/setMiddlewares');

const app = express();

// добавляем промежуточные ф-ии
setMiddlewares(app, path.join(__dirname, 'middlewares'));

app.get('/', (req, res) => res.end('API is Ok'));
app.use('/orders', orders);
app.use('/available', available);
app.use('/panel', panel);
app.use('/auth', authentication);
app.use('/api', passport.authenticate('jwt', { session: false }), api);

app.listen(config.get('port'), () => {
  console.log(`Listening on port ${config.get('port')}!`);
});
