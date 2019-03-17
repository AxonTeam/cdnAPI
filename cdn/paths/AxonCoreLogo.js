const path = require('path');
const fs = require('fs');

module.exports = (dir) => ({
    path: '/logos/AxonCore',
    handler: (req, res) => {
        const logo = path.join(dir, './cdn/logos/AxonCore.png');
        if (!fs.existsSync(logo)) {
            res.send('Error, file not found!');
        }
        res.sendFile(logo);
    },
    enabled: true
})