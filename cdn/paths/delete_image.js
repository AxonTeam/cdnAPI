const ImageModel = require('../../models/image');

const typeArr = [
    'image',
    'logo',
    'banner'
]

module.exports = dir => ({
    path: '/api/images/:id',
    handler: async (req, res) => {
        let type = 'image'
        if (req.body && req.body.type) {
            if (!typeArr.includes(req.body.type)) {
                res.send('ERROR - Invalid type');
                return res.end();
            }
            type = req.body.type;
        }
        const img = await ImageModel.findOne({ ID: req.params.id, type }).exec();
        if (!img) {
            res.send(`ERROR - No ${type} found!`);
            return res.end();
        }
        if (img.uploaderID !== req.headers.uid) {
            res.send('ERROR - Restricted access!');
            return res.end();
        }
        const del = await ImageModel.deleteOne({ ID: img.ID });
        if(!del || del.ok === 0) {
            res.send('ERROR - Failed to delete');
            return res.end();
        }
        console.log(`API DELETE | Image ${req.params.id} deleted by ${req.headers.uid}`)
        res.send(`SUCCESS - Deleted ${type}!`);
        res.end();
    },
    method: 'delete',
    enabled: true,
});
