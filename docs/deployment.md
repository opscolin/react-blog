# 博客系统部署文档

## 目录

- [环境要求](#环境要求)
- [服务器配置](#服务器配置)
- [数据库配置](#数据库配置)
- [应用部署](#应用部署)
- [Nginx 配置](#nginx-配置)
- [HTTPS 配置](#https-配置)
- [系统服务配置](#系统服务配置)
- [验证部署](#验证部署)
- [故障排查](#故障排查)

---

## 环境要求

### 服务器环境

- **操作系统**: Ubuntu 20.04+ / Debian 11+
- **Node.js**: v18.x 或更高版本
- **PostgreSQL**: 14.x 或更高版本
- **Nginx**: 1.18+
- **RAM**: 至少 1GB
- **磁盘**: 至少 10GB

### 开发环境

- Node.js 18+
- PostgreSQL 14+
- Git

---

## 服务器配置

### 1. 安装基础依赖

```bash
# 更新系统包
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2 (进程管理器)
sudo npm install -g pm2
```

### 2. 创建系统用户

```bash
# 创建专用用户（推荐）
sudo adduser blog
sudo usermod -aG sudo blog

# 切换到 blog 用户
sudo su - blog
```

---

## 数据库配置

### 1. 启动 PostgreSQL 服务

```bash
# 启动并设置开机自启
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. 创建数据库和用户

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 在 psql 终端中执行：
CREATE USER bloguser WITH PASSWORD 'your_secure_password';
CREATE DATABASE blog OWNER bloguser;
GRANT ALL PRIVILEGES ON DATABASE blog TO bloguser;
\q
```

### 3. 配置数据库连接认证

```bash
# 编辑 pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# 确保有以下配置（允许本地连接使用 md5 认证）：
# local   all             all                                     md5
# host    all             all             127.0.0.1/32            md5
# host    all             all             ::1/128                 md5

# 重启 PostgreSQL
sudo systemctl restart postgresql
```

### 4. 初始化数据库表

```bash
# 登录数据库
psql -h localhost -U bloguser -d blog

# 执行 schema.pg.sql 中的建表语句
# 或者通过应用启动时自动初始化
```

---

## 应用部署

### 方式一：直接部署（适合 VPS/物理服务器）

#### 1. 上传代码

```bash
# 在服务器上克隆仓库
cd ~
git clone https://github.com/yourusername/react-blog.git
cd react-blog
git checkout main
```

#### 2. 安装依赖

```bash
# 安装后端依赖
cd server
npm install --production

# 安装前端依赖
cd ../client
npm install --production
```

#### 3. 构建应用

```bash
# 构建前端
cd client
npm run build

# 构建后端
cd ../server
npm run build
```

#### 4. 配置环境变量

```bash
# 创建生产环境配置文件
sudo nano /etc/blog/env
```

添加以下内容：

```bash
# 数据库配置
DATABASE_URL=postgresql://bloguser:your_secure_password@localhost:5432/blog
POSTGRES_URL=postgresql://bloguser:your_secure_password@localhost:5432/blog

# JWT 密钥（必须修改为强随机密钥）
JWT_SECRET=your_very_long_random_secret_key_here_change_in_production

# Node 环境
NODE_ENV=production
PORT=3001

# 前端 API 地址（反向代理后的地址）
VITE_API_BASE_URL=https://yourdomain.com/api
```

设置文件权限：

```bash
sudo chmod 600 /etc/blog/env
sudo chown blog:blog /etc/blog/env
```

### 方式二：使用 PM2 管理进程

```bash
# 在 server 目录创建 ecosystem.config.js
cd /home/blog/react-blog/server
nano ecosystem.config.js
```

内容：

```javascript
module.exports = {
  apps: [{
    name: 'blog-server',
    script: 'dist/index.js',
    cwd: '/home/blog/react-blog/server',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://bloguser:your_secure_password@localhost:5432/blog',
      JWT_SECRET: 'your_very_long_random_secret_key_here_change_in_production',
      PORT: 3001
    },
    error_file: '/var/log/blog/error.log',
    out_file: '/var/log/blog/out.log',
    log_file: '/var/log/blog/combined.log'
  }]
};
```

```bash
# 创建日志目录
sudo mkdir -p /var/log/blog
sudo chown blog:blog /var/log/blog

# 启动应用
pm2 start ecosystem.config.js

# 保存 PM2 配置（开机自启）
pm2 save
pm2 startup
```

---

## Nginx 配置

### 1. 创建 Nginx 配置文件

```bash
sudo nano /etc/nginx/sites-available/blog
```

### 2. 完整配置示例（HTTPS + HTTP/2 + 安全头）

```nginx
# 限制请求体大小
client_max_body_size 10M;

# 启用 gzip 压缩
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml application/json application/javascript 
           application/xml application/xml+rss text/javascript application/x-javascript;

upstream blog_backend {
    server 127.0.0.1:3001;
    keepalive 32;
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Let's Encrypt 证书验证
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # 其他请求重定向到 HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS 服务器
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # 安全响应头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;

    # 根目录
    root /home/blog/react-blog/client/dist;
    index index.html;

    # 前端静态资源
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存（图片、字体等）
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://blog_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # 错误页面
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### 3. 启用配置

```bash
# 测试配置语法
sudo nginx -t

# 如果测试通过，启用站点
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/

# 删除默认站点（推荐）
sudo rm /etc/nginx/sites-enabled/default

# 重新加载 Nginx
sudo systemctl reload nginx
```

---

## HTTPS 配置

### 使用 Let's Encrypt 免费证书

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 申请证书（请先配置好 DNS 指向服务器）
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期测试
sudo certbot renew --dry-run
```

### 证书自动续期

Let's Encrypt 证书有效期为 90 天，Certbot 会自动设置定时任务续期。

如需手动检查，添加定时任务：

```bash
sudo crontab -e

# 添加行：
0 0 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## 系统服务配置

### 创建 systemd 服务（可选替代 PM2）

```bash
sudo nano /etc/systemd/system/blog.service
```

内容：

```ini
[Unit]
Description=Blog Server
After=network.target postgresql.service

[Service]
Type=simple
User=blog
WorkingDirectory=/home/blog/react-blog/server
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=blog-server
Environment=NODE_ENV=production
Environment=DATABASE_URL=postgresql://bloguser:your_secure_password@localhost:5432/blog
Environment=JWT_SECRET=your_very_long_random_secret_key_here_change_in_production

[Install]
WantedBy=multi-user.target
```

启用服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable blog
sudo systemctl start blog
sudo systemctl status blog
```

---

## 验证部署

### 1. 检查服务状态

```bash
# 检查 PM2
pm2 status

# 检查 Nginx
sudo systemctl status nginx

# 检查 PostgreSQL
sudo systemctl status postgresql

# 检查 blog 服务（如果使用 systemd）
sudo systemctl status blog
```

### 2. 测试 API

```bash
# 健康检查
curl https://yourdomain.com/api/health

# 预期响应：{"status":"ok"}

# 测试 settings API
curl https://yourdomain.com/api/settings
```

### 3. 浏览器访问

- 前台：http://yourdomain.com
- 后台：http://yourdomain.com/admin

### 4. 初始化管理员账户

```bash
cd /home/blog/react-blog/server
DATABASE_URL="postgresql://bloguser:your_secure_password@localhost:5432/blog" npm run init-admin
```

按提示输入用户名和密码。

---

## 故障排查

### 查看日志

```bash
# PM2 日志
pm2 logs blog-server

# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# 系统日志（journalctl）
sudo journalctl -u blog -f
```

### 常见问题

#### 1. 数据库连接失败

```bash
# 检查 PostgreSQL 是否运行
sudo systemctl status postgresql

# 测试数据库连接
psql -h localhost -U bloguser -d blog

# 检查 pg_hba.conf 配置
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

#### 2. API 返回 500 错误

```bash
# 检查后端日志
pm2 logs blog-server

# 确认环境变量正确加载
pm2 env list

# 重启服务
pm2 restart blog-server
```

#### 3. Nginx 502 Bad Gateway

```bash
# 检查后端是否运行
pm2 status

# 检查后端端口
curl http://localhost:3001/api/health

# 检查 Nginx 配置
sudo nginx -t
```

#### 4. 静态资源加载失败

```bash
# 检查前端构建目录
ls -la /home/blog/react-blog/client/dist/

# 检查 Nginx 配置中的 root 路径
```

#### 5. SSL 证书问题

```bash
# 检查证书是否存在
sudo ls -la /etc/letsencrypt/live/yourdomain.com/

# 重新申请证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 性能优化

```bash
# PM2 监控
pm2 monit

# 查看 Node.js 内存使用
pm2 show blog-server
```

### 备份

```bash
# 备份数据库
pg_dump -h localhost -U bloguser blog > backup_$(date +%Y%m%d).sql

# 备份代码（Git 方式）
cd /home/blog/react-blog
git backup
```

---

## 更新部署

```bash
# 进入目录
cd /home/blog/react-blog

# 拉取最新代码
git pull origin main

# 重新构建
cd server && npm install && npm run build
cd ../client && npm install && npm run build

# 重启服务
pm2 restart blog-server

# 或者使用 systemd
sudo systemctl restart blog
```

---

## 目录结构

```
/home/blog/react-blog/
├── client/                 # 前端代码
│   ├── dist/              # 构建输出
│   ├── src/               # 源代码
│   └── package.json
├── server/                 # 后端代码
│   ├── dist/              # 构建输出
│   ├── src/               # 源代码
│   ├── scripts/           # 脚本
│   └── package.json
└── docs/                   # 文档
    └── deployment.md

/etc/blog/
└── env                     # 环境变量配置

/var/log/blog/
├── error.log
├── out.log
└── combined.log
```

---

## 安全建议

1. **修改默认端口**: 将 Node.js 端口改为非标准端口
2. **使用强密码**: 数据库密码和 JWT Secret 使用随机强密码
3. **配置防火墙**: 只开放 80/443 端口
4. **定期更新**: 保持系统和依赖最新
5. **禁用 root 登录**: 服务器使用普通用户
6. **配置 fail2ban**: 防止暴力破解

```bash
# 配置防火墙（仅开放 HTTP/HTTPS）
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```
