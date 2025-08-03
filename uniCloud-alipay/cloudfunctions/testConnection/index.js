'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	console.log('testConnection event:', event);
	
	try {
		console.log('开始测试数据库连接...');
		
		// 测试数据库连接是否正常
		let connectionStatus = 'unknown';
		let billsCount = 0;
		let membersCount = 0;
		
		try {
			// 尝试一个简单的查询来测试连接
			const testResult = await db.collection('bills').limit(1).get();
			connectionStatus = 'connected';
			console.log('数据库连接正常');
			
			// 如果连接正常，尝试获取计数
			try {
				const billsResult = await db.collection('bills').count();
				billsCount = billsResult.total || 0;
				console.log('Bills count:', billsCount);
			} catch (billsError) {
				console.log('Bills集合计数失败:', billsError.message);
			}
			
			try {
				const membersResult = await db.collection('members').count();
				membersCount = membersResult.total || 0;
				console.log('Members count:', membersCount);
			} catch (membersError) {
				console.log('Members集合计数失败:', membersError.message);
			}
			
		} catch (connectionError) {
			connectionStatus = 'failed';
			console.log('数据库连接失败:', connectionError.message);
		}
		
		return {
			code: 200,
			message: '数据库连接测试完成',
			data: {
				connectionStatus: connectionStatus,
				billsCount: billsCount,
				membersCount: membersCount,
				collections: ['bills', 'members'] // 硬编码已知集合
			}
		};
		
	} catch (error) {
		console.error('数据库连接测试失败:', error);
		return {
			code: 500,
			message: '数据库连接测试失败',
			error: error.message
		};
	}
}; 