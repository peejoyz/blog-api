const router = require('express').Router();
const controller = require('../controllers/blogComment')
// const middleware = require('../middleware/authorAuth');
const middlewareUser = require('../middleware/userAuth');

//Posting comment on a blog
router.post('/:blog_id/comments/create', middlewareUser.authUser, controller.create)

module.exports = router;