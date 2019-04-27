const fs = require('fs');
const path = require('path');
const request = require('superagent');

const ImageModel = require('../../models/image');
const config = require('../../config.json');
const randomID = require('../functions/randomID');
const url = config.url || 'cdn.axonteam.org';
const nameReg = /\.|\||<|>|\?|\*/;

const typeArr = [
    'banner',
    'logo',
    'image'
]

const extArr = [
    'gif',
    'png',
    'jpg',
    'jpeg'
]

module.exports = () => ({
    path: '/api/images',
    handler: async (req, res) => {
        let type = 'image';
        let bufferType = 'url';
        const uID = req.headers.uid;
        if (!uID) { // Handle if there is no user
            return res.status(401).send('Restricted access!');
        }
        if (!req.body.buffer) {
            return res.status(206).send('Missing image buffer!');
        }
        if (req.body.name && nameReg.test(req.body.name)) {
            res.send('ERROR - Invalid Name!');
            return res.end();
        }
        if (req.body.extension && !extArr.includes(req.body.extension)) {
            res.send('ERROR - Invalid Extension! Allowed extensions: "jpg"/"jpeg", "png", and "gif"');
            return res.end();
        }
        if (req.body.bufferType && req.body.bufferType === 'buffer') {
            bufferType = 'buffer'
        }
        let result = (bufferType === 'url') ? await request.get(req.body.buffer) : req.body.buffer;
        if (bufferType === 'url') {
            if (!result) {
                res.send('ERROR - Invalid URL, Enter a valid URL')
            }
            result = result.body;
        }
        if (req.body && req.body.type) {
            if (!typeArr.includes(req.body.type)) {
                res.send('ERROR - Invalid type');
                return res.end();
            }
            type = req.body.type;
        }
        const id = req.body.name || await randomID();
        const img = await ImageModel.findOne({ ID: id, type }).exec()
        if (img) {
            let text = 'ID already used! Try again.';
            if (req.body.name && req.body.name === type) {
                text = 'ID already used! Try again with a different ID.';
            }
            res.send(text);
            return res.end();
        }
        let image = await new ImageModel({ ID: id, type, uploaderID: uID, link: result.body, ext: req.body.extension || 'png' }); // Save to database
        image = await image.save();
        if (!image) {
            return res.send('Error while adding to database!');
        }
        let endType = type === 'image' ? 'i' : `${type}s`;
        console.log(`API UPLOAD | ${type} ${id} uploaded by ${uID}`)
        res.send(`${url}/${endType}/${id}`);
        res.end();
    },
    method: 'post',
    enabled: true
});
