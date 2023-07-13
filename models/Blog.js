const mongoose = require('mongoose');
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    coauthors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }],
    comments:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment' 
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }],
    views: {
        type: Number,
        default:0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Blog', BlogSchema)