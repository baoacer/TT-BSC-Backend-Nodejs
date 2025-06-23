const ROLE = {
  USER: "User",
  ADMIN: "Admin",
};

const PAYMENT = {
  COD: 'COD',
  VNPAY: 'VNPAY'
}

const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILDED: 'failed',
  COMPLETED: 'completed'
}

const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed", 
  SHIPPING: "shipping", 
  COMPLETED: "completed", 
  CANCELLED: "cancelled"
}

// redis
REDIS_CONNECT_TIMEOUT = 10000
REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: 'Redis Server Error'
}

VERIFY_EMAIL = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Xác minh email</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <h2 style="color:#333333;">Xác minh địa chỉ email của bạn</h2>
            </td>
          </tr>
          <tr>
            <td style="color:#555555; font-size:16px; line-height:1.5;">
              <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>ShopBSC</strong>!</p>
              <p>Vui lòng nhấn vào nút bên dưới để xác minh địa chỉ email của bạn:</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <a href="{{link_verify}}"
                 style="background-color:#4CAF50; color:#ffffff; text-decoration:none; padding:12px 24px; border-radius:5px; font-size:16px; display:inline-block;">
                Xác minh email
              </a>
            </td>
          </tr>
          <tr>
            <td style="color:#777777; font-size:14px;">
              <p>Nếu bạn không đăng ký tài khoản tại <strong>ShopBSC</strong>, vui lòng bỏ qua email này.</p>
              <p>Trân trọng!</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px; font-size:12px; color:#aaaaaa; text-align:center;">
              © 2025 ShopBSC. Mọi quyền được bảo lưu.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

RESET_PASSWORD_EMAIL = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Cấp lại mật khẩu</title>
</head>
<body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <h2 style="color:#333333;">Mật khẩu mới của bạn</h2>
            </td>
          </tr>
          <tr>
            <td style="color:#555555; font-size:16px; line-height:1.5;">
              <p>Chúng tôi đã nhận được yêu cầu cấp lại mật khẩu cho tài khoản tại <strong>ShopBSC</strong>.</p>
              <p>Mật khẩu tạm thời mới là:</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <div style="background-color:#f0f0f0; padding: 12px 24px; border-radius: 5px; font-size: 16px; color: #333333; font-weight: bold;">
                {{email}}
              </div>
            </td>
          </tr>
          <tr>
            <td style="color:#777777; font-size:14px;">
              <p>Hãy đăng nhập và đổi mật khẩu ngay để đảm bảo an toàn.</p>
              <p>Nếu bạn không yêu cầu cấp lại mật khẩu, vui lòng liên hệ ngay với chúng tôi.</p>
              <p>Trân trọng!</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px; font-size:12px; color:#aaaaaa; text-align:center;">
              © 2025 ShopBSC. Mọi quyền được bảo lưu.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`



const TEMPLATE = {
  VERIFY_EMAIL:'verify-email',
  RESET_PASSWORD_EMAIL:'reset-password',
  ORDER_COMFIRM_EMAIL:'order-confirmation',
  ORDER_CANCEL_EMAIL:'order-cancelled'
}

module.exports = {
  ROLE,
  REDIS_CONNECT_MESSAGE,
  REDIS_CONNECT_TIMEOUT,
  PAYMENT,
  VERIFY_EMAIL,
  RESET_PASSWORD_EMAIL,
  PAYMENT_STATUS,
  ORDER_STATUS,
  TEMPLATE
};