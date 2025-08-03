'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	console.log('getMembers event:', event);
	
	try {
		const {
			page = 1,
			pageSize = 20,
			role,
			sortBy = 'createTime',
			sortOrder = 'desc'
		} = event;
		
		// 构建查询条件
		const where = {};
		
		if (role) {
			where.role = role;
		}
		
		// 构建查询
		let query = db.collection('members').where(where);
		
		// 排序
		const sortObj = {};
		sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
		query = query.orderBy(sortObj);
		
		// 分页
		const skip = (page - 1) * pageSize;
		query = query.skip(skip).limit(pageSize);
		
		// 执行查询
		const res = await query.get();
		
		// 获取总数
		const countRes = await db.collection('members').where(where).count();
		
		return {
			code: 200,
			message: '获取成员列表成功',
			data: {
				list: res.data,
				total: countRes.total,
				page: page,
				pageSize: pageSize,
				totalPages: Math.ceil(countRes.total / pageSize)
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