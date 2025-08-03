'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try {
		const { amount, category, description, date, memberId, type, payType, location } = event;
		
		// 数据验证
		if (!amount || !category || !date) {
			return {
				code: 400,
				message: '缺少必要参数'
			};
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
		
		const result = await db.collection('bills').add(billData);
		
		return {
			code: 200,
			message: '账单添加成功',
			data: result
		};
		
	} catch (error) {
		console.error('添加账单失败:', error);
		return {
			code: 500,
			message: '添加账单失败',
			error: error.message
		};
	}
};
