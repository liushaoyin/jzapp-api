// ... existing code ...
const { startDate, endDate, category, memberId, type, payType, page = 1, pageSize = 10 } = event

// 构建查询条件
let matchCondition = {}
if (startDate && endDate) {
  matchCondition.date = _.gte(startDate).and(_.lt(endDate))
}
if (category) {
  matchCondition.category = category
}
if (memberId) {
  matchCondition.memberId = memberId
}
if (type) {
  matchCondition.type = type
}
if (payType) {
  matchCondition.payType = payType
}
// ... existing code ...
const { startDate, endDate, category, memberId, type, payType, page = 1, pageSize = 10 } = event

// 构建查询条件
let matchCondition = {}
if (startDate && endDate) {
  matchCondition.date = _.gte(startDate).and(_.lt(endDate))
}
if (category) {
  matchCondition.category = category
}
if (memberId) {// ... existing code ...
console.log('查询条件:', JSON.stringify(matchCondition))
// ... existing code ...
console.log('查询条件:', JSON.stringify(matchCondition))
// ... existing code ...
  matchCondition.memberId = memberId
}
if (type) {
  matchCondition.type = type
}
if (payType) {
  matchCondition.payType = payType
}

// 'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try {
		const { page = 1, pageSize = 20, startDate, endDate, category, memberId, type, payType } = event;
		
		// 构建查询条件
		let whereCondition = {};
		
		if (startDate && endDate) {
			whereCondition.date = {
				$gte: new Date(startDate),
				$lte: new Date(endDate)
			};
		}
		
		if (category) {
			whereCondition.category = category;
		}
		
		if (memberId) {
			whereCondition.memberId = memberId;
		}
		
		if (type) {
			whereCondition.type = type;
		}
		
		// 添加对payType参数的处理
		if (payType) {
			whereCondition.payType = payType;
		}
		
		// 计算分页
		const skip = (page - 1) * pageSize;
		
		// 查询账单列表
		const billsQuery = db.collection('bills')
			.where(whereCondition)
			.orderBy('date', 'desc')
			.skip(skip)
			.limit(pageSize);
		
		// 查询总数
		const countQuery = db.collection('bills').where(whereCondition).count();
		
		const [billsResult, countResult] = await Promise.all([billsQuery.get(), countQuery]);
		
		return {
			code: 200,
			message: '获取账单列表成功',
			data: {
				list: billsResult.data,
				total: countResult.total,
				page: parseInt(page),
				pageSize: parseInt(pageSize)
			}
		};
		
	} catch (error) {
		console.error('获取账单列表失败:', error);
		return {
			code: 500,
			message: '获取账单列表失败',
			error: error.message
		};
	}
};
