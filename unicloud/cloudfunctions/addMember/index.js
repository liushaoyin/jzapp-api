'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try {
		const { name, avatar, role = 'member' } = event;
		
		// 数据验证
		if (!name) {
			return {
				code: 400,
				message: '成员姓名不能为空'
			};
		}
		
		// 检查成员是否已存在
		const existingMember = await db.collection('members')
			.where({
				name: name
			})
			.get();
		
		if (existingMember.data.length > 0) {
			return {
				code: 400,
				message: '该成员已存在'
			};
		}
		
		// 创建成员记录
		const memberData = {
			name,
			avatar: avatar || '',
			role, // admin 或 member
			createTime: new Date(),
			updateTime: new Date()
		};
		
		const result = await db.collection('members').add(memberData);
		
		return {
			code: 200,
			message: '成员添加成功',
			data: result
		};
		
	} catch (error) {
		console.error('添加成员失败:', error);
		return {
			code: 500,
			message: '添加成员失败',
			error: error.message
		};
	}
};
