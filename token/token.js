const hashToken = require('./hash');
const UserModel = require('../models/user');

function tokenize(token) {
  const userID = Buffer.from(token).toString('base64');
  const date = Buffer.from(new Date().getUTCMilliseconds().toString()).toString('base64');
  const Crypto = require('crypto');
  const tokenize = Crypto.randomBytes(48).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const endToken = `${userID}.${date}.${tokenize}`;
  return endToken;
}

async function generator(userID) {
  let uID = userID;
  if (userID === 'root') {
    const Crypto = require('crypto');
      userID = Crypto.randomBytes(256).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      uID - 'root';
  }
  const token = tokenize(userID);
  const endToken = hashToken(token);
  const user = new UserModel({ ID: uID, token: endToken });
  await user.save();
  return token;
}
  
module.exports = generator;