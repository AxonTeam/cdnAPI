const fs = require('fs');
const path = require('path');
const request = require('superagent');

const ImageModel = require('../../models/image');
const config = require('../../config.json');
const randomID = require('../functions/randomID');
const url = config.url || 'cdn.axonteam.org';
const typeReg = /logo|banner/;
const nameReg = /\.|\||<|>|\?|\*/;

module.exports = dir => ({
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
            if (!typeReg.test(req.body.type)) {
                res.send('ERROR - Invalid type');
                return res.end();
            }
            type = req.body.type;
        }
        const id = req.body.name || await randomID();
        let image = await new ImageModel({ ID: id, type, uploaderID: uID, link: result.body }); // Save to database
        image = await image.save();
        if (!image) {
            return res.send('Error while adding to database!');
        }
        res.send(`${url}/${type}/${id}`);
        res.end();
    },
    method: 'post',
    enabled: true
});