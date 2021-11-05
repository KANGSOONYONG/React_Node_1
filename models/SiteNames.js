const mongoose = require('mongoose');


const siteSchema = mongoose.Schema({
    name: {
        type: String
    },
    link: {
        type: String
    }
})


const SiteNames = mongoose.model('SiteNames', siteSchema)

module.exports = { SiteNames };