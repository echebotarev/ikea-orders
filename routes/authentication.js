const express = require('express');
const passport = require('passport');

const router = express.Router();
const db = require('./../libs/db');

router.post('/login', async (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, message) => {
    if (err) {
      console.log('Authenticate local Error 500:', err);
      return res.status(500).send(err);
    } else if (!user) {
      console.log('Authenticate local Error 403:', message);
      return res.status(403).send(message);
    } else {
      const token = db.Admin.signUserToken(user);
      return res.send({ token });
    }
  })(req, res);
});

router.get('/user', async (req, res) => {
  passport.authenticate('jwt', { session: false }, (err, user, message) => {
    if (err) {
      console.log('Authenticate jwt Error 400:', err);
      return res.status(400).send(err);
    } else if (!user) {
      console.log('Authenticate jwt Error 403:', message);
      return res.status(403).send({ message });
    } else {
      return res.send({ user });
    }
  })(res, req);
});

router.post('/register', async (req, res) => {
  const { password, email } = req.body;
  const hashedPassword = await db.Admin.generatePasswordHash(password);

  let result;
  try {
    result = await db.Admin.CreateUser(email, hashedPassword);
  } catch (e) {
    console.error('Err', e);
  }

  res.send(result);
});

module.exports = router;
