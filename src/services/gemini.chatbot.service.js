"use strict";
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: 'AIzaSyAyzKNr1UzR260gmjel_H-ufpHbQQfBJVc' });
const ProductService = require("./product.service");
const { BadRequestError } = require("../core/error.response");
const ChatMessage = require('../models/chatbot.model')

/**
 * insert message to chat history 
 */
const insertHistory = async ({ userID, isBot, message }) => {
  try {
    const chat = new ChatMessage({ chat_user_id: userID, isBot, message });
    return await chat.save();
  } catch (error) {
    throw new BadRequestError("Error inserting chat history: " + error.message);
  }
};

const getHistory = async ({ userID, limit = 30 }) => {
  try {
    return await ChatMessage.find({ chat_user_id: userID })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  } catch (error) {
    throw new BadRequestError("Error getting chat history: " + error.message);
  }
};

const deleteHistory = async ({ userID }) => {
  return await ChatMessage.deleteMany({ chat_user_id: userID })
}

const sendMessageChatbot = async ({ systemPrompt, userMessage }) => {
  const promptText = systemPrompt ? `\`\`\`${systemPrompt}\`\`\`\n\n\`\`\`CÂU HỎI CỦA KHÁCH HÀNG: ${userMessage.trim()}\`\`\`` : userMessage.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: promptText,
    });
    
    return response.text
}

module.exports = {
  getHistory,
  insertHistory,
  sendMessageChatbot,
  deleteHistory
};
