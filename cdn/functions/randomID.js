const Crypto = require('crypto');
const idChecker = require('./idChecker');

/**
 * Generates a random ID
 *
 * @param {String} type The type of image to generate a id for
 */
async function randomID() {
    let id = generator();
    while (!idChecker(id)) {
        id = generator();
    }
    return id;
}

function generator() {
    return Crypto.randomBytes(4).toString('base64').slice(2).replace(/=/g, '');
}

module.exports = randomID;
