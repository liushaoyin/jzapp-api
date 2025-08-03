/**
 * 云函数转Vercel API路由转换脚本
 */

const fs = require('fs');
const path = require('path');

// 转换配置
const config = {
    sourceDir: 'uniCloud-alipay/cloudfunctions',
    targetDir: 'api',
    functions: [
        { name: 'addBill', path: 'bills/add.js' },
        { name: 'getBills', path: 'bills/get.js' },
        { name: 'updateBill', path: 'bills/update.js' },
        { name: 'deleteBill', path: 'bills/delete.js' },
        { name: 'addMember', path: 'members/add.js' },
        { name: 'getMembers', path: 'members/get.js' },
        { name: 'updateMember', path: 'members/update.js' },
        { name: 'deleteMember', path: 'members/delete.js' },
        { name: 'getStats', path: 'stats/get.js' },
        { name: 'initData', path: 'data/init.js' },
        { name: 'backupData', path: 'data/backup.js' }
    ]
};

/**
 * 转换云函数为Vercel API路由
 */
function convertCloudFunction(functionName, targetPath) {
    const sourceFile = path.join(config.sourceDir, functionName, 'index.js');
    
    if (!fs.existsSync(sourceFile)) {
        console.log(`跳过 ${functionName}：源文件不存在`);
        return;
    }
    
    const sourceCode = fs.readFileSync(sourceFile, 'utf8');
    
    // 创建目标目录
    const targetDir = path.dirname(path.join(config.targetDir, targetPath));
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // 转换代码
    const convertedCode = convertCode(sourceCode, functionName);
    
    // 写入目标文件
    const targetFile = path.join(config.targetDir, targetPath);
    fs.writeFileSync(targetFile, convertedCode);
    
    console.log(`✅ 转换完成: ${functionName} -> ${targetPath}`);
}

/**
 * 转换代码逻辑
 */
function convertCode(sourceCode, functionName) {
    // 移除uniCloud相关代码
    let convertedCode = sourceCode
        .replace(/const db = uniCloud\.database\(\);/, '')
        .replace(/exports\.main = async \(event, context\) => {/, `export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const event = req.body;`)
        .replace(/return {/g, 'res.status(200).json({')
        .replace(/};$/, '});')
        .replace(/} catch \(error\) {/g, `} catch (error) {
        console.error('${functionName} 失败:', error);
        res.status(500).json({`)
        .replace(/};$/, '});');
    
    // 添加MongoDB连接
    const mongoConnection = `
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('jzapp');

try {
    ${convertedCode}
} finally {
    await client.close();
}`;
    
    return mongoConnection;
}

/**
 * 生成package.json
 */
function generatePackageJson() {
    const packageJson = {
        name: "jzapp-api",
        version: "1.0.0",
        description: "记账应用API",
        main: "index.js",
        scripts: {
            "dev": "vercel dev",
            "build": "vercel build",
            "deploy": "vercel --prod"
        },
        dependencies: {
            "mongodb": "^5.0.0"
        },
        devDependencies: {
            "vercel": "^28.0.0"
        }
    };
    
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ 生成 package.json');
}

/**
 * 生成vercel.json配置
 */
function generateVercelConfig() {
    const vercelConfig = {
        version: 2,
        functions: {
            "api/**/*.js": {
                runtime: "nodejs18.x"
            }
        },
        env: {
            MONGODB_URI: "@mongodb-uri"
        }
    };
    
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    console.log('✅ 生成 vercel.json');
}

/**
 * 生成API配置文件
 */
function generateApiConfig() {
    const apiConfig = `// common/api-config.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://your-app.vercel.app/api'
    : 'http://localhost:3000/api';

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
        getStats: '/stats/get',
        initData: '/data/init',
        backupData: '/data/backup'
    }
};

// API调用工具函数
export const apiCall = async (endpoint, data = null, method = 'GET') => {
    const url = apiConfig.baseUrl + apiConfig.endpoints[endpoint];
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API调用失败');
        }
        
        return result;
    } catch (error) {
        console.error('API调用错误:', error);
        throw error;
    }
};

// 便捷方法
export const api = {
    addBill: (data) => apiCall('addBill', data, 'POST'),
    getBills: (params) => apiCall('getBills', params, 'POST'),
    updateBill: (data) => apiCall('updateBill', data, 'POST'),
    deleteBill: (data) => apiCall('deleteBill', data, 'POST'),
    addMember: (data) => apiCall('addMember', data, 'POST'),
    getMembers: () => apiCall('getMembers', null, 'POST'),
    updateMember: (data) => apiCall('updateMember', data, 'POST'),
    deleteMember: (data) => apiCall('deleteMember', data, 'POST'),
    getStats: (params) => apiCall('getStats', params, 'POST'),
    initData: () => apiCall('initData', null, 'POST'),
    backupData: () => apiCall('backupData', null, 'POST')
};
`;
    
    // 创建common目录
    if (!fs.existsSync('common')) {
        fs.mkdirSync('common');
    }
    
    fs.writeFileSync('common/api-config.js', apiConfig);
    console.log('✅ 生成 API配置文件');
}

/**
 * 生成部署说明
 */
function generateDeployGuide() {
    const deployGuide = `# Vercel部署指南

## 快速部署步骤

### 1. 准备GitHub仓库
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/jzapp-api.git
git push -u origin main
\`\`\`

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
1. 安装API配置：\`npm install ./common/api-config.js\`
2. 替换uniCloud调用为API调用
3. 重新编译应用

### 5. 测试API
\`\`\`bash
curl -X POST https://your-app.vercel.app/api/bills/add \\
  -H "Content-Type: application/json" \\
  -d '{"amount":100,"category":"餐饮","date":"2024-01-01"}'
\`\`\`

## 注意事项
- 确保MongoDB Atlas集群在新加坡区域
- 检查网络访问权限设置
- 监控API调用次数（免费版有限制）
`;
    
    fs.writeFileSync('DEPLOY_GUIDE.md', deployGuide);
    console.log('✅ 生成部署指南');
}

// 执行转换
console.log('🚀 开始转换云函数为Vercel API路由...');

// 转换所有云函数
config.functions.forEach(func => {
    convertCloudFunction(func.name, func.path);
});

// 生成配置文件
generatePackageJson();
generateVercelConfig();
generateApiConfig();
generateDeployGuide();

console.log('\n🎉 转换完成！');
console.log('\n📁 生成的文件：');
console.log('- api/ - API路由文件');
console.log('- package.json - 项目配置');
console.log('- vercel.json - Vercel配置');
console.log('- common/api-config.js - API配置');
console.log('- DEPLOY_GUIDE.md - 部署指南');
console.log('\n📋 下一步：');
console.log('1. 创建MongoDB Atlas数据库');
console.log('2. 将代码推送到GitHub');
console.log('3. 在Vercel部署项目');
console.log('4. 配置环境变量');
console.log('5. 测试API功能'); 