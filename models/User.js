const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})

//before saving the schema -- Hash the password
UserSchema.pre('save', function(next) {
    let user = this;
    //only hash the password if it has been modified (or is new)
    if(!user.isModified('password')) return next();

    //generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if(err) return next(err);
        //hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            //override the cleartext password with the hashed one
            user.password = hash;
            next();
        })
    })
})

module.exports = mongoose.model('User', UserSchema)