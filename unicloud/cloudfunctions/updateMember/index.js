'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try {
		const { memberId, name, avatar, role } = event;
		
		// 数据验证
		if (!memberId) {
			return {
				code: 400,
				message: '成员ID不能为空'
			};
		}
		
		// 构建更新数据
		const updateData = {
			updateTime: new Date()
		};
		
		if (name !== undefined) updateData.name = name;
		if (avatar !== undefined) updateData.avatar = avatar;
		if (role !== undefined) updateData.role = role;
		
		// 更新成员记录
		const result = await db.collection('members').doc(memberId).update(updateData);
		
		return {
			code: 200,
			message: '成员更新成功',
			data: result
		};
		
	} catch (error) {
		console.error('更新成员失败:', error);
		return {
			code: 500,
			message: '更新成员失败',
			error: error.message
		};
	}
}; 