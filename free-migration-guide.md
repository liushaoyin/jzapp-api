# 免费迁移方案 - Vercel + MongoDB Atlas

## 🆓 完全免费方案

### 方案1：Vercel + MongoDB Atlas（推荐）

**优势：**
- ✅ 完全免费（个人使用）
- ✅ 全球CDN，新加坡访问快
- ✅ 无需信用卡
- ✅ 自动部署
- ✅ 支持Node.js

**免费额度：**
- Vercel：无限部署，每月100GB带宽
- MongoDB Atlas：512MB存储，共享集群

---

## 🚀 迁移步骤

### 第一步：创建MongoDB Atlas数据库（5分钟）

1. **注册MongoDB Atlas**
   - 访问：https://www.mongodb.com/atlas
   - 注册免费账号
   - 选择"FREE"计划

2. **创建集群**
   - 选择"Shared"集群
   - 选择"Singapore"区域
   - 集群名称：`jzapp-free`
   - 点击"Create"

3. **设置数据库用户**
   - 创建数据库用户和密码
   - 记录连接字符串

4. **获取连接信息**
   - 点击"Connect"
   - 选择"Connect your application"
   - 复制连接字符串

### 第二步：创建Vercel项目（5分钟）

1. **注册Vercel**
   - 访问：https://vercel.com
   - 使用GitHub账号登录

2. **创建新项目**
   - 点击"New Project"
   - 选择"Import Git Repository"
   - 连接您的GitHub仓库

3. **配置环境变量**
   - 在项目设置中添加：
     ```
     MONGODB_URI=你的MongoDB连接字符串
     ```

### 第三步：转换云函数为API路由（10分钟）

将现有的云函数转换为Vercel的API路由：

#### 创建API目录结构
```
api/
├── bills/
│   ├── add.js
│   ├── get.js
│   ├── update.js
│   └── delete.js
├── members/
│   ├── add.js
│   ├── get.js
│   ├── update.js
│   └── delete.js
└── stats/
    └── get.js
```

#### 示例：addBill API
```javascript
// api/bills/add.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        
        const db = client.db('jzapp');
        const { amount, category, description, date, memberId, type, payType, location } = req.body;
        
        const billData = {
            amount: parseFloat(amount),
            category,
            description: description || '',
            date: new Date(date),
            memberId: memberId || '',
            type: type || 'expense',
            payType: payType || '',
            location: location || '',
            createTime: new Date(),
            updateTime: new Date()
        };
        
        const result = await db.collection('bills').insertOne(billData);
        
        await client.close();
        
        res.status(200).json({
            code: 200,
            message: '账单添加成功',
            data: result
        });
        
    } catch (error) {
        console.error('添加账单失败:', error);
        res.status(500).json({
            code: 500,
            message: '添加账单失败',
            error: error.message
        });
    }
}
```

### 第四步：更新应用配置（5分钟）

1. **创建新的API配置文件**
```javascript
// common/api-config.js
const API_BASE_URL = 'https://your-vercel-app.vercel.app/api';

export const apiConfig = {
    baseUrl: API_BASE_URL,
    endpoints: {
        addBill: '/bills/add',
        getBills: '/bills/get',
        updateBill: '/bills/update',
        deleteBill: '/bills/delete',
        addMember: '/members/add',
        getMembers: '/members/get',
        updateMember: '/members/update',
        deleteMember: '/members/delete',
        getStats: '/stats/get'
    }
};
```

2. **更新API调用方式**
```javascript
// 替换原有的uniCloud调用
// 从：
// uniCloud.callFunction({
//     name: 'addBill',
//     data: billData
// })

// 改为：
// fetch(apiConfig.baseUrl + apiConfig.endpoints.addBill, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(billData)
// })
```

### 第五步：数据迁移（5分钟）

1. **导出阿里云数据**
```javascript
// 在阿里云控制台执行
db.bills.find().forEach(printjson)
db.members.find().forEach(printjson)
```

2. **导入到MongoDB Atlas**
- 在MongoDB Atlas控制台创建集合
- 导入JSON数据

### 第六步：部署和测试（5分钟）

1. **自动部署**
- 推送代码到GitHub
- Vercel自动部署

2. **测试API**
```bash
curl -X POST https://your-app.vercel.app/api/bills/add \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"category":"餐饮","date":"2024-01-01"}'
```

---

## 💰 成本对比

| 方案 | 月费用 | 存储 | 带宽 | 适用场景 |
|------|--------|------|------|----------|
| 腾讯云 | $20-40 | 10GB | 无限制 | 企业级 |
| Vercel+Atlas | $0 | 512MB | 100GB | 个人使用 |
| 阿里云 | $5-15 | 5GB | 无限制 | 中国用户 |

---

## 🔧 故障排除

### 如果API调用失败：
1. 检查MongoDB连接字符串
2. 确认环境变量设置正确
3. 查看Vercel函数日志

### 如果数据迁移失败：
1. 使用MongoDB Compass工具
2. 手动导入数据
3. 验证数据格式

---

## ✅ 完成检查

- [ ] MongoDB Atlas集群创建成功
- [ ] Vercel项目部署成功
- [ ] API路由正常工作
- [ ] 数据迁移完成
- [ ] 应用在新加坡测试通过

---

**预计完成时间：30分钟**
**预计成本：$0/月**
**预期效果：完全免费，新加坡访问速度快** 