const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageModel = new Schema({
    ID: { type: String, required: true }, // Image ID
    type: { type: String, required: true },

    uploaderID: { type: String, required: true }, // Uploader ID
    link: { type: Buffer, required: true },
});

module.exports = mongoose.model('image', imageModel);