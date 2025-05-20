'use strict'
const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const ChatController = require('../../controllers/chat.controller')
const router = express.Router()
    
router.get('', asyncHandler(ChatController.askChat))

module.exports = router