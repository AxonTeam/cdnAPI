const path = require('path');
const fs = require('fs');

module.exports = (dir) => ({
    path: '/banners/full/AxonCore',
    handler: (req, res) => {
        const logo = path.join(dir, './cdn/banners/full/AxonCore.png');
        if (!fs.existsSync(logo)) {
            res.send('Error, file not found!');
        }
        res.sendFile(logo);
    },
    enabled: true
})