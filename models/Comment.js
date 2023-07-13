const mongoose = require('mongoose');
const Commentschema = new mongoose.Schema({
	comment: {
        type: String
    },
	blog_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Blog' 
    },
	user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
},{
    timestamps:true,
});

module.exports = mongoose.model('Comment', Commentschema)