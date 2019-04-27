const ImageModel = require('../../models/image');
const path = require('path')

module.exports = () => ({
    path: '/logos/:id',
    handler: async (req, res) => {
        let query = { ID: req.params.id, type: 'logo' };
        if (req.params.id && req.params.id.includes('.')) {
            let full = req.params.id.split('.');
            query.ID = full[0];
            query.ext = full[1];
        }
        console.log(query)
        const image = await ImageModel.findOne(query).exec();
        if (!image) {
            return res.sendFile(path.join(__dirname, '../../assets/red_axonteam_logo.png'))
        }
        const link = new Buffer.from(image.link, 'base64');
        const head = { 'content-length': link.length };
        res.set(head);
        res.end(link);
        console.log(res.rawHeaders)
    },
    enabled: true,
    method: 'get'
})
