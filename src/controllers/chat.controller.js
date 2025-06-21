"use strict";
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
  apiKey: "AIzaSyCVZ2YLpxwVk6YJPrs88e2JWUToMCEPGiE",
});
const { BadRequestError } = require("../core/error.response");
const ChatService = require("../services/gemini.chatbot.service");
const ProductService = require("../services/product.service");
const UserRepository = require("../services/repositories/user.repo");

class ChatController {
  /*
        GET - get chat history
    */
  getChatHistory = async (req, res, next) => {
    try {
      const userID = req.headers["user_id"] || req.headers["user-id"];
      if (!userID) throw new BadRequestError("User ID is required");

      const history = await ChatService.getHistory({ userID });
      return res.json({
        metadata: history,
      });
    } catch (error) {
      next(error);
    }
  };

  postUserMessage = async (req, res, next) => {
    try {
      const { message } = req.body;
      const userID = req.headers["user_id"] || req.headers["user-id"];
      if (!userID) throw new BadRequestError("User ID is required");
      const user = await UserRepository.findUserByID({ userID });
      if (!user) throw new BadRequestError("User not found");
      if (!message || !message.trim())
        throw new BadRequestError("Message is require");

      // 1) insert user message to db (isBot = 0)
      await ChatService.insertHistory({ userID, isBot: 0, message });

      // 2) get chat history
      let historyRows = await ChatService.getHistory({ userID, limit: 10 });
      const historyChat = historyRows
        .map((row, index) => {
          const role = row.sender ? "assistant" : "user";
          return `[Index: ${index + 1}, ${role}: ${row.message}]`;
        })
        .join(", ");

      // 3) Build all-product string
      const { products, pagination } = await ProductService.findAllProducts({
        limit: 100,
      });
      let allProductTxt = "";
      products.forEach((product) => {
        const priceAfterDiscount = product.price * (1 - product.discount);
        const formattedPriceAfterDiscount = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(priceAfterDiscount);

        const sizeText = Array.isArray(product.sizes)
          ? product.sizes.map((s) => s.size).join(", ")
          : "Không có thông tin";

        allProductTxt += `[ID: ${product._id}, tên: ${product.name}, giá còn: ${formattedPriceAfterDiscount}, size: ${sizeText}]\n`;
      });

      // 4) Build all-order history string
      const orderHistory = await ChatService.getOrderHistory({ userID })

      const systemPrompt = `  
            * Role Definition
            Bạn là trợ lý ảo thân thiện cho cửa hàng bán đồ thời trang TTBSC. Hãy luôn giữ phong cách:
            - Trả lời bằng HTML hợp lệ (Không cần viết đầy đủ tag đầu trang và cuối trang, chỉ cần nội dung) không bọc trong markdown.
            - Sử dụng nhiều emoji.
            - Văn phong genZ
            - Giọng văn lịch sự, nhiệt tình, trả lời dài càng tốt.
            - Chỉ tập trung vào sản phẩm/dịch vụ của cửa hàng.
            - Không có hoặc không biết, hãy nói không biết.
            - Dựa vào lịch sử chat gần nhất để trả lời.
            - Luôn hỏi lại nếu không chắc chắn.
            - Khi đăng xuất tài khoản hay cảm ơn khách hàng.

            * Hướng dẫn Trả lời
            1. Định dạng tiền VND: Luôn hiển thị dạng 1.000.000 VND
            2. Chuyển hướng trang:
            - Gửi đường dẫn chuyển hướng sản phẩm dưới dạng thẻ <button>, sử dụng onclick="window.location.href='http://localhost:5173/product/{productId}'"
            + Nội dung hiển thị "Chi tiết"
            + Thêm class đẹp: "bg-indigo-600 text-white px-3 py-1 rounded-full shadow hover:bg-indigo-700 transition"
            + Nội dung hiển thị là "Chi tiết"
            - Nếu muốn xem sản phẩm nào thì phải dựa vào id sản phẩm để truy cập (/product/{id sản phẩm})
            - URL quan trọng:
            • Trang chủ: URL = /
            • Trang chi tiết một sản phẩm sản phẩm: URL = /product/{id sản phẩm}
                
            3. Xử lý sản phẩm:
            - Chỉ gợi ý sản phẩm trong phạm vi ngân sách khách hàng.
            - Tất cả sản phẩm trong cửa hàng: ${allProductTxt}

            4. Hướng dẫn thao tác:
          - Thêm vào giỏ hàng: Vào trong trang chi tiết sản phẩm -> Chọn size-> Thêm vào giỏ hàng || mua ngay.
          - Đặt hàng: Vào trong trang giỏ hàng -> có thể thay đổi số lượng sản phẩm -> Nhấn nút 'Đặt hàng'.
          - Đổi mật khẩu: Vào trong trang cá nhân -> Chọn nút 'Đổi mật khẩu' -> Nhập đầy đủ thông tin và nhấn 'Lưu'.
          - Hủy đơn hàng: Vào trong trang đơn hàng -> Chọn vào nút 'Hủy đơn hàng' tại đơn hàng cần hủy.

            * Quy tắc An toàn
            ❌ Tuyệt đối không:
            - Tiết lộ id sản phẩm
            - Đề cập đến các sản phẩm ngoài cửa hàng.
            - Không nói về giáo dục, chính trị, tôn giáo, tình dục.
            - Không châm biếm, chửi bới, xúc phạm người khác.
            - Không chia sẻ thông tin cá nhân của bất kỳ ai.
            - Đưa thông tin không chắc chắn.
            - Không lặp lại câu trả lời.

            * Kiểm tra Toán học
            TRƯỚC KHI TRẢ LỜI PHẢI:
            1. Đếm số chữ số trong giá sản phẩm từ thông tin sản phẩm.
            2. So sánh với số tiền khách hàng có.
            3. Không gợi ý sản phẩm ngoài phạm vi ngân sách.

            * Ngữ cảnh
            - URL của trang web: http://localhost:5173
            - Tên khách hàng: ${user.name}
            - Email: ${user.email}
            - Lịch sử đoạn chat gần nhất: ${historyChat}
            - Lịch sử đơn hàng: ${orderHistory}
            `.trim();

      // 4) Send the user's question & systemPrompt to the AI chatbot
      const botResponse = await ChatService.sendMessageChatbot({
        systemPrompt,
        userMessage: message,
      });

      if (botResponse) {
        // 5) Insert bot response to db
        await ChatService.insertHistory({
          userID,
          isBot: 1,
          message: botResponse,
        });

        return res.json({
          message: "Chat Response",
          status: 200,
          metadata: {
            reply: botResponse,
          },
        });
      } else {
        return res
          .status(500)
          .json({ error: "Failed to extract bot response." });
      }
    } catch (error) {
      next(error);
    }
  };

  deleteChatHistory = async (req, res, next) => {
    try {
      const userID = req.headers["user_id"] || req.headers["user-id"];
      const result = await ChatService.deleteHistory({ userID });
      return res.json({
        result,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ChatController();
