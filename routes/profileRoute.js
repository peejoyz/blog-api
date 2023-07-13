const router = require('express').Router();
const controller = require('../controllers/profileController')
const middleware = require('../middleware/userAuth');
const middlewareAuthor = require('../middleware/authorAuth');

//return current authenticated user
router.get('/current-user', middleware.authUser, controller.current_user)

//return current authenticated user
router.get('/current-author', middlewareAuthor.author, controller.current_author)

module.exports = router; 