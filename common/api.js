// API服务层
class ApiService {
	// 检查网络连接 - 简化版本，直接尝试调用云函数来检测
	async checkNetwork() {
		try {
			// 直接尝试调用一个简单的云函数来检测网络连接
			const result = await uniCloud.callFunction({
				name: 'testConnection',
				data: {}
			});
			return result.result && result.result.code === 200;
		} catch (error) {
			console.warn('网络连接检测失败:', error);
			return false;
		}
	}

	// 调用云函数
	async callFunction(name, data = {}) {
		try {
			// 简化网络检测，只在非本地环境进行
			if (process.env.NODE_ENV === 'production' || !window.location.hostname.includes('localhost')) {
				const isNetworkOk = await this.checkNetwork();
				if (!isNetworkOk) {
					throw new Error('网络连接异常，请检查网络设置');
				}
			}

			const result = await uniCloud.callFunction({
				name,
				data
			});
			return result.result;
		} catch (error) {
			console.error(`调用云函数 ${name} 失败:`, error);
			
			// 针对国外访问的特殊错误处理
			if (error.message.includes('timeout') || error.message.includes('network')) {
				throw new Error('网络连接超时，可能是由于地理位置限制。建议使用VPN或联系管理员。');
			}
			
			throw error;
		}
	}

	// 账单相关API
	async addBill(billData) {
		return await this.callFunction('addBill', billData);
	}

	async getBills(params = {}) {
		return await this.callFunction('getBills', params);
	}

	async updateBill(billData) {
		return await this.callFunction('updateBill', billData);
	}

	async deleteBill(_id) {
		return await this.callFunction('deleteBill', { _id });
	}

	// 成员相关API
	async addMember(memberData) {
		return await this.callFunction('addMember', memberData);
	}

	async getMembers(params = {}) {
		return await this.callFunction('getMembers', params);
	}

	async updateMember(_id, name) {
		return await this.callFunction('updateMember', { _id, name });
	}

	async deleteMember(_id) {
		return await this.callFunction('deleteMember', { _id });
	}

	// 统计相关API
	async getStats(params = {}) {
		return await this.callFunction('getStats', params);
	}

	// 数据备份相关API
	async backupData(action, data = {}) {
		return await this.callFunction('backupData', { action, data });
	}

	// 数据初始化API
	async initData() {
		return await this.callFunction('initData');
	}

	// 系统初始化API - 暂时注释掉，避免调用未部署的云函数
	// async initSystem(action, data = {}) {
	// 	return await this.callFunction('initSystem', { action, data });
	// }

	// 检查系统初始化状态 - 暂时注释掉，避免调用未部署的云函数
	// async getInitStatus() {
	// 	return await this.callFunction('initSystem', { action: 'check' });
	// }

	// 错误处理API
	async handleError(error, functionName, params = {}) {
		return await this.callFunction('errorHandler', { error, functionName, params });
	}
}

// 创建全局API实例
const api = new ApiService();

export default api; 