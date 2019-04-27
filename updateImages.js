
const mongoose = require('mongoose')
const ImageModel = require('./models/image');

mongoose.connect('mongodb://localhost/AxonTeam', {
    useCreateIndex: true,
    autoReconnect: true,
    useNewUrlParser: true
});

async function set() {
    const images = await ImageModel.find({ ext: undefined }).exec()
    if (images.length === 0) {
        console.log('No images/screenshots found with no extension!')
        process.exit()
    }
    let count = 0;
    for (const image of images) {
        const img = await ImageModel.findOneAndUpdate({ ID: image.ID }, { ext: 'png' }).exec();
        if (!img) {
            console.log(`Failed updating a ${image.type}!`)
        } else {
            console.log(`Updated ${image.type} ${image.ID}!`)
            count++;
        }
    }
    console.log(`Succesfully updated ${count} images/screenshots out of ${images.length}`)
    process.exit()
}

const db = mongoose.connection;

db.once('open', async() => set() );
