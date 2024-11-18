const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth-middleware')
const commentController = require('../controllers/comment-controller')

router.get('/', authMiddleware, commentController.getAllComments)
router.get('/:id', authMiddleware, commentController.getCommentById)
router.post('/add', authMiddleware, commentController.addComment)
router.put('/edit/:id', authMiddleware, commentController.editComment)
router.delete('/remove/:id', authMiddleware, commentController.removeComment)

module.exports = router
