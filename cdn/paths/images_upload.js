const imageModel = require('../../models/image');
const fs = require('fs');
const path = require('path')

module.exports = dir => ({
    path: 'api/upload/image',
    handler: (req, res) => {
        const id = randomID();
        if (req.body.id !== '323673862971588609') {
            return res.send('Error! Not authorized!');
        }
        const file = path.join(dir, `../images/${id}.png`);
        fs.writeFileSync(file, req.body.buffer);
    },
    method: 'put',
})

function randomID() {
    let id = [...Array(4)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
    while (checker(id) === true) {
        id = [...Array(4)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
    }
    return id
}

function checker(id) {
    if (imageModel.find({ ID: id })) {
        return true;
    }
    return false;
}