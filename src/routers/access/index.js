"use strict";

const express = require("express")
const AccessController = require('../../controllers/access.controller')
const asyncHandler = require("../../helpers/asyncHandler")
const AuthUtils = require("../../auth/auth.utils")
const router = express.Router()

// sign up
router.post("/signup", asyncHandler(AccessController.signUp))
router.post("/login", asyncHandler(AccessController.login))

// Authentication
// router.use(AuthUtils.authentication)
// ================== //

// router.post("/logout", asyncHandler(AccessController.logout))
// router.post("/handlerRefreshToken", asyncHandler(AccessController.handlerRefreshToken))
    
module.exports = router