const ImageModel = require('../../models/image');
const notFound = require('../functions/imageNotFound');

module.exports = () => ({
    path: ['/images/:id', '/i/:id'],
    handler: async (req, res) => {
        let query = { ID: req.params.id, type: 'image' };
        if (req.params.id && req.params.id.includes('.')) {
            let full = req.params.id.split('.');
            query.ID = full[0];
            query.ext = full[1];
        }
        const image = await ImageModel.findOne(query).exec();
        if (!image) {
            return notFound(res);
        }
        const link = new Buffer.from(image.link, 'base64');
        const head = { 'content-length': link.length };
        if (query.ext) {
            if ( ['jpg', 'jpeg'].includes(query.ext)) {
                head['content-Type'] = `image/jpeg`;
            } else {
                head['content-Type'] = `image/${query.ext}`;
            }
        }
        console.log(res.contentType);
        res.set(head);
        console.log(res)
        res.end(link);
        console.log(res);
    },
    enabled: true,
});
