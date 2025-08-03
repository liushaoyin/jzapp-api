# 云开发配置指南

## ☁️ uniCloud 配置步骤

### 1. 创建服务空间

1. **登录 DCloud 开发者中心**：
   - 访问 [DCloud 开发者中心](https://dev.dcloud.net.cn/)
   - 使用您的 DCloud 账号登录

2. **创建服务空间**：
   - 点击 "uniCloud" → "服务空间"
   - 点击 "创建服务空间"
   - 选择云服务商：阿里云（推荐）或腾讯云
   - 填写服务空间名称：`jzapp-cloud`
   - 选择付费方式：免费版（开发测试用）

### 2. 关联项目

1. **在 HBuilderX 中关联**：
   - 打开 HBuilderX
   - 右键点击项目根目录
   - 选择 "关联云服务空间"
   - 选择刚创建的服务空间

2. **配置云开发目录**：
   - 项目会自动创建 `uniCloud-aliyun` 目录
   - 确保 `uniCloud-aliyun/cloudfunctions` 和 `uniCloud-aliyun/database` 目录存在

### 3. 初始化数据库

1. **导入数据库结构**：
   - 在 HBuilderX 中展开 `uniCloud-aliyun/database` 目录
   - 右键点击 `db_init.json` 文件
   - 选择 "初始化云数据库"
   - 确认创建集合：`bills`、`members`、`categories`

2. **验证数据库**：
   - 在 DCloud 开发者中心查看数据库
   - 确认三个集合已创建成功

### 4. 部署云函数

1. **上传云函数**：
   - 在 HBuilderX 中展开 `uniCloud-aliyun/cloudfunctions` 目录
   - 右键点击每个云函数目录
   - 选择 "上传并运行"

2. **测试云函数**：
   - 在 DCloud 开发者中心测试云函数
   - 确保所有函数能正常执行

## 🔧 环境变量配置

### 1. 创建环境配置文件

在项目根目录创建 `.env` 文件：

```env
# 云开发配置
UNICLOUD_PROVIDER=aliyun
UNICLOUD_SPACE_ID=your-space-id

# 数据库配置
DB_NAME=jzapp

# 小程序配置（如果需要）
WECHAT_APPID=your-appid
WECHAT_SECRET=your-secret
```

### 2. 获取配置信息

1. **获取服务空间 ID**：
   - 在 DCloud 开发者中心查看服务空间
   - 复制服务空间 ID

2. **获取小程序配置**：
   - 在微信公众平台获取 AppID 和 AppSecret

## 📱 小程序配置

### 1. 注册小程序

1. **访问微信公众平台**：
   - 打开 [微信公众平台](https://mp.weixin.qq.com/)
   - 注册小程序账号

2. **获取 AppID**：
   - 在开发管理 → 开发设置中获取 AppID
   - 复制 AppID

### 2. 配置 manifest.json

在 `manifest.json` 中配置小程序信息：

```json
{
  "mp-weixin": {
    "appid": "你的小程序AppID",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "usingComponents": true
  }
}
```

## 🚀 部署步骤

### 1. 本地测试

1. **运行项目**：
   ```bash
   # 使用 HBuilderX 运行到浏览器
   # 或使用命令行（如果配置了 CLI）
   npm run dev:h5
   ```

2. **测试功能**：
   - 测试账单添加功能
   - 测试成员管理功能
   - 测试数据统计功能

### 2. 构建发布

1. **构建 H5 版本**：
   ```bash
   npm run build:h5
   ```

2. **构建小程序版本**：
   ```bash
   npm run build:mp-weixin
   ```

3. **构建 App 版本**：
   ```bash
   npm run build:app-plus
   ```

## 🔍 常见问题

### 1. 云函数部署失败

**问题**：云函数上传失败
**解决方案**：
- 检查网络连接
- 确认服务空间配置正确
- 查看错误日志

### 2. 数据库连接失败

**问题**：无法连接数据库
**解决方案**：
- 确认数据库已初始化
- 检查权限配置
- 验证连接字符串

### 3. 小程序预览失败

**问题**：小程序无法预览
**解决方案**：
- 检查 AppID 配置
- 确认微信开发者工具版本
- 查看控制台错误信息

## 📞 获取帮助

- **官方文档**：[uniCloud 文档](https://uniapp.dcloud.net.cn/uniCloud/)
- **社区论坛**：[DCloud 社区](https://ask.dcloud.net.cn/)
- **GitHub Issues**：[项目问题反馈](https://github.com/liushaoyin/jzapp-api/issues)

## ✅ 检查清单

- [ ] 创建 uniCloud 服务空间
- [ ] 关联项目到服务空间
- [ ] 初始化数据库集合
- [ ] 部署云函数
- [ ] 配置环境变量
- [ ] 注册小程序账号
- [ ] 配置 AppID
- [ ] 本地测试功能
- [ ] 构建发布版本 