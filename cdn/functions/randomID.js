const Crypto = require('crypto');

/**
 * Generates a random ID
 * 
 * @param {String} type The type of image to generate a id for
 */
async function randomID() {
    let id = generator();
    while (id.match(/\/|\\/) === false) {
        id = generator();
    }
    return id;
}

function generator() {
    return Crypto.randomBytes(4).toString('base64').slice(2).replace(/=/g, '');
}

module.exports = randomID;