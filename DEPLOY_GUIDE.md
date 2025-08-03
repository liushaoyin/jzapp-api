# Vercel部署指南

## 快速部署步骤

### 1. 准备GitHub仓库
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/jzapp-api.git
git push -u origin main
```

### 2. 连接Vercel
1. 访问 https://vercel.com
2. 使用GitHub账号登录
3. 点击"New Project"
4. 选择您的GitHub仓库
5. 点击"Deploy"

### 3. 配置环境变量
在Vercel项目设置中添加：
- 名称：MONGODB_URI
- 值：mongodb+srv://username:password@cluster.mongodb.net/jzapp?retryWrites=true&w=majority

### 4. 更新应用配置
在您的uni-app项目中：
1. 安装API配置：`npm install ./common/api-config.js`
2. 替换uniCloud调用为API调用
3. 重新编译应用

### 5. 测试API
```bash
curl -X POST https://your-app.vercel.app/api/bills/add \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"category":"餐饮","date":"2024-01-01"}'
```

## 注意事项
- 确保MongoDB Atlas集群在新加坡区域
- 检查网络访问权限设置
- 监控API调用次数（免费版有限制）
