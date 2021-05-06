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

  let result;
  try {
    result = await db.Admin.CreateUser(email, hashedPassword);
  }
  catch (e) {
    console.error('Err', e);
  }

  res.send(result);
});

module.exports = router;
