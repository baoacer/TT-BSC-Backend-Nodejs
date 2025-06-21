const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const UserController = require('../../controllers/user.controller')
const router = express.Router()
const validation = require('../../validations/user.validation')
const { authenticateJWT, requireRole } = require('../../middleware/auth.middleware')
const { ROLE } = require('../../configs/contants')
    
router.post('/signup', validation.email, asyncHandler(UserController.sendEmailSignup))
router.post('/login', validation.login, asyncHandler(UserController.login))
router.get('/welcome-back', asyncHandler(UserController.signup))
router.post('/reset', validation.email,asyncHandler(UserController.reset))

router.use(authenticateJWT)

router.patch('/:userID', validation.update, requireRole(ROLE.USER), asyncHandler(UserController.updateUserInfo))
router.post('/change-password', requireRole(ROLE.USER), asyncHandler(UserController.changePassword))
router.get('/', requireRole(ROLE.ADMIN), asyncHandler(UserController.getUsers))
router.post('/active', requireRole(ROLE.ADMIN), asyncHandler(UserController.activeUser))

module.exports = router