const { TEMPLATE } = require("../configs/contants");
const { NotFoundError } = require("../core/error.response");
const transporter = require("../databases/init.nodemailer");
const Utils = require("../utils");
const OtpService = require("./otp.service");
const TemplateService = require("./template.service");

const sendEmail = async ({
  html, toEmail, subject, text,
}) => {
  try {
    const mailOptions = {
      from: '"ShopDev" <nguyenquocbaotu@gmail.com>',
      to: toEmail,
      subject,
      text,
      html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }

      console.log("Message sent:: " + info.messageId);
    });
  } catch (error) {
    console.error("Error Email Send Link Verify: ", error);
    return error;
  }
};

const sendEmailToken = async ({ email }) => {
  try {
    /**
     * 1. Get New Token
     */
    const token = await OtpService.newOtp({ email });

    /**
     * 2. Get Template
     */
    const template = await TemplateService.getTemplateByName({
      name: "verify-email",
    });

    /**
     * 3. Replace Placeholder Email Template
     */
    if (!template) throw new NotFoundError("Template not found");

    const content = Utils.replacePlaceholder(template.tem_html, {
      link_verify: `http://localhost:3056/v1/api/user/welcome-back?token=${token.otp_token}`,
    });

    /**
     * 4. Send Email
     */
    await sendEmail({
      html: content,
      toEmail: email,
      subject: "Vui lòng xác thực tài khoản của bạn đăng ký tại ShopBSC",
    })

    return 1;
  } catch (error) {
    throw new Error("Error Email Send Token");
  }
};

const sendEmailResetPassword = async ({ email, password }) => {
  try {
    /**
     * 2. Get Template
     */
    const template = await TemplateService.getTemplateByName({
      name: "reset-password",
    });
    if (!template) throw new NotFoundError("Template not found");

    /**
     * 3. Replace Placeholder Email Template
     */
    const content = Utils.replacePlaceholder(template.tem_html, {
      email: password
    });

    /**
     * 4. Send Email
     */
    await sendEmail({
      html: content,
      toEmail: email,
      subject: "Reset password",
    })

    return 1;
  } catch (error) {
    throw new Error("Error Email Send Token");
  }
};

const sendEmailOrderConfirm = async ({ email, orderCode, customerName }) => {
  try {
    /**
     * 2. Get Template
     */
    const template = await TemplateService.getTemplateByName({
      name: TEMPLATE.ORDER_COMFIRM_EMAIL,
    });
    if (!template) throw new NotFoundError("Template not found");

    /**
     * 3. Replace Placeholder Email Template
     */
    const content = Utils.replacePlaceholder(template.tem_html, {
      customer_name: customerName,
      order_code: orderCode
    });

    /**
     * 4. Send Email
     */
    await sendEmail({
      html: content,
      toEmail: email,
      subject: "Xác nhận đơn hàng",
    })

    return 1;
  } catch (error) {
    throw new Error("Error Email Send Token");
  }
};

const sendEmailOrderCancel = async ({ email, orderCode, customerName }) => {
  try {
    /**
     * 2. Get Template
     */
    const template = await TemplateService.getTemplateByName({
      name: TEMPLATE.ORDER_CANCEL_EMAIL,
    });
    if (!template) throw new NotFoundError("Template not found");

    /**
     * 3. Replace Placeholder Email Template
     */
    const content = Utils.replacePlaceholder(template.tem_html, {
      customer_name: customerName,
      order_code: orderCode
    });

    /**
     * 4. Send Email
     */
    await sendEmail({
      html: content,
      toEmail: email,
      subject: "Đơn hàng bị hủy",
    })

    return 1;
  } catch (error) {
    throw new Error("Error Email Send Token");
  }
};
 
module.exports = {
  sendEmail,
  sendEmailToken,
  sendEmailResetPassword,
  sendEmailOrderCancel,
  sendEmailOrderConfirm
};