# 部署指南

## 🚀 快速部署

### 1. H5 版本部署

#### 方式一：GitHub Pages（推荐）

1. **启用 GitHub Pages**：
   - 进入 GitHub 仓库设置
   - 找到 "Pages" 选项
   - 选择 "GitHub Actions" 作为源
   - 保存设置

2. **自动部署**：
   - 推送代码到 main 分支
   - GitHub Actions 会自动构建并部署
   - 访问地址：`https://your-username.github.io/jzapp-api/`

#### 方式二：Vercel 部署

1. **连接 Vercel**：
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **部署项目**：
   ```bash
   npm run build:h5
   vercel --prod
   ```

#### 方式三：Netlify 部署

1. **构建项目**：
   ```bash
   npm run build:h5
   ```

2. **上传到 Netlify**：
   - 将 `dist/build/h5` 目录拖拽到 Netlify
   - 或使用 Netlify CLI

### 2. 微信小程序发布

#### 准备工作

1. **注册小程序**：
   - 访问 [微信公众平台](https://mp.weixin.qq.com/)
   - 注册小程序账号
   - 获取 AppID

2. **配置 AppID**：
   - 在 `manifest.json` 中填入小程序 AppID
   ```json
   {
     "mp-weixin": {
       "appid": "你的小程序AppID"
     }
   }
   ```

#### 发布步骤

1. **构建小程序**：
   ```bash
   npm run build:mp-weixin
   ```

2. **使用微信开发者工具**：
   - 打开微信开发者工具
   - 导入项目：选择 `dist/build/mp-weixin` 目录
   - 预览和调试
   - 上传代码

3. **提交审核**：
   - 在微信公众平台提交审核
   - 等待审核通过
   - 发布上线

### 3. App 打包发布

#### Android 版本

1. **使用 HBuilderX 打包**：
   - 打开 HBuilderX
   - 导入项目
   - 运行 → 运行到手机或模拟器 → 运行到 Android App 基座
   - 发行 → 原生 App-云打包

2. **配置应用信息**：
   - 应用名称：记账助手
   - 包名：com.yourcompany.jzapp
   - 版本号：1.0.0

3. **上传到应用商店**：
   - Google Play Store
   - 华为应用市场
   - 小米应用商店

#### iOS 版本

1. **配置证书**：
   - 申请 Apple Developer 账号
   - 配置开发证书和发布证书

2. **打包发布**：
   - 使用 HBuilderX 云打包
   - 上传到 App Store Connect
   - 提交审核

## ☁️ 云开发配置

### 1. uniCloud 配置

1. **创建服务空间**：
   - 在 HBuilderX 中登录 DCloud 账号
   - 创建 uniCloud 服务空间
   - 选择阿里云或腾讯云

2. **初始化数据库**：
   ```bash
   # 导入数据库结构
   # 使用 docs/db_init.json 文件
   ```

3. **部署云函数**：
   - 右键点击云函数目录
   - 选择"上传并运行"

### 2. 环境变量配置

创建 `.env` 文件：
```env
# 数据库配置
DB_URL=mongodb://your-db-url
DB_NAME=jzapp

# 云函数配置
UNICLOUD_PROVIDER=aliyun
UNICLOUD_SPACE_ID=your-space-id

# 小程序配置
WECHAT_APPID=your-appid
WECHAT_SECRET=your-secret
```

## 🔧 性能优化

### 1. 构建优化

```bash
# 生产环境构建
npm run build:h5 -- --mode production

# 分析构建结果
npm run build:h5 -- --analyze
```

### 2. 代码分割

```javascript
// 路由懒加载
const routes = [
  {
    path: '/stats',
    component: () => import('@/pages/stats/stats.vue')
  }
]
```

### 3. 缓存策略

```javascript
// 静态资源缓存
// 在 manifest.json 中配置
{
  "h5": {
    "router": {
      "mode": "hash"
    },
    "optimization": {
      "treeShaking": {
        "enable": true
      }
    }
  }
}
```

## 📊 监控和分析

### 1. 错误监控

```javascript
// 添加错误监控
uni.onError((err) => {
  console.error('应用错误:', err);
  // 上报错误信息
});
```

### 2. 性能监控

```javascript
// 页面加载性能
uni.reportPerformance('page_load', Date.now());
```

### 3. 用户行为分析

```javascript
// 页面访问统计
uni.reportAnalytics('page_view', {
  page: 'home',
  timestamp: Date.now()
});
```

## 🔒 安全配置

### 1. 数据加密

```javascript
// 敏感数据加密
import CryptoJS from 'crypto-js';

const encrypt = (data, key) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};
```

### 2. 接口安全

```javascript
// 添加请求签名
const addSignature = (params) => {
  const timestamp = Date.now();
  const signature = generateSignature(params, timestamp);
  return { ...params, timestamp, signature };
};
```

## 📞 故障排除

### 常见问题

1. **构建失败**：
   - 检查 Node.js 版本
   - 清理 node_modules 重新安装
   - 检查依赖冲突

2. **云函数部署失败**：
   - 检查网络连接
   - 验证服务空间配置
   - 查看错误日志

3. **小程序审核被拒**：
   - 检查隐私政策
   - 完善功能说明
   - 修复审核反馈问题

### 获取帮助

- GitHub Issues: [提交问题](https://github.com/liushaoyin/jzapp-api/issues)
- 官方文档: [uni-app 文档](https://uniapp.dcloud.net.cn/)
- 社区论坛: [DCloud 社区](https://ask.dcloud.net.cn/) 