const cors = require('cors');

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true
};

module.exports = cors(corsOptions);
