const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const TemplateController = require('../../controllers/template.controller')
const router = express.Router()
const {authenticateJWT, requireRole} = require('../../middleware/auth.middleware')
const { ROLE } = require('../../configs/contants')
// requireRole(ROLE.ADMIN),
router.post('', asyncHandler(TemplateController.createTemplate))

module.exports = router