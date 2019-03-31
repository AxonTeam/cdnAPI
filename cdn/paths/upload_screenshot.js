console.log('Recived POST request to api/screenshots');
const randomID = require('../functions/randomID');
const request = require('superagent')
const ImageModel = require('../../models/image');
const config = require('../../config.json');
const url = config.url || 'cdn.axonteam.org';

module.exports = dir => ({
    path: '/api/screenshots',
    handler: async (req, res) => {
        const uID = req.headers.uid;
        if (!uID) { // Handle if there is no user
            return res.send('Restricted access!');
        }
        if (!req.body || !req.body.buffer) {
            return res.status(206).send('Missing image buffer!');
        }
        const id = await randomID();
        const img = await ImageModel.findOne({ ID: id, type: 'screenshot' }).exec()
        if (img) {
            res.send('ID already used! Try again');
            return res.end();
        }
        const result = await request.get(req.body.buffer);
        let image = await new ImageModel({ ID: id, type: 'screenshot', uploaderID: uID, link: result.body }); // Save to database
        image = await image.save();
        if (!image) {
            return res.send('Error while adding to database!');
        }
        res.send(`${url}/screenshots/${id}`);
        res.end();
    },
    method: 'post',
    enabled: true
});