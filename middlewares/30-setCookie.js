const config = require('./../libs/config');

const setCookie = options => (req, res, next) => {
  const { cookieId } = req.query;

  const { name, maxAge } = options;
  const cookie = req.cookies[name];

  if (cookie === undefined) {
    let randomNumber = cookieId || Math.random().toString();
    randomNumber =
      randomNumber[0] === '0'
        ? randomNumber.substring(2, randomNumber.length)
        : randomNumber;

    res.cookie(name, randomNumber, {
      maxAge,
      httpOnly: false
    });

    // дабы подстраховаться.
    req.cookies[name] = randomNumber;
  }

  next();
};

module.exports = setCookie({
  name: config.get('security:cookieName'),
  maxAge: config.get('security:cookieLife')
});
