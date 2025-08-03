'use strict';

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try {
		const { error, functionName, params } = event;
		
		// 记录错误日志
		console.error(`云函数 ${functionName} 执行失败:`, {
			error: error,
			params: params,
			timestamp: new Date().toISOString()
		});
		
		// 根据错误类型返回不同的错误信息
		let errorMessage = '操作失败';
		let errorCode = 500;
		
		if (error.includes('permission')) {
			errorMessage = '权限不足';
			errorCode = 403;
		} else if (error.includes('not found')) {
			errorMessage = '数据不存在';
			errorCode = 404;
		} else if (error.includes('validation')) {
			errorMessage = '数据验证失败';
			errorCode = 400;
		} else if (error.includes('network')) {
			errorMessage = '网络连接失败';
			errorCode = 503;
		}
		
		return {
			code: errorCode,
			message: errorMessage,
			error: error,
			timestamp: new Date().toISOString()
		};
		
	} catch (error) {
		console.error('错误处理函数执行失败:', error);
		return {
			code: 500,
			message: '系统错误',
			error: error.message,
			timestamp: new Date().toISOString()
		};
	}
}; 