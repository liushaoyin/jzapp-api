# 手动获取AppID指南

## 🚨 当前情况
您的HBuilderX右键菜单中没有 `重新获取AppID` 选项，需要手动获取AppID。

## 🌐 手动获取AppID步骤

### 第一步：访问DCloud开发者中心

1. **打开浏览器**
   - 访问：https://dev.dcloud.net.cn/
   - 或者：https://www.dcloud.io/

2. **登录账号**
   - 使用邮箱：`185473360@qq.com`
   - 如果没有密码，点击 `忘记密码` 重置

### 第二步：创建新应用

1. **进入应用管理**
   - 登录后，点击 `应用管理` 或 `我的应用`

2. **创建新应用**
   - 点击 `创建应用` 按钮
   - 填写应用信息：
     - 应用名称：记账助手
     - 应用描述：简单易用的家庭记账应用
     - 应用类型：uni-app
     - 平台：H5

3. **获取AppID**
   - 创建完成后，会显示AppID
   - 格式：`__UNI__XXXXXXXX`
   - 复制这个AppID

### 第三步：更新manifest.json

1. **打开manifest.json**
   - 在HBuilderX中双击 `manifest.json` 文件

2. **更新AppID**
   ```json
   {
       "name" : "记账助手",
       "appid" : "__UNI__XXXXXXXX",  // 替换为新获取的AppID
       "description" : "简单易用的家庭记账应用，支持多种支付方式统计和成员管理",
       // ... 其他配置
   }
   ```

3. **保存文件**
   - 按 `Ctrl+S` 保存文件

## 🔗 关联云空间

更新AppID后，需要关联云空间：

1. **右键点击uniCloud文件夹**
   - 在左侧项目树中找到 `uniCloud-alipay`
   - 右键点击该文件夹

2. **选择关联选项**
   - 选择 `关联云服务空间或项目...`
   - 选择您的支付宝云空间 `Isy01`

3. **确认关联**
   - 点击确定完成关联

## ✅ 验证步骤

完成上述步骤后：

1. **检查AppID**
   - 确认manifest.json中的appid不为空
   - 确认格式正确（以 `__UNI__` 开头）

2. **检查云空间关联**
   - 确认 `uniCloud-alipay` 显示为：`uniCloud - [支付宝云:Isy01]`

3. **测试云函数**
   - 右键点击 `uniCloud-alipay/cloudfunctions`
   - 选择 `上传所有云函数、公共模块及actions`
   - 观察是否还有错误

## 🚨 如果无法访问DCloud官网

如果在国外无法访问DCloud官网：

1. **使用VPN**
   - 连接到中国境内的VPN服务器
   - 确保可以访问DCloud官网

2. **使用代理**
   - 配置浏览器代理
   - 使用国内代理服务器

3. **临时解决方案**
   - 使用默认AppID：`__UNI__DEMO`
   - 仅用于测试，不能用于正式发布

## 📞 紧急联系

如果以上方法都不行：

1. **DCloud官方论坛**
   - 访问：https://ask.dcloud.net.cn/
   - 发帖求助

2. **HBuilderX官方QQ群**
   - 搜索HBuilderX官方QQ群
   - 在群内求助

3. **技术支持**
   - 联系DCloud官方技术支持

## 🎯 下一步操作

完成AppID获取后，请：

1. 告诉我新的AppID
2. 确认云空间关联状态
3. 测试云函数上传
4. 运行应用测试

现在请先尝试访问DCloud官网获取AppID！ 