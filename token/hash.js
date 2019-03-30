const bcrypt = require('bcrypt');

const createHash = (token) => {
  const hash = bcrypt.hashSync(token, 10);
  return hash;
};

module.exports = createHash;