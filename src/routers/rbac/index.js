'use strict'

const express = require('express')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const RBACController = require('../../controllers/rbac.controller')

router.post('/role', asyncHandler(RBACController.newRole))
router.get('/roles', asyncHandler(RBACController.getRoles))

router.post('/resource', asyncHandler(RBACController.newResource))
router.get('/resources', asyncHandler(RBACController.getResources))

module.exports = router

