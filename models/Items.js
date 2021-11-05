const mongoose = require('mongoose');


const ItemsSchema = mongoose.Schema({
    youtuber: {
        type: String
    },
    siteName: {
        type: String
    },
    code: {
        type: String
    }
})

const Items = mongoose.model('Items', ItemsSchema)

module.exports = { Items };