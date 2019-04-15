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

module.exports = () => ({
    path: '/api/images',
    handler: async (req, res) => {
        let type = 'image';
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
        const result = await request.get(req.body.buffer);
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
        let image = await new ImageModel({ ID: id, type, uploaderID: uID, link: result.body }); // Save to database
        image = await image.save();
        if (!image) {
            return res.send('Error while adding to database!');
        }
        console.log(`API UPLOAD | ${type} ${id} uploaded by ${uID}`)
        res.send(`${url}/${type}s/${id}`);
        res.end();
    },
    method: 'post',
    enabled: true
});
