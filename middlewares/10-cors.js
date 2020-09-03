const cors = require('cors');

const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
