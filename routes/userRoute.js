const router = require('express').Router();
const controller = require('../controllers/userController')

//Register User
router.post('/register', controller.register)
//Post - Login User
router.post('/login', controller.login)

module.exports = router;