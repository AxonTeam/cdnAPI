const express = require('express'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path');
const app = express();


app.locals.title = 'AxonTeam CDN';
const dir = __dirname

const paths = fs.readdirSync('./cdn/paths');

function init(path) {
    const file = require(`./cdn/paths/${path}`)(dir);
    if (!file || !file.path || !file.handler) {
        return null;
    }
    if (!file.enabled || file.enabled !== true) {
        return null;
    }
    if (!file.method || file.method === 'get') {
        app.get(file.path, file.handler);
    } else if (file.method === 'put') {
        app.put(file.path, file.handler);
    }
    console.log(`Loaded CDN path ${file.path}!`);
}

for(const path of paths) {
    init(path)
}

app.use('/images', express.static('./cdn/images'));
app.use('/screenshots', express.static('./cdn/screenshots'));
app.use('/i', express.static('./cdn/images'));
app.use('/s', express.static('./cdn/screenshots'));

app.use('*', (req, res) => {
    const file = path.join(dir, './cdn/html/notfound.html');
    res.sendFile(file);
})

const server = http.createServer(app),
    httpsServer = https.createServer(app);

server.listen(80);
httpsServer.listen(443)