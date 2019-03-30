const path = require('path');

/**
 * Simple method to send the error image
 * 
 * @param {String} dir The directory the a is in
 * 
 * @param res The result thing. Idk what its called tbh
 */
function sendNotFound(dir, res) {
    const f = path.join(dir, './assets/images/Error.png');
    res.sendFile(f);
    return res.end();
}

module.exports = sendNotFound;