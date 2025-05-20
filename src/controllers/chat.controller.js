'use strict'
const {SuccessResponse} = require('../core/success.response')
const GeminiService = require('../services/gemini.chatbot.service')

class ChatController {
    askChat = async (req, res, next) => {
        new SuccessResponse({
            message: "Chat Response",
            metadata: await GeminiService.searchProductsByAI(req.body)
        }).send(res)
    }
}

module.exports = new ChatController()