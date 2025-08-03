
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
		const { startDate, endDate, type } = event;
		
		// 构建查询条件
		let whereCondition = {};
		
		if (startDate && endDate) {
			whereCondition.date = {
				$gte: new Date(startDate),
				$lte: new Date(endDate)
			};
		}
		
		if (type) {
			whereCondition.type = type;
		}
		
		// 获取所有账单数据
		const billsResult = await db.collection('bills')
			.where(whereCondition)
			.orderBy('date', 'desc')
			.get();
		
		const bills = billsResult.data;
		
		// 计算统计数据
		const stats = {
			totalExpense: 0,
			totalIncome: 0,
			categoryStats: {},
			dailyStats: {},
			monthlyStats: {}
		};
		
		// 按分类统计
		bills.forEach(bill => {
			const amount = bill.amount;
			const category = bill.category;
			const date = new Date(bill.date);
			const dayKey = date.toISOString().split('T')[0];
			const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			
			if (bill.type === 'expense') {
				stats.totalExpense += amount;
			} else {
				stats.totalIncome += amount;
			}
			
			// 分类统计
			if (!stats.categoryStats[category]) {
				stats.categoryStats[category] = {
					expense: 0,
					income: 0,
					count: 0
				};
			}
			
			if (bill.type === 'expense') {
				stats.categoryStats[category].expense += amount;
			} else {
				stats.categoryStats[category].income += amount;
			}
			stats.categoryStats[category].count += 1;
			
			// 日统计
			if (!stats.dailyStats[dayKey]) {
				stats.dailyStats[dayKey] = {
					expense: 0,
					income: 0,
					count: 0
				};
			}
			
			if (bill.type === 'expense') {
				stats.dailyStats[dayKey].expense += amount;
			} else {
				stats.dailyStats[dayKey].income += amount;
			}
			stats.dailyStats[dayKey].count += 1;
			
			// 月统计
			if (!stats.monthlyStats[monthKey]) {
				stats.monthlyStats[monthKey] = {
					expense: 0,
					income: 0,
					count: 0
				};
			}
			
			if (bill.type === 'expense') {
				stats.monthlyStats[monthKey].expense += amount;
			} else {
				stats.monthlyStats[monthKey].income += amount;
			}
			stats.monthlyStats[monthKey].count += 1;
		});
		
		// 计算净收入
		stats.netIncome = stats.totalIncome - stats.totalExpense;
		
		// 转换分类统计为数组格式
		stats.categoryList = Object.keys(stats.categoryStats).map(category => ({
			category,
			...stats.categoryStats[category]
		})).sort((a, b) => (b.expense + b.income) - (a.expense + a.income));
		
		// 转换日统计为数组格式
		stats.dailyList = Object.keys(stats.dailyStats).map(day => ({
			day,
			...stats.dailyStats[day]
		})).sort((a, b) => new Date(b.day) - new Date(a.day));
		
		// 转换月统计为数组格式
		stats.monthlyList = Object.keys(stats.monthlyStats).map(month => ({
			month,
			...stats.monthlyStats[month]
		})).sort((a, b) => new Date(b.month) - new Date(a.month));
		
		res.status(200).json({
			code: 200,
			message: '获取统计数据成功',
			data: {
				stats,
				bills,
				total: bills.length
			}
		};
		
	} catch (error) {
        console.error('getStats 失败:', error);
        res.status(500).json({
		console.error('获取统计数据失败:', error);
		res.status(200).json({
			code: 500,
			message: '获取统计数据失败',
			error: error.message
		};
	}
}; 
} finally {
    await client.close();
}