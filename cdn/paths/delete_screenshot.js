const ImageModel = require('../../models/image');

module.exports = () => ({
    path: '/api/screenshots/:id',
    handler: async (req, res) => {
        const img = await ImageModel.findOne({ ID: req.params.id, type: 'screenshot' }).exec();
        if (!img) {
            res.send('ERROR - No screenshot found!');
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
        res.status(200).send('SUCCESS - Deleted image!');
        res.end();
    },
    method: 'delete',
    enabled: true,
});