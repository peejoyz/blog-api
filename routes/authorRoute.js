const router = require('express').Router();
const controller = require('../controllers/authorController')

//Register an Author
router.post('/register', controller.registerAuthor)
//Login an Author
router.post('/login', controller.loginAuthor)

module.exports = router;