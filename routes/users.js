const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controllers')
const { body } = require('express-validator')

router.post(
  '/login',
  body('name').isLength({ min: 3, max: 28 }).trim(),
  body('password').isLength({ min: 3, max: 28 }),
  userController.register
)
router.get('/current', userController.current)
router.get('/refresh', userController.refresh)
router.get('/logout', userController.logout)

module.exports = router
