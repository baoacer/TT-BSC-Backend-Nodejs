"use strict";
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: 'AIzaSyCVZ2YLpxwVk6YJPrs88e2JWUToMCEPGiE' });
const ProductService = require("./product.service");

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
        "features": [các đặc điểm người dùng yêu cầu (loại sản phẩm, size)],
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

  static async buildAdviceReply(products, userMessage) {
  const productList = products.map((p, idx) =>
    `${idx + 1}. ${p.name} - Giá: ${p.price}VND - Ảnh: ${p.image} - Mô tả: ${p.description} - ${p.sizes ? ` - Size: ${p.sizes.join(', ')}` : ''}`
  ).join('\n');

  const prompt = `
    Bạn là trợ lý bán hàng. Dưới đây là danh sách sản phẩm phù hợp với yêu cầu của khách:
    ${productList}

    Yêu cầu của khách: "${userMessage}"

    Hãy tư vấn ngắn gọn, thân thiện, gợi ý 2-3 sản phẩm nổi bật nhất, giải thích vì sao phù hợp, và khuyến khích khách chọn mua.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text;
}

  static async searchProductsByAI({message}) {
    const { features, max_price, min_price } = await GeminiChatbotService.extractKeywordsFromMessage(message);

    const { data: results } = await ProductService.searchProduct({
      keyword: Array.isArray(features) ? features.join(" ") : features,
      minPrice: min_price,
      maxPrice: max_price,
      limit: 5,
      select: ['name', 'image', 'price', 'sizes', 'description']
    })

    if (results.length === 0) {
      return { reply: "Xin lỗi, không tìm thấy sản phẩm phù hợp." };
    }

    const reply = await GeminiChatbotService.buildAdviceReply(results, message)

    return { 
      reply
    };

  }
}

module.exports = GeminiChatbotService;
