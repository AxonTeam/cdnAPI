const path = require('path')

module.exports = dir => ({
    path: '/banners/',
    handler: (req, res) => {
        const file = path.join(dir, './cdn/html/banners.html');
        res.sendFile(file);
    },
    enabled: true
})