const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const { profiles, profile } = require('../../controllers/profile.controller')
const { grantAccess } = require('../../middlewares/rbac')
const router = express.Router()
    
router.get('/viewAny', grantAccess('readAny', 'profile'), asyncHandler(profiles))
router.get('/viewOwn', grantAccess('readOwn', 'profile'), asyncHandler(profile))

module.exports = router