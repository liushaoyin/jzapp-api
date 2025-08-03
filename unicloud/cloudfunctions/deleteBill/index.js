'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try {
		const { billId } = event;
		
		// 数据验证
		if (!billId) {
			return {
				code: 400,
				message: '账单ID不能为空'
			};
		}
		
		// 删除账单记录
		const result = await db.collection('bills').doc(billId).remove();
		
		return {
			code: 200,
			message: '账单删除成功',
			data: result
		};
		
	} catch (error) {
		console.error('删除账单失败:', error);
		return {
			code: 500,
			message: '删除账单失败',
			error: error.message
		};
	}
}; 