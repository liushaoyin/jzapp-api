'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try {
		const { page = 1, pageSize = 50 } = event;
		
		// 计算分页
		const skip = (page - 1) * pageSize;
		
		// 查询成员列表
		const membersQuery = db.collection('members')
			.orderBy('createTime', 'desc')
			.skip(skip)
			.limit(pageSize);
		
		// 查询总数
		const countQuery = db.collection('members').count();
		
		const [membersResult, countResult] = await Promise.all([membersQuery.get(), countQuery]);
		
		return {
			code: 200,
			message: '获取成员列表成功',
			data: {
				list: membersResult.data,
				total: countResult.total,
				page: parseInt(page),
				pageSize: parseInt(pageSize)
			}
		};
		
	} catch (error) {
		console.error('获取成员列表失败:', error);
		return {
			code: 500,
			message: '获取成员列表失败',
			error: error.message
		};
	}
};
