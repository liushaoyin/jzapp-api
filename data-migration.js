
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
            console.log(`迁移了 ${bills.length} 条账单数据`);
        }
        
        // 迁移成员数据
        const members = await sourceDb.collection('members').find({}).toArray();
        if (members.length > 0) {
            await targetDb.collection('members').insertMany(members);
            console.log(`迁移了 ${members.length} 条成员数据`);
        }
        
        // 迁移备份数据
        const backups = await sourceDb.collection('backups').find({}).toArray();
        if (backups.length > 0) {
            await targetDb.collection('backups').insertMany(backups);
            console.log(`迁移了 ${backups.length} 条备份数据`);
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
