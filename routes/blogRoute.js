const router = require('express').Router();
const controller = require('../controllers/blogController')
const middleware = require('../middleware/authorAuth');
const middlewareUser = require('../middleware/userAuth');

//Get all blog post
router.get('/', controller.getAllBlog)

//Create new blog with only an authorized author
router.post('/create', middleware.author, controller.create)

//Get single blog
router.get('/:blog_id', controller.singleBlog)

//To like a post
router.post('/:blog_id/like', middlewareUser.authUser, controller.like)

module.exports = router;