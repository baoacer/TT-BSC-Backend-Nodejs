const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const UserController = require('../../controllers/user.controller')
const router = express.Router()
const validation = require('../../validations/user.validation')
    
router.post('/signUp', validation.signUp, asyncHandler(UserController.signUp))
router.post('/login', validation.login, asyncHandler(UserController.login))

module.exports = router