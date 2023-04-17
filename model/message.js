const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    text: String,
})

module.exports = mongoose.model('Message', messageSchema)