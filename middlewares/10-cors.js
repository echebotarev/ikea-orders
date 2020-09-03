const cors = require('cors');

const corsOptions = {
  origin: false,
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
