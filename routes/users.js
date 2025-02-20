const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controllers')
const { body } = require('express-validator')
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/register',
  body('name').isLength({ min: 3, max: 22 }).trim(),
  body('password').isLength({ min: 3, max: 22 }),
  userController.register
)
router.post('/login', userController.login)
router.post('/upload-avatar', upload.single('image'), userController.uploadAvatar);
router.get('/:id', userController.getUserById)
router.get('/current', userController.current)
router.get('/refresh', userController.refresh)
router.post('/logout', userController.logout)

module.exports = router
