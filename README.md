# jzAppCN - 记账应用

一个基于 uni-app 框架开发的跨平台记账应用，支持多端部署（微信小程序、H5、App等）。

## 📱 功能特性

- 💰 **账单管理** - 添加、编辑、删除账单记录
- 👥 **成员管理** - 支持多成员记账，家庭共享
- 📊 **数据统计** - 可视化图表展示收支情况
- 🔄 **数据同步** - 云端数据备份与恢复
- 📱 **跨平台** - 一套代码，多端运行
- 🎨 **现代化UI** - 美观的用户界面设计

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- HBuilderX (推荐) 或 Vue CLI
- 微信开发者工具 (小程序开发)

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/jzAppCN.git
cd jzAppCN
```

2. **安装依赖**
```bash
npm install
```

3. **运行项目**

**HBuilderX 方式（推荐）：**
- 使用 HBuilderX 打开项目
- 点击运行 -> 运行到浏览器 -> Chrome
- 或运行到小程序模拟器

**命令行方式：**
```bash
# 运行到 H5
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin
```

## 📁 项目结构

```
jzAppCN/
├── api/                 # API 接口
│   ├── bills/          # 账单相关接口
│   ├── members/        # 成员相关接口
│   └── stats/          # 统计相关接口
├── components/         # 公共组件
├── pages/             # 页面文件
│   ├── index/         # 首页
│   ├── members/       # 成员管理
│   └── stats/         # 统计分析
├── static/            # 静态资源
├── store/             # 状态管理
├── uni_modules/       # uni-app 插件
└── uniCloud-aliyun/   # 云开发配置
```

## 🔧 配置说明

### 1. 云开发配置

项目使用 uniCloud 作为后端服务，需要配置云开发环境：

1. 在 HBuilderX 中登录 DCloud 开发者账号
2. 创建 uniCloud 服务空间
3. 在 `uniCloud-aliyun/` 目录下配置云函数和数据库

详细配置请参考：[CLOUD_SETUP.md](./CLOUD_SETUP.md)

### 2. 小程序配置

如需发布微信小程序，需要：

1. 在微信公众平台注册小程序
2. 配置 AppID
3. 在 `manifest.json` 中填入小程序配置

详细配置请参考：[APPID_GUIDE.md](./APPID_GUIDE.md)

## 📦 部署发布

### H5 部署

```bash
npm run build:h5
```

构建完成后，将 `dist/build/h5` 目录部署到 Web 服务器。

### 小程序发布

1. 构建小程序代码：
```bash
npm run build:mp-weixin
```

2. 使用微信开发者工具打开 `dist/build/mp-weixin` 目录
3. 上传代码并提交审核

### App 打包

使用 HBuilderX 进行 App 打包：
1. 运行 -> 运行到手机或模拟器 -> 运行到 Android App 基座
2. 发行 -> 原生 App-云打包

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目主页：[GitHub](https://github.com/your-username/jzAppCN)
- 问题反馈：[Issues](https://github.com/your-username/jzAppCN/issues)

## 🙏 致谢

感谢以下开源项目的支持：
- [uni-app](https://uniapp.dcloud.net.cn/) - 跨平台开发框架
- [uni-ui](https://uniapp.dcloud.net.cn/component/) - UI 组件库
- [uCharts](https://www.ucharts.cn/) - 图表组件

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！

