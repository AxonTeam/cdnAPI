const path = require('path')

module.exports = dir => ({
    path: '/logos/',
    handler: (req, res) => {
        const file = path.join(dir, './cdn/html/logos.html');
        res.sendFile(file);
    },
    enabled: true
})