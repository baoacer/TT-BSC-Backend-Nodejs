# 🚀 Setup NGINX (Che port)

## 🛠️ 1. Install

```bash
sudo apt-get install -y nginx
cd /etc/nginx/sites-available
sudo nano default
```

```nginx
location / {
   proxy_pass http://localhost:3056;
   proxy_http_version 1.1;
   proxy_set_header Upgrade $http_upgrade;
   proxy_set_header Connection 'upgrade';
   proxy_set_header Host $host;
   proxy_cache_bypass $http_upgrade;
}
```

```bash
sudo nginx -t 
sudo systemctl restart nginx
```

## 2. Thiết lập chứng chỉ https

```bash
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python3-certbot-nginx
sudo certbot --nginx -d nguyenlequocbao.id.vn
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```

---
