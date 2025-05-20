"use strict";
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.AI_GEMINI_API_KEY });
const ProductService = require("./product.service");
const Utils = require("../utils");

/**
 🧑 Người dùng hỏi → 🔁 Gửi về API Node.js
  → Truy vấn database (lọc theo từ khóa hoặc category, price)
  → Chọn ra 5–10 sản phẩm phù hợp nhất
  → Tạo prompt: “Chỉ dùng thông tin dưới đây để tư vấn...”
  → Gửi prompt cho Gemini API
  → Trả lại phản hồi cho người dùng 
 */
class GeminiChatbotService {
  static async call(contents) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: contents,
    });
    console.log(response.text);
  }

  static async extractKeywordsFromMessage(userMessage) {
    const prompt = `
      Bạn là trợ lý AI. Hãy phân tích câu sau và trích xuất các từ khóa liên quan đến tư vấn sản phẩm.
      Trả kết quả dưới dạng JSON có cấu trúc sau:
      {
        "features": [các đặc điểm người dùng yêu cầu],
        "max_price": (giá tối đa, nếu có, đơn vị VND),
        "min_price": (giá tối thiểu, nếu có, đơn vị VND)
      }
      Câu hỏi: "${userMessage}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const text = response.text;

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Không tìm thấy JSON trong phản hồi.");
      }
    } catch (err) {
      console.error("Lỗi khi phân tích phản hồi Gemini:", err);
      console.log("Phản hồi thô:", text);
      return null;
    }
  }

  static async searchProductsByAI({message}) {
    const { features, max_price, min_price } = await GeminiChatbotService.extractKeywordsFromMessage(message);

    const { data: results } = await ProductService.searchProducts({
      keyword: Array.isArray(features) ? features.join(" ") : features,
      minPrice: min_price,
      maxPrice: max_price,
      limit: 5
    })

    if (results.length === 0) {
      return { reply: "Xin lỗi, không tìm thấy sản phẩm phù hợp." };
    }

    const reply = results
      .map(
        (p, i) =>
          `${i + 1}. ${p.product_name} - ${p.product_price}đ\n   ${
            p.product_description
          }`
      )
      .join("\n\n");

    return { reply, products: results };
  }
}

GeminiChatbotService.searchProductsByAI(
  "Hãy tư vấn cho tôi quần dưới 600k"
);
module.exports = GeminiChatbotService;
