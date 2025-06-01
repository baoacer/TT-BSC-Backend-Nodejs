'use strict'
const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const ChatController = require('../../controllers/chat.controller')
const router = express.Router()
    
router.post('', asyncHandler(ChatController.postUserMessage))
router.get('', asyncHandler(ChatController.getChatHistory))
router.delete('', asyncHandler(ChatController.deleteChatHistory))

module.exports = router