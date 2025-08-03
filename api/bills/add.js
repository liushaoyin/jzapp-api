
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db('jzapp');
        
        const event = req.body;
        console.log('event : ', event);
        
        const { amount, category, description, date, memberId, type, payType, location } = event;
        
        // 数据验证
        if (!amount || !category || !date) {
            return res.status(400).json({
                code: 400,
                message: '缺少必要参数'
            });
        }
        
        // 创建账单记录
        const billData = {
            amount: parseFloat(amount),
            category,
            description: description || '',
            date: new Date(date),
            memberId: memberId || '',
            type: type || 'expense', // expense 或 income
            payType: payType || '',
            location: location || '',
            createTime: new Date(),
            updateTime: new Date()
        };
        
        const result = await db.collection('bills').insertOne(billData);
        
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
    } finally {
        await client.close();
    }
}