const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const RoleController = require('../../controllers/role.controller');
const { requireRole } = require('../../middleware/auth.middleware');
const router = express.Router();

router.use(requireRole('Admin'));

router.post('/', asyncHandler(RoleController.createRole));
router.post('/assign', asyncHandler(RoleController.assignRoleToUser));
router.get('/', asyncHandler(RoleController.getAllRoles));

module.exports = router;