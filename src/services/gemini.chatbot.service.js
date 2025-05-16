"use strict";
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.AI_GEMINI_API_KEY });

class GeminiChatbotService {
  static async call(contents) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });
    console.log(response.text);
  }
}
GeminiChatbotService.call(
  "Mục đích: Tạo một chatbot có thể trả lời các câu hỏi của người dùng về sản phẩm, giúp tư vấn cho khách hàng. Phương thức tích hợp : Sử dụng API của Gemini để gửi câu hỏi và nhận câu trả lời từ. Ngôn ngữ và công nghệ: Sử dụng Node.js và Express để xây dựng API cơ sở dữ liệu mà mongodb. Bạn sẽ làm việc với cấu trúc dữ liệu JSON"
);
module.exports = GeminiChatbotService;
