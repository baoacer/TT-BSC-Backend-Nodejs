
# 🚀 Hướng dẫn khởi tạo CloudFront trên AWS

## ✅ Bước 1: Truy cập CloudFront Dashboard
1. Đăng nhập vào [AWS Console](https://console.aws.amazon.com/)
2. Trên thanh tìm kiếm, nhập `CloudFront` và chọn **CloudFront**
3. Nhấn **Create a CloudFront distribution**

---

## ✅ Bước 2: Tạo Distribution
1. Trong phần **Origin domain**, chọn Amazon S3 bucket đã tạo trước đó
2. **Origin access**: chọn `Legacy access identity`
3. Nhấn **Create new OAI** > sau đó nhấn **Create**
4. **Bucket policy**: chọn `Yes, update the bucket policy`
5. **Web Application Firewall (WAF)**: chọn `Do not enable`
6. Nhấn **Create distribution**
7. Sau khi tạo xong, truy cập distribution và sử dụng **Distribution domain name** kết hợp với tên file ảnh để test

---

## ✅ Bước 3: Bảo mật CloudFront (Signed URL/ Signed Cookies)

### 🔹 1. Yêu cầu trước khi thiết lập bảo mật
Tạo cặp khóa công khai và riêng tư bằng OpenSSL:

```bash
openssl genrsa -out private_key.pem 2048
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

### 🔹 2. Thiết lập bảo mật CloudFront
1. Truy cập **CloudFront Dashboard** > `Key management` > `Public Keys`
   - Nhấn **Add public key**, upload `public_key.pem` vừa tạo > **Create public key**
2. Vào **Key groups** > nhấn **Create key group**
3. Trong phần **Public keys**, chọn key vừa tạo ở bước trên
4. Truy cập lại **CloudFront Distribution** đã tạo > tab **Behaviors** > nhấn **Edit**
5. **Restrict viewer access**: chọn `Yes`
6. Trong phần **Trusted key groups**, chọn key group vừa tạo > nhấn **Save changes**

---

## 📌 Ghi chú

- Phải sử dụng **Signed URL** hoặc **Signed Cookies** để truy cập các file đã bị giới hạn bởi key group.
- Private key nên được bảo vệ cẩn thận, tránh đẩy lên git.
- Có thể sử dụng SDK hoặc thư viện hỗ trợ để tạo signed URL.

