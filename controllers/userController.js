const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

//New User registration
exports.register = async (req, res) => {
    try {
        const newUser = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password
        })
    
        let userData = await newUser.save()
        return res.status(200).send({
            message: 'Registration successful',
            data: userData
        })
    } catch (err) {
        return res.status(400).send({
            message: err.message,
            data:err
        })
    }
    
}

//login
exports.login = async (req, res) => {
    try {
        let userData = await User.findOne({email:req.body.email})
        if(userData) {
            if(bcrypt.compareSync(req.body.password, userData.password)) {
                let jwt_secret = process.env.JWT_SECRET 
                let token = jwt.sign({
                    data: userData
                }, jwt_secret, { expiresIn: '12h' });

                return res.status(200).send({
                    message: 'Login successful',
                    data: userData,
                    token: token
                })

            } else {
                return res.status(400).send({
                    message: 'Incorrect credentials',
                    data: {}
                })
            }
        } else {
            return res.status(400).send({
                message: 'User is not registered',
                data: {}
            })
        }
    } catch (err) {
        return res.status(400).send({
            message: err.message,
            data:err
        })
    }
}