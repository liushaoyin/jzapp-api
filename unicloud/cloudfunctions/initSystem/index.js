'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
	console.log('开始系统初始化...');
	
	try {
		const { action, data } = event;
		
		switch (action) {
			case 'check':
				return await checkSystemStatus();
			case 'init':
				return await initializeSystem(data);
			case 'reset':
				return await resetSystem();
			case 'backup':
				return await backupSystem();
			default:
				return {
					code: 400,
					message: '未知的初始化操作'
				};
		}
		
	} catch (error) {
		console.error('系统初始化失败:', error);
		return {
			code: 500,
			message: '系统初始化失败',
			error: error.message
		};
	}
};

// 检查系统状态
async function checkSystemStatus() {
	try {
		// 检查数据库集合是否存在
		const collections = ['bills', 'members'];
		const status = {};
		
		for (const collectionName of collections) {
			try {
				const count = await db.collection(collectionName).count();
				status[collectionName] = {
					exists: true,
					count: count.total
				};
			} catch (error) {
				status[collectionName] = {
					exists: false,
					error: error.message
				};
			}
		}
		
		// 检查系统配置
		let hasConfig = false;
		try {
			const config = await db.collection('system_config').limit(1).get();
			hasConfig = config.data.length > 0;
		} catch (error) {
			// 如果system_config集合不存在，说明未初始化
			hasConfig = false;
		}
		
		return {
			code: 200,
			message: '系统状态检查完成',
			data: {
				collections: status,
				hasConfig: hasConfig,
				initialized: hasConfig && Object.values(status).every(s => s.exists)
			}
		};
		
	} catch (error) {
		return {
			code: 500,
			message: '系统状态检查失败',
			error: error.message
		};
	}
}

// 初始化系统
async function initializeSystem(initData = {}) {
	try {
		const results = {};
		
		// 1. 创建系统配置
		const systemConfig = {
			version: '1.0.0',
			initTime: new Date(),
			lastUpdate: new Date(),
			features: {
				billManagement: true,
				memberManagement: true,
				statistics: true,
				voiceInput: true
			},
			settings: {
				defaultCurrency: 'CNY',
				defaultLanguage: 'zh-CN',
				backupEnabled: true,
				autoSync: true
			}
		};
		
		// 检查是否已有配置
		try {
			const existingConfig = await db.collection('system_config').limit(1).get();
			if (existingConfig.data.length === 0) {
				await db.collection('system_config').add(systemConfig);
				results.config = '系统配置已创建';
			} else {
				results.config = '系统配置已存在';
			}
		} catch (error) {
			// 如果集合不存在，创建它
			await db.collection('system_config').add(systemConfig);
			results.config = '系统配置已创建';
		}
		
		// 2. 初始化默认成员（如果提供）
		if (initData.defaultMembers && Array.isArray(initData.defaultMembers)) {
			const existingMembers = await db.collection('members').count();
			if (existingMembers.total === 0) {
				for (const member of initData.defaultMembers) {
					await db.collection('members').add({
						name: member.name,
						description: member.description || '',
						createTime: new Date(),
						updateTime: new Date()
					});
				}
				results.members = `已创建 ${initData.defaultMembers.length} 个默认成员`;
			} else {
				results.members = '成员数据已存在，跳过初始化';
			}
		}
		
		// 3. 初始化示例账单（如果提供）
		if (initData.sampleBills && Array.isArray(initData.sampleBills)) {
			const existingBills = await db.collection('bills').count();
			if (existingBills.total === 0) {
				for (const bill of initData.sampleBills) {
					await db.collection('bills').add({
						amount: bill.amount,
						category: bill.category,
						description: bill.description || '',
						date: new Date(bill.date),
						memberId: bill.memberId || '',
						payType: bill.payType || '现金',
						location: bill.location || '',
						type: bill.type || 'expense',
						createTime: new Date(),
						updateTime: new Date()
					});
				}
				results.bills = `已创建 ${initData.sampleBills.length} 条示例账单`;
			} else {
				results.bills = '账单数据已存在，跳过初始化';
			}
		}
		
		// 4. 创建备份记录
		try {
			await db.collection('backups').add({
				backupTime: new Date().toISOString(),
				version: '1.0.0',
				description: '系统初始化备份',
				type: 'init'
			});
		} catch (error) {
			// 如果backups集合不存在，跳过备份
			console.log('备份集合不存在，跳过备份创建');
		}
		
		return {
			code: 200,
			message: '系统初始化完成',
			data: {
				results,
				timestamp: new Date().toISOString()
			}
		};
		
	} catch (error) {
		return {
			code: 500,
			message: '系统初始化失败',
			error: error.message
		};
	}
}

// 重置系统（谨慎使用）
async function resetSystem() {
	try {
		// 备份现有数据
		const backupResult = await backupSystem();
		
		// 清空所有数据
		await db.collection('bills').remove({});
		await db.collection('members').remove({});
		await db.collection('system_config').remove({});
		try {
			await db.collection('backups').remove({});
		} catch (error) {
			// 如果backups集合不存在，跳过
		}
		
		return {
			code: 200,
			message: '系统重置完成',
			data: {
				backup: backupResult.data,
				resetTime: new Date().toISOString()
			}
		};
		
	} catch (error) {
		return {
			code: 500,
			message: '系统重置失败',
			error: error.message
		};
	}
}

// 备份系统
async function backupSystem() {
	try {
		const bills = await db.collection('bills').get();
		const members = await db.collection('members').get();
		
		let config = { data: [] };
		try {
			config = await db.collection('system_config').get();
		} catch (error) {
			// 如果system_config集合不存在，使用空数据
		}
		
		const backup = {
			backupTime: new Date().toISOString(),
			version: '1.0.0',
			description: '系统数据备份',
			data: {
				bills: bills.data,
				members: members.data,
				config: config.data
			}
		};
		
		try {
			await db.collection('backups').add(backup);
		} catch (error) {
			// 如果backups集合不存在，跳过保存
		}
		
		return {
			code: 200,
			message: '系统备份完成',
			data: {
				billsCount: bills.data.length,
				membersCount: members.data.length,
				backupTime: backup.backupTime
			}
		};
		
	} catch (error) {
		return {
			code: 500,
			message: '系统备份失败',
			error: error.message
		};
	}
} 