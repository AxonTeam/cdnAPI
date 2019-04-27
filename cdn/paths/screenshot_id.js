const ImageModel = require('../../models/image');
const notFound = require('../functions/imageNotFound')

module.exports = () => ({
    path: ['/screenshots/:id', '/s/:id'],
    handler: async (req, res) => {
        const image = await ImageModel.findOne({ ID: req.params.id, type: 'screenshot' }).exec();
        if (!image) {
            return notFound(res)
        }
        const link = new Buffer.from(image.link, 'base64');
        res.writeHead(200, {
            'Content-Type': `image/${image.ext || 'png'}`,
            'Content-Length': link.length
        });
        res.end(link);
    },
    enabled: true,
})
