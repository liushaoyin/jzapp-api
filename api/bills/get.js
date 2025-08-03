
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('jzapp');

try {
    'use strict';


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const event = req.body;
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try {
		const { page = 1, pageSize = 20, startDate, endDate, category, memberId, type, payType } = event;
		
		// 构建查询条件
		let whereCondition = {};
		
		if (startDate && endDate) {
			whereCondition.date = {
				$gte: new Date(startDate),
				$lte: new Date(endDate)
			};
		}
		
		if (category) {
			whereCondition.category = category;
		}
		
		if (memberId) {
			whereCondition.memberId = memberId;
		}
		
		if (type) {
			whereCondition.type = type;
		}
		
		// 添加对payType参数的处理
		if (payType) {
			whereCondition.payType = payType;
		}
		
		// 计算分页
		const skip = (page - 1) * pageSize;
		
		// 查询账单列表
		const billsQuery = db.collection('bills')
			.where(whereCondition)
			.orderBy('date', 'desc')
			.skip(skip)
			.limit(pageSize);
		
		// 查询总数
		const countQuery = db.collection('bills').where(whereCondition).count();
		
		const [billsResult, countResult] = await Promise.all([billsQuery.get(), countQuery]);
		
		res.status(200).json({
			code: 200,
			message: '获取账单列表成功',
			data: {
				list: billsResult.data,
				total: countResult.total,
				page: parseInt(page),
				pageSize: parseInt(pageSize)
			}
		};
		
	} catch (error) {
        console.error('getBills 失败:', error);
        res.status(500).json({
		console.error('获取账单列表失败:', error);
		res.status(200).json({
			code: 500,
			message: '获取账单列表失败',
			error: error.message
		};
	}
});
} finally {
    await client.close();
}