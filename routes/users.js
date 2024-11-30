const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controllers')
const { body } = require('express-validator')

router.post(
  '/register',
  body('name').isLength({ min: 3, max: 28 }).trim(),
  body('password').isLength({ min: 3, max: 28 }),
  userController.register
)
router.post('/login', userController.login)
router.get('/:id', userController.getUserById)
router.get('/current', userController.current)
router.get('/refresh', userController.refresh)
router.post('/logout', userController.logout)

module.exports = router
