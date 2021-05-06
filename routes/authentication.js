const express = require('express');
const db = require('./../libs/db');

const router = express.Router();

router.post('/login', async (req, res) => {});

router.get('/user', async (req, res) => {
  res.send({ ok: 'ok' });
});

router.post('/register', async (req, res) => {
  const { password, email } = req.body;
  const hashedPassword = await db.Admin.generatePasswordHash(password);

  await db.Admin.CreateUser(email, hashedPassword)

    .then(() => {
      res.send({ message: 'An account has been created!' });
    })
    .catch(err => {
      throw err;
    });
});

module.exports = router;
