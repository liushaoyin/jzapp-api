
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db('jzapp');

try {
    'use strict';


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    
    const event = req.body;
	//event为客户端上传的参数
	console.log('event : ', event)
	
	try {
		const { action, data } = event;
		
		if (action === 'backup') {
			// 备份数据
			const billsResult = await db.collection('bills').get();
			const membersResult = await db.collection('members').get();
			
			const backupData = {
				bills: billsResult.data,
				members: membersResult.data,
				backupTime: new Date().toISOString(),
				version: '1.0'
			};
			
			// 保存备份到数据库
			const result = await db.collection('backups').add(backupData);
			
			res.status(200).json({
				code: 200,
				message: '数据备份成功',
				data: {
					backupId: result.id,
					backupTime: backupData.backupTime,
					billsCount: billsResult.data.length,
					membersCount: membersResult.data.length
				}
			};
			
		} else if (action === 'restore') {
			// 恢复数据
			if (!data || !data.backupId) {
				res.status(200).json({
					code: 400,
					message: '备份ID不能为空'
				};
			}
			
			// 获取备份数据
			const backupResult = await db.collection('backups').doc(data.backupId).get();
			
			if (!backupResult.data || backupResult.data.length === 0) {
				res.status(200).json({
					code: 404,
					message: '备份数据不存在'
				};
			}
			
			const backup = backupResult.data[0];
			
			// 清空现有数据
			await db.collection('bills').remove({});
			await db.collection('members').remove({});
			
			// 恢复数据
			if (backup.bills && backup.bills.length > 0) {
				await db.collection('bills').add(backup.bills);
			}
			
			if (backup.members && backup.members.length > 0) {
				await db.collection('members').add(backup.members);
			}
			
			res.status(200).json({
				code: 200,
				message: '数据恢复成功',
				data: {
					restoredBills: backup.bills ? backup.bills.length : 0,
					restoredMembers: backup.members ? backup.members.length : 0,
					backupTime: backup.backupTime
				}
			};
			
		} else if (action === 'list') {
			// 获取备份列表
			const backupsResult = await db.collection('backups')
				.orderBy('backupTime', 'desc')
				.get();
			
			res.status(200).json({
				code: 200,
				message: '获取备份列表成功',
				data: backupsResult.data
			};
			
		} else {
			res.status(200).json({
				code: 400,
				message: '无效的操作类型'
			};
		}
		
	} catch (error) {
        console.error('backupData 失败:', error);
        res.status(500).json({
		console.error('数据备份/恢复失败:', error);
		res.status(200).json({
			code: 500,
			message: '数据备份/恢复失败',
			error: error.message
		};
	}
}; 
} finally {
    await client.close();
}