const ImageModel = require('../../models/image');
const notFound = require('../functions/imageNotFound')

module.exports = () => ({
    path: '/i/images/:id',
    handler: async (req, res) => {
        const image = await ImageModel.findOne({ ID: req.params.id, type: 'image' }).exec();
        if (!image) {
            return notFound(dir, res);
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