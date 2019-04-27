const fs = require('fs');
const imageModel = require('../../models/image');

const validIDReg = /^[a-z0-9]{4,8}$/i

/**
 * Checks if a file exists
 *
 * @param {String} id The ID to check for
 */
async function checker(id) {
    if (!id) {
        throw new Error('IDCHECKER - ID is required when checking!');
    }
    if (!id.match(validIDReg)) {
        return false;
    }
    const image = await imageModel.find({ ID: id }).exec();
    if (image) {
        return false;
    }
    return true;
}

module.exports = checker;
