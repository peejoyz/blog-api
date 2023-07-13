const mongoose = require('mongoose');
const AuthorSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Author', AuthorSchema)