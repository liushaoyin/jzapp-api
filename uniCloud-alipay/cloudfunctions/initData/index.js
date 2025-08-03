'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	console.log('initData event:', event);
	
	try {
		// 初始化成员数据
		const members = [
			{
				name: '张三',
				role: '家长',
				note: '家庭主要收入来源',
				createTime: new Date(),
				updateTime: new Date()
			},
			{
				name: '李四',
				role: '孩子',
				note: '学生',
				createTime: new Date(),
				updateTime: new Date()
			},
			{
				name: '王五',
				role: '老人',
				note: '退休人员',
				createTime: new Date(),
				updateTime: new Date()
			}
		];
		
		// 添加成员
		for (const member of members) {
			await db.collection('members').add(member);
		}
		
		// 获取成员ID用于账单关联
		const memberResult = await db.collection('members').get();
		const memberIds = memberResult.data.map(m => m._id);
		
		// 初始化账单数据
		const bills = [
			{
				amount: 50.00,
				category: '餐饮',
				description: '午餐',
				date: new Date(),
				memberId: memberIds[0],
				type: 'expense',
				createTime: new Date(),
				updateTime: new Date()
			},
			{
				amount: 200.00,
				category: '购物',
				description: '日用品',
				date: new Date(),
				memberId: memberIds[0],
				type: 'expense',
				createTime: new Date(),
				updateTime: new Date()
			},
			{
				amount: 5000.00,
				category: '工资',
				description: '月薪',
				date: new Date(),
				memberId: memberIds[0],
				type: 'income',
				createTime: new Date(),
				updateTime: new Date()
			},
			{
				amount: 30.00,
				category: '交通',
				description: '公交车费',
				date: new Date(),
				memberId: memberIds[1],
				type: 'expense',
				createTime: new Date(),
				updateTime: new Date()
			},
			{
				amount: 100.00,
				category: '医疗',
				description: '感冒药',
				date: new Date(),
				memberId: memberIds[2],
				type: 'expense',
				createTime: new Date(),
				updateTime: new Date()
			}
		];
		
		// 添加账单
		for (const bill of bills) {
			await db.collection('bills').add(bill);
		}
		
		return {
			code: 200,
			message: '数据初始化成功',
			data: {
				membersCount: members.length,
				billsCount: bills.length
			}
		};
		
	} catch (error) {
		console.error('数据初始化失败:', error);
		return {
			code: 500,
			message: '数据初始化失败',
			error: error.message
		};
	}
}; 