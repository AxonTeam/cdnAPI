const fs = require('fs');
const imageModel = require('../../models/image');

/**
 * Checks if a file exists
 * 
 * @param {String} id The ID to check for
 */
async function checker(id) {
  if (!id) {
      throw new Error('IDCHECKER - ID is required when checking!');
  }
  if (id.match(/\//)) {
      return false;
  }
  const image = await imageModel.find({ ID: id }).exec();
  if (image) {
      return false;
  }
  return true;
}

module.exports = checker;