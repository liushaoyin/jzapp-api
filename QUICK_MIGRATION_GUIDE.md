# 快速迁移指南 - 解决新加坡连接问题

## 🚀 立即行动步骤

### 第一步：创建腾讯云环境（5分钟）

1. **登录腾讯云控制台**
   - 访问：https://console.cloud.tencent.com/
   - 注册/登录腾讯云账号

2. **创建云开发环境**
   - 进入"云开发"服务
   - 点击"创建环境"
   - 选择"新加坡"区域
   - 环境名称：`jzapp-singapore`
   - 记录环境ID（格式：`env-xxxxxx`）

3. **获取访问密钥**
   - 在环境设置中找到"访问密钥"
   - 记录 `SecretId` 和 `SecretKey`

### 第二步：更新应用配置（2分钟）

1. **替换manifest.json**
   ```bash
   # 备份原配置
   cp manifest.json manifest-backup.json
   
   # 使用新配置
   cp manifest-new.json manifest.json
   ```

2. **更新配置信息**
   - 打开 `manifest.json`
   - 找到 `uniCloud` 部分
   - 替换以下值：
     ```json
     "uniCloud": {
       "provider": "tencent",
       "spaceId": "你的新环境ID",
       "clientSecret": "你的新密钥",
       "endpoint": "https://ap-singapore-1.api.tcb.tencentcloudapi.com"
     }
     ```

### 第三步：部署云函数（10分钟）

1. **在uniCloud控制台创建新空间**
   - 访问：https://unicloud.dcloud.net.cn/
   - 创建新的服务空间
   - 选择"腾讯云"作为服务商
   - 选择"新加坡"区域

2. **上传云函数**
   - 将 `uniCloud-alipay/cloudfunctions/` 下的所有函数
   - 上传到新的腾讯云空间

3. **测试连接**
   - 运行 `testConnection` 云函数
   - 确认连接正常

### 第四步：数据迁移（5分钟）

1. **导出现有数据**
   ```javascript
   // 在阿里云控制台执行
   db.bills.find().forEach(printjson)
   db.members.find().forEach(printjson)
   db.backups.find().forEach(printjson)
   ```

2. **导入到新数据库**
   - 在腾讯云控制台创建相同的集合
   - 导入导出的数据

### 第五步：测试应用（3分钟）

1. **重新编译应用**
   ```bash
   # 在HBuilderX中重新编译
   # 或者使用命令行
   npm run build:h5
   ```

2. **在新加坡测试**
   - 部署到测试环境
   - 在新加坡网络环境下测试
   - 确认所有功能正常

## 🔧 故障排除

### 如果连接仍然失败：

1. **检查网络**
   ```bash
   # 测试网络连接
   ping ap-singapore-1.api.tcb.tencentcloudapi.com
   ```

2. **检查配置**
   - 确认 `spaceId` 正确
   - 确认 `clientSecret` 正确
   - 确认区域为 `ap-singapore-1`

3. **查看日志**
   - 在腾讯云控制台查看云函数日志
   - 检查错误信息

### 如果数据迁移失败：

1. **使用备份脚本**
   ```bash
   node data-migration.js
   ```

2. **手动迁移**
   - 逐个集合导出导入
   - 验证数据完整性

## 📞 紧急联系

如果遇到问题，可以：

1. **查看腾讯云文档**：https://cloud.tencent.com/document/product/876
2. **联系腾讯云支持**：https://console.cloud.tencent.com/workorder
3. **查看uniCloud文档**：https://uniapp.dcloud.net.cn/uniCloud/

## ✅ 完成检查

迁移完成后，请确认：

- [ ] 应用在新加坡可以正常访问
- [ ] 所有记账功能正常工作
- [ ] 数据同步正常
- [ ] 没有500错误
- [ ] 用户反馈良好

## 💰 成本估算

腾讯云新加坡区域费用（月）：
- 云函数：约 $5-10
- 数据库：约 $10-20
- 存储：约 $5-10
- **总计：约 $20-40/月**

比阿里云略贵，但稳定性更好。

---

**预计完成时间：30分钟**
**预计成本：$20-40/月**
**预期效果：解决新加坡连接问题，提升用户体验** 