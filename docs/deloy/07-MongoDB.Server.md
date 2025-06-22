# 🚀 Install MongoDB in server

## 🛠️ 1. Install

```bash
 sudo apt update
 sudo apt upgrade -y
```
 
Add repo mongodb
```bash
wget -qO - https://pgp.mongodb.com/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

Install Mongodb
```bash
sudo apt update
sudo apt install -y mongodb-org
```

Start and check status
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

---

## 🔄 2. Thiết lập Workflow CI/CD trên GitHub Actions

1. 🔍 Truy cập **Repo > Actions**, tìm kiếm `Node.js`, chọn `Configure`.
2. 📁 Tạo file `.github/workflows/node.js.yml` với nội dung sau:

   ```yaml
   name: Node.js CI/CD shopDEV

   on:
     push:
       branches: ["main"]

   jobs:
     build:
       runs-on: self-hosted

       strategy:
         matrix:
           node-version: [22.x]

       steps:
         - uses: actions/checkout@v4
         - name: Use Node.js ${{ matrix.node-version }}
           uses: actions/setup-node@v4
           with:
             node-version: ${{ matrix.node-version }}
             cache: "npm"
         - run: npm ci
         - run: pm2 restart shopdev-backend
   ```

---

## 📂 3. Kiểm tra thư mục làm việc của Runner trên Server

```bash
ls -la
cd _work
ls -la
```

---

## 🧩 4. Cài đặt Node.js 22 trên EC2 (Ubuntu)

1. 🌐 Cài đặt từ trang Nodesource:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
   sudo -E bash nodesource_setup.sh
   sudo apt-get install -y nsolid
   nsolid -v
   sudo apt-get install -y nodejs
   node -v
   ```

---

## ⚙️ 5. Cài đặt PM2 để quản lý tiến trình Node.js

📌 Tại thư mục dự án (VD: `~/actions-runner/_work/e-Commerce-node/e-Commerce-node`):

```bash
sudo npm install -g pm2@latest
pm2 list
pm2 start server.js --name=shopdev-backend
```

---
## 6. Thiết lập chứng chỉ https

```bash
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python3-certbot-nginx
sudo certbot --nginx -d shopdev.publicvm.com
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```
