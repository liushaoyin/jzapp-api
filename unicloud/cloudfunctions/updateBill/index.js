'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try {
		const { billId, amount, category, description, date, memberId, type } = event;
		
		// 数据验证
		if (!billId) {
			return {
				code: 400,
				message: '账单ID不能为空'
			};
		}
		
		// 构建更新数据
		const updateData = {
			updateTime: new Date()
		};
		
		if (amount !== undefined) updateData.amount = parseFloat(amount);
		if (category !== undefined) updateData.category = category;
		if (description !== undefined) updateData.description = description;
		if (date !== undefined) updateData.date = new Date(date);
		if (memberId !== undefined) updateData.memberId = memberId;
		if (type !== undefined) updateData.type = type;
		
		// 更新账单记录
		const result = await db.collection('bills').doc(billId).update(updateData);
		
		return {
			code: 200,
			message: '账单更新成功',
			data: result
		};
		
	} catch (error) {
		console.error('更新账单失败:', error);
		return {
			code: 500,
			message: '更新账单失败',
			error: error.message
		};
	}
}; 