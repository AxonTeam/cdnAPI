const path = require('path');

const f = path.join(__dirname, '../../assets/images/Error.png')

/**
 * Simple method to send the error image
 *
 * @param {String} dir The directory the a is in
 *
 * @param res The result thing. Idk what its called tbh
 */
function sendNotFound(res) {
    return res.sendFile(f);
}

module.exports = sendNotFound;
