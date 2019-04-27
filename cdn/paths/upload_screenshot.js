const randomID = require('../functions/randomID');
const request = require('superagent')
const ImageModel = require('../../models/image');
const config = require('../../config.json');
const url = config.url || 'cdn.axonteam.org';

const extArr = [
    'jpg',
    'jpeg',
    'png',
    'gif'
]

module.exports = () => ({
    path: '/api/screenshots',
    handler: async (req, res) => {
        const uID = req.headers.uid;
        let bufferType = 'url'
        if (!uID) { // Handle if there is no user
            return res.send('Restricted access!');
        }
        if (!req.body || !req.body.buffer) {
            return res.status(206).send('Missing image buffer!');
        }
        if (req.body.extension && !extArr.includes(req.body.extension)) {
            res.send('ERROR - Invalid Extension! Allowed extensions: "jpg"/"jpeg", "png", and "gif"');
            return res.end();
        }
        if (req.body.bufferType && req.body.bufferType === 'buffer') {
            bufferType = 'buffer'
        }
        const id = await randomID();
        const img = await ImageModel.findOne({ ID: id, type: 'screenshot' }).exec()
        if (img) {
            res.send('ID already used! Try again');
            return res.end();
        }
        console.log(req.body.buffer)
        let result = bufferType === 'url' ? await request.get(req.body.buffer) : req.body.buffer;
        if (bufferType === 'url') {
            if (!result) {
                res.send('ERROR - Invalid URL, Enter a valid URL')
            }
            result = result.body;
        }
        let image = await new ImageModel({ ID: id, type: 'screenshot', uploaderID: uID, link: result, ext: req.body.extension || 'png' }); // Save to database
        image = await image.save();
        if (!image) {
            return res.send('Error while adding to database!');
        }
        console.log(`API UPLOAD | Screenshot ${id} uploaded by ${uID}!`)
        res.send(`${url}/s/${id}`);
        res.end();
    },
    method: 'post',
    enabled: true
});
