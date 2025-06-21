"use strict";
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GEMINI });
const ProductService = require("./product.service");
const { BadRequestError } = require("../core/error.response");
const ChatMessage = require("../models/chatbot.model");
const OrderRepository = require("./repositories/order.repo");

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

const getHistory = async ({ userID, limit = 10 }) => {
  try {
    return await ChatMessage.find({ chat_user_id: userID })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();
  } catch (error) {
    throw new BadRequestError("Error getting chat history: " + error.message);
  }
};

const deleteHistory = async ({ userID }) => {
  return await ChatMessage.deleteMany({ chat_user_id: userID });
};

const sendMessageChatbot = async ({ systemPrompt, userMessage }) => {
  const promptText = systemPrompt
    ? `\`\`\`${systemPrompt}\`\`\`\n\n\`\`\`CÂU HỎI CỦA KHÁCH HÀNG: ${userMessage.trim()}\`\`\``
    : userMessage.trim();

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: promptText,
  });

  return response.text;
};

const getOrderHistory = async ({ userID }) => {
  if (!userID) throw new BadRequestError("User ID is required");

  const orderHistory = await OrderRepository.getAllOrderByUserID({
    userID,
  });
  let txtOrderHistory = "";
  orderHistory.forEach((order, index) => {
    // Thông tin đơn hàng
    txtOrderHistory += `Đơn hàng #${index + 1} (Mã: ${order._id}):\n`;
    txtOrderHistory += `• Ngày đặt: ${new Date(order.createdAt).toLocaleString(
      "vi-VN"
    )}\n`;
    txtOrderHistory += `• Trạng thái: ${
      order.status === "pending"
        ? "Chờ xác nhận"
        : order.status === "confirmed"
        ? "Đã xác nhận"
        : order.status === "shipping"
        ? "Đang giao"
        : order.status === "completed"
        ? "Đã hoàn thành"
        : order.status === "cancelled"
        ? "Đã hủy"
        : order.status
    }\n`;
    txtOrderHistory += `• Tổng tiền: ${order.checkout.totalCheckout.toLocaleString(
      "vi-VN"
    )}đ\n`;
    txtOrderHistory += `• Thanh toán: ${order.payment.method} (${
      order.payment.status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"
    })\n`;
    txtOrderHistory += `• Địa chỉ nhận: ${order.shipping.address}\n`;
    txtOrderHistory += `-----------------------------\n`;
  });

  return txtOrderHistory || "Không có lịch sử đơn hàng nào.";
};

module.exports = {
  getHistory,
  insertHistory,
  sendMessageChatbot,
  deleteHistory,
  getOrderHistory,
};
