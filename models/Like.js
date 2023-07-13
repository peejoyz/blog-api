const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Like', LikeSchema);
