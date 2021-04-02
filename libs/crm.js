const fetch = require('node-fetch');

const crm = {
  send(data) {
    fetch('https://brokenxerox.ru/amo/domadoma/toamo.php', {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }
};

module.exports = crm;
