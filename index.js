const express = require('express');
const cors = require('cors');

const config = require('./libs/config');

/** ROUTES * */
const orders = require('./routes/orders');
/** ROUTES * */

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.get('/', (req, res) => res.end('API is Ok'));
app.use('/orders', cors(corsOptions), orders);

app.listen(config.get('port'), () => {
  console.log(`Listening on port ${config.get('port')}!`);
});
