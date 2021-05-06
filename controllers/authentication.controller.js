const Admin = require('../model/admin');
const bcrypt = require('bcrypt');

async function generatePasswordHash(plainPassword) {
  const salt = await bcrypt.genSalt(12);
  console.log('Salt', salt);

  return await bcrypt.hash(plainPassword, salt);
}

async function CreateUser(email, password) {
  return await Admin.create({ email, password })
    .then(data => {
      return data;
    })
    .catch(error => {
      throw error;
    });
}

async function GetUser(email) {
  return await Admin.findOne({ email })
    .then(data => {
      return data;
    })
    .catch(error => {
      throw error;
    });
}

module.exports = {
  CreateUser,
  GetUser,

  generatePasswordHash
};
