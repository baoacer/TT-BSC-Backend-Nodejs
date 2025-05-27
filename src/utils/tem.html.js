"use strict";

const htmlEmailToken = () => {
  return `<!DOCTYPE html>
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
              <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>ShopDEV</strong>!</p>
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
              <p>Nếu bạn không đăng ký tài khoản tại <strong>ShopDEV</strong>, vui lòng bỏ qua email này.</p>
              <p>Trân trọng!</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 20px; font-size:12px; color:#aaaaaa; text-align:center;">
              © 2025 ShopDEV. Mọi quyền được bảo lưu.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

module.exports = {
  htmlEmailToken,
};
