"use strict";
require("dotenv").config();
const querystring = require("qs");
const crypto = require("crypto");
const moment = require("moment");
const Utils = require("../utils");

class VnPayService {
  static async createPaymentUrl({
    // orderId = null,
    orderAmount = null,
    orderType = null,
    ipAddr = null,
  }) {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    const amount = orderAmount * 100; // Convert to VND (VNPAY require)
    let orderId = moment(date).format('DDHHmmss');
    
    let vnp_Params = {
      vnp_Version: process.env.VNPAY_VERSION || "2.1.0",
      vnp_Command: "pay", // thanh toán
      vnp_TmnCode: process.env.VNPAY_TMN_CODE, // website code
      vnp_Locale: "vn", // language
      vnp_CurrCode: process.env.VNPAY_CURRENCY, // currency
      vnp_TxnRef: orderId, // mã đơn hàng
      vnp_OrderInfo: "Thanh toan don hang",
      vnp_OrderType: orderType || "others", // loại hàng hóa
      vnp_Amount: amount,
      vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    vnp_Params = Utils.sortObject(vnp_Params); // sắp xếp thứ tự tham số A-Z

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", process.env.VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params.vnp_SecureHash = signed;
    const paymentUrl = `${process.env.VNPAY_URL}?${querystring.stringify(
      vnp_Params,
      { encode: false },
    )}`;

    return paymentUrl;
  }

  static async handlePaymentResponse(vnp_Params = {}) {
    const secureHash = vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHash;

    vnp_Params = Utils.sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const signed = crypto
      .createHmac("sha512", process.env.VNPAY_HASH_SECRET)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    if (secureHash === signed) {
      if (vnp_Params.vnp_ResponseCode === "00") {
        // Thanh toán thành công
        return {
          message: "Thanh toán thành công",
          data: vnp_Params,
        };
      } else {
        return {
          message: "Thanh toán thất bại",
          data: vnp_Params,
        };
      }
    } else {
      return {
        message: "Chữ ký không hợp lệ",
      };
    }
  }
}

module.exports = VnPayService;
