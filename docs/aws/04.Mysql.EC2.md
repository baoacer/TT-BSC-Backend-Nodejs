# Các bước trên tương tự 03.EC2.md 
Ở đây chọn Amazon Linux

## ✅ Bước 4: Cài đặt phần mềm (tùy chọn)
```bash
sudo dnf install https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm
sudo dnf install mysql-community-server --nogpgcheck -y
sudo systemctl enable mysqld
sudo systemctl start mysqld
sudo systemctl status mysqld
sudo cat /var/log/mysqld.log | grep "temporary password"
mysql -uroot -p
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'MySQL@2025!';
```
Từ máy local copy file .sql tới server
```bash
scp -i C:\Users\Acer\Documents\Workspace\e-Commerce-Nodejs\Backend-eCommerce-NodeJs\src\keys\shopdev-mysql-server-key.pem  mysqlsampledatabase.sql ec2-user@ec2-18-141-180-196.ap-southeast-1.compute.amazonaws.com:~
mysqlsampledatabase.sql   
```
Quay lại server đăng nhập vào mysql 
```bash
source mysqlsampledatabase.sql 
```

## ✅ Bước 5: Bảo mật
Tạo user (localhost) với no root chỉ truy cập database `shopDEV` 
```bash
CREATE USER 'user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'MySQL@user2025!';
GRANT ALL PRIVILEGES ON shopDEV.* TO 'user'@'localhost';
```

Tạo user-root (ip)  
```bash
CREATE USER 'baobao'@'%' IDENTIFIED WITH mysql_native_password BY 'MySQL@user2025!';
GRANT ALL PRIVILEGES ON *.* TO 'baobao'@'%';
```

## ✅ Bước 6: Cài đặt security cho phép kết nối mysql
1. Truy cập EC2 Dashboard > Instance
2. Tab `Security`
3. `Inbound rules` > `Edit inbound rules`
4. `Add rule` 
   - Type: `Http`
   - Source: `Anywhere-IPv4`
5. `Save rule`



