const Author = require('../models/Author')
const jwt = require('jsonwebtoken')

//New User registration
exports.registerAuthor = async (req, res) => {
    try {
        const newAuthor = new Author({
            fullname: req.body.fullname,
            email: req.body.email,
        })
    
        let authorData = await newAuthor.save()
        return res.status(200).send({
            message: 'Author Registration successful',
            data: authorData
        })
    } catch (err) {
        return res.status(400).send({
            message: err.message,
            data:err
        })
    }
    
}

//login
exports.loginAuthor = async (req, res) => {
    try {
        let authorData = await Author.findOne({email:req.body.email})
        if(authorData) {
                let jwt_secret = process.env.JWT_SECRET 
                let token = jwt.sign({
                    data: authorData
                }, jwt_secret, { expiresIn: '12h' });

                return res.status(200).send({
                    message: 'Author Login successful',
                    data: authorData,
                    token: token
                })
        } else {
            return res.status(400).send({
                message: 'Not registered',
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