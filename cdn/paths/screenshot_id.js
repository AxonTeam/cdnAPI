const ImageModel = require('../../models/image');

module.exports = () => ({
    path: '/i/screenshots/:id',
    handler: async (req, res) => {
        const image = await ImageModel.findOne({ ID: req.params.id, type: 'screenshot' }).exec();
        if (!image) {
            return res.send('Screenshot not found!');
        }
        const link = new Buffer.from(image.link, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': link.length
        });
        res.end(link);
    },
    enabled: true,
})