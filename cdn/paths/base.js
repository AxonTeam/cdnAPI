const path = require('path')

module.exports = dir => ({
    path: '/',
    handler: (req, res) => {
        const file = path.join(dir, './cdn/html/base.html');
        res.sendFile(file);
    },
    enabled: true
})