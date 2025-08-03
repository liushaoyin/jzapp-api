/**
 * 云函数迁移脚本
 * 将阿里云云函数迁移到腾讯云
 */

const fs = require('fs');
const path = require('path');

// 迁移配置
const migrationConfig = {
    sourceProvider: 'alipay', // 当前使用的阿里云
    targetProvider: 'tencent', // 目标腾讯云
    sourceSpaceId: 'env-00jxtstozh9b', // 当前空间ID
    targetRegion: 'ap-singapore-1', // 新加坡区域
    functions: [
        'addBill',
        'getBills', 
        'updateBill',
        'deleteBill',
        'addMember',
        'getMembers',
        'updateMember',
        'deleteMember',
        'getStats',
        'initData',
        'backupData',
        'errorHandler',
        'testConnection',
        'fixBillDate',
        'fixBillDateType'
    ]
};

/**
 * 生成新的manifest.json配置
 */
function generateNewManifest() {
    const manifestPath = path.join(__dirname, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // 更新uniCloud配置
    if (!manifest.uniCloud) {
        manifest.uniCloud = {};
    }
    
    manifest.uniCloud = {
        provider: migrationConfig.targetProvider,
        spaceId: 'YOUR_NEW_SPACE_ID', // 需要替换为新的空间ID
        clientSecret: 'YOUR_NEW_CLIENT_SECRET', // 需要替换为新的密钥
        endpoint: `https://${migrationConfig.targetRegion}.api.tcb.tencentcloudapi.com`
    };
    
    return manifest;
}

/**
 * 生成迁移后的云函数配置
 */
function generateCloudFunctionConfig() {
    const config = {
        provider: migrationConfig.targetProvider,
        spaceId: 'YOUR_NEW_SPACE_ID',
        region: migrationConfig.targetRegion,
        functions: {}
    };
    
    migrationConfig.functions.forEach(funcName => {
        config.functions[funcName] = {
            name: funcName,
            runtime: 'Nodejs12.16',
            memory: 128,
            timeout: 20,
            environment: {
                variables: {
                    NODE_ENV: 'production'
                }
            }
        };
    });
    
    return config;
}

/**
 * 生成数据迁移脚本
 */
function generateDataMigrationScript() {
    return `
// 数据迁移脚本
const { MongoClient } = require('mongodb');

async function migrateData() {
    // 源数据库连接（阿里云）
    const sourceClient = new MongoClient('YOUR_ALIPAY_MONGODB_URL');
    
    // 目标数据库连接（腾讯云）
    const targetClient = new MongoClient('YOUR_TENCENT_MONGODB_URL');
    
    try {
        await sourceClient.connect();
        await targetClient.connect();
        
        const sourceDb = sourceClient.db('your_database_name');
        const targetDb = targetClient.db('your_database_name');
        
        // 迁移账单数据
        const bills = await sourceDb.collection('bills').find({}).toArray();
        if (bills.length > 0) {
            await targetDb.collection('bills').insertMany(bills);
            console.log(\`迁移了 \${bills.length} 条账单数据\`);
        }
        
        // 迁移成员数据
        const members = await sourceDb.collection('members').find({}).toArray();
        if (members.length > 0) {
            await targetDb.collection('members').insertMany(members);
            console.log(\`迁移了 \${members.length} 条成员数据\`);
        }
        
        // 迁移备份数据
        const backups = await sourceDb.collection('backups').find({}).toArray();
        if (backups.length > 0) {
            await targetDb.collection('backups').insertMany(backups);
            console.log(\`迁移了 \${backups.length} 条备份数据\`);
        }
        
        console.log('数据迁移完成！');
        
    } catch (error) {
        console.error('数据迁移失败:', error);
    } finally {
        await sourceClient.close();
        await targetClient.close();
    }
}

migrateData();
`;
}

/**
 * 生成部署脚本
 */
function generateDeployScript() {
    return `
#!/bin/bash

# 云函数部署脚本

echo "开始部署云函数到腾讯云..."

# 设置环境变量
export TENCENT_CLOUD_SECRET_ID="YOUR_SECRET_ID"
export TENCENT_CLOUD_SECRET_KEY="YOUR_SECRET_KEY"
export TENCENT_CLOUD_REGION="${migrationConfig.targetRegion}"

# 部署每个云函数
${migrationConfig.functions.map(funcName => `
echo "部署云函数: ${funcName}"
cd uniCloud-tencent/cloudfunctions/${funcName}
npm install
tccli scf deploy-function --function-name ${funcName} --runtime Nodejs12.16 --code . --handler index.main
`).join('\n')}

echo "所有云函数部署完成！"
`;
}

/**
 * 生成迁移检查清单
 */
function generateMigrationChecklist() {
    return `
# 迁移检查清单

## 准备工作
- [ ] 在腾讯云控制台创建云开发环境
- [ ] 记录新的空间ID和密钥
- [ ] 备份现有数据
- [ ] 测试网络连接

## 代码迁移
- [ ] 更新manifest.json配置
- [ ] 重新部署所有云函数
- [ ] 更新数据库连接配置
- [ ] 测试云函数功能

## 数据迁移
- [ ] 导出现有数据
- [ ] 导入到新数据库
- [ ] 验证数据完整性
- [ ] 测试数据读写

## 应用更新
- [ ] 更新应用配置
- [ ] 重新编译应用
- [ ] 测试所有功能
- [ ] 发布新版本

## 验证测试
- [ ] 在新加坡测试连接
- [ ] 测试所有记账功能
- [ ] 测试数据同步
- [ ] 测试错误处理

## 完成迁移
- [ ] 更新用户文档
- [ ] 通知用户更新
- [ ] 监控应用运行状态
- [ ] 关闭旧的服务空间
`;
}

// 执行迁移脚本生成
console.log('生成迁移文件...');

// 生成新的manifest配置
const newManifest = generateNewManifest();
fs.writeFileSync('manifest-new.json', JSON.stringify(newManifest, null, 2));

// 生成云函数配置
const cloudFunctionConfig = generateCloudFunctionConfig();
fs.writeFileSync('cloud-function-config.json', JSON.stringify(cloudFunctionConfig, null, 2));

// 生成数据迁移脚本
const dataMigrationScript = generateDataMigrationScript();
fs.writeFileSync('data-migration.js', dataMigrationScript);

// 生成部署脚本
const deployScript = generateDeployScript();
fs.writeFileSync('deploy.sh', deployScript);

// 生成检查清单
const checklist = generateMigrationChecklist();
fs.writeFileSync('migration-checklist.md', checklist);

console.log('迁移文件生成完成！');
console.log('请查看以下文件：');
console.log('- manifest-new.json: 新的应用配置');
console.log('- cloud-function-config.json: 云函数配置');
console.log('- data-migration.js: 数据迁移脚本');
console.log('- deploy.sh: 部署脚本');
console.log('- migration-checklist.md: 迁移检查清单'); 