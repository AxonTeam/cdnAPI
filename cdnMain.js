// Node modules
const express = require('express'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    bodyparser = require('body-parser');

const checkHash = require('./token/checkHash');
const config = require('./config.json');
// Clients
const app = express();

app.use(express.static(path.join(__dirname, './cdn/html')));

app.use(bodyparser.json());

const baseMongoURL = 'mongodb://';
const mongoURL = baseMongoURL + (config.mongoURL || 'localhost/AxonTeam');

mongoose.connect(mongoURL, {
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
    if (!req.headers.id || !req.headers.id.match(/root|Nucleus/)) {
        console.log('API/IMAGES - Invalid ID');
        res.status(401).send('Unauthorized');
        return res.end();
    }
    const check = await checkHash(req.headers.id, req.headers.token);
    if (check !== true) {
        res.status(401).send('Unauthorized');
        res.end();
    }
    next();
})

app.use('/api/images/*', async (req, res, next) => {
    if (!req.headers.id || !req.headers.id.match(/root|Nucleus/)) {
        console.log('API/IMAGES - Invalid ID');
        res.status(401).send('Unauthorized');
        return res.end();
    }
    const check = await checkHash(req.headers.id, req.headers.token);
    if (check !== true) {
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
    const id = req.headers.id || req.headers.uid;
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
    const id = req.headers.id || req.headers.uid;
    const check = await checkHash(id, req.headers.token);
    if (check !== true) {
        res.status(401).send('Unauthorized');
        return res.end();
    }
    next();
});


// Initalize a cdn path
function init(cdnpath) {
    const file = require(`./cdn/paths/${cdnpath}`)(dir);
    if (!file || !file.path || !file.handler) {
        return null;
    }
    if (!file.enabled || file.enabled !== true) {
        return null;
    }
    if (!file.method || file.method === 'get') {
        if (Array.isArray(file.path)) {
            for (const fPath of file.path) {
                app.get(fPath, file.handler);
            }
        } else {
            app.get(file.path, file.handler);
        }
    } else if (file.method === 'post') {
        if (Array.isArray(file.path)) {
            for (const fPath of file.path) {
                app.post(fPath, file.handler);
            }
        } else {
            app.post(file.path, file.handler);
        }
    } else if (file.method === 'delete') {
        if (Array.isArray(file.path)) {
            for (const fPath of file.path) {
                app.delete(fPath, file.handler);
            }
        } else {
            app.delete(file.path, file.handler);
        }
    }
    const out = Array.isArray(file.path) ? file.path[0] : file.path;
    console.log(`Loaded path "${out}"!`);
}

// Initalize all cdn paths
for(const cdnpath of paths) {
    init(cdnpath)
}

// If they try to go to a invalid path
app.all('*', (req, res) => {
    if (req.method === 'GET') {
        const file = path.join(dir, './cdn/html/notfound.html');
        return res.sendFile(file);
    }
    return res.status(404).send('Error 404 Not Found')
})

const server = http.createServer(app);

const port = config.port || 80;

server.listen(port);
