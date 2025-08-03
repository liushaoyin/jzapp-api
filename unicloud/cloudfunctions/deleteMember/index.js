'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try {
		const { memberId } = event;
		
		// 数据验证
		if (!memberId) {
			return {
				code: 400,
				message: '成员ID不能为空'
			};
		}
		
		// 检查是否有账单关联该成员
		const billsCount = await db.collection('bills')
			.where({
				memberId: memberId
			})
			.count();
		
		if (billsCount.total > 0) {
			return {
				code: 400,
				message: '该成员有关联的账单记录，无法删除'
			};
		}
		
		// 删除成员记录
		const result = await db.collection('members').doc(memberId).remove();
		
		return {
			code: 200,
			message: '成员删除成功',
			data: result
		};
		
	} catch (error) {
		console.error('删除成员失败:', error);
		return {
			code: 500,
			message: '删除成员失败',
			error: error.message
		};
	}
}; 