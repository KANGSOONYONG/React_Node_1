const mongoose = require('mongoose');


const youtuberSchema = mongoose.Schema({
    youtuber: {
        type: String
    }
})

const Youtubers = mongoose.model('Youtubers', youtuberSchema)

module.exports = { Youtubers };