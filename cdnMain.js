// Node modules
const express = require('express'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    request = require('superagent'),
    bodyparser = require('body-parser');
    
const checkHash = require('./token/checkHash');
// Clients
const app = express();

app.use(bodyparser.json());

mongoose.connect('mongodb://localhost/AxonTeam', {
    useCreateIndex: true,
    autoReconnect: true,
    useNewUrlParser: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to AxonTeam Database!'));

app.locals.title = 'AxonTeam CDN';
const dir = __dirname

const paths = fs.readdirSync('./cdn/paths');

// ROOT checker, images are restricted to ROOT (or nucleus)
app.use('/api/images/', async(req, res, next) => {
    if (!req.headers.id || !req.headers.id.match(/root|nucleus/)) {
        res.status(401).send('Unauthorized');
        return res.end();
    }
    const check = await checkHash('root', req.headers.token);
    if(check !== true) {
        res.status(401).send('Unauthorized');
        res.end();
    }
    next();
})

app.use('/api/images/*', async (req, res, next) => {
    if (!req.headers.id || !req.headers.id.match(/root|nucleus/)) {
        res.status(401).send('Unauthorized');
        return res.end();
    }
    const check = await checkHash(req.headers.id, req.headers.token);
    if(check !== true) {
        res.status(401).send('Unauthorized');
        return res.end();
    }
    next();
})

// Normal checker for the api. Restricted to users with token.
app.use('/api/screenshots', async (req, res, next) => {
    if (!req.headers.uid) {
        res.status(401).send('Unauthorized');
        return res.end();
    }
    const id = req.header.id || req.headers.uid;
    const check = await checkHash(id, req.headers.token);
    if (check !== true) {
        res.status(401).send('Unauthorized');
        return res.end();
    }
    next();
});

app.use('/api/screenshots/*', async (req, res, next) => {
    if (!req.headers.uid) {
        res.status(401).send('Unauthorized');
        return res.end();
    }
    const id = req.header.id || req.headers.uid;
    const check = await checkHash(id, req.headers.token);
    if (check !== true) {
        res.status(401).send('Unauthorized');
        return res.end();
    }
    next();
});


// Initalize a cdn path
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
        if (file.alias) {
            app.get(file.alias, file.handler);
        }
    } else if (file.method === 'post') {
        app.post(file.path, file.handler);
        if (file.alias) {
            app.post(file.alias, file.handler);
        }
    } else if (file.method === 'delete') {
        app.delete(file.path, file.handler);
        if (file.alias) {
            app.delete(file.alias, file.handler);
        }
    }
    console.log(`Loaded path "${file.path}"!`);
}

// Initalize all cdn paths
for(const path of paths) {
    init(path)
}

// If they try to go to a invalid path
app.use('/*', (req, res) => {
    const file = path.join(dir, './cdn/html/notfound.html');
    res.sendFile(file);
})

const server = http.createServer(app),
    httpsServer = https.createServer(app);

server.listen(80);
httpsServer.listen(443);