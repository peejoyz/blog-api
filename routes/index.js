const router = require('express').Router()
const userRoute = require('./userRoute')
const profileRoute = require('./profileRoute')
const blogRoute = require('./blogRoute');
const authorRoute = require('./authorRoute')
const blogCommentRoute = require('./blogCommentRoute')

router.get('/', (req, res) => {
    res.send('Firts endpoint')
})

router.use('/user', userRoute)
router.use('/author', authorRoute)
router.use('/profile', profileRoute)
router.use('/blogs', blogRoute);
router.use('/blogs', blogCommentRoute)
module.exports = router