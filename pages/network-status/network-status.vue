<template>
	<view class="network-status">
		<view class="status-card">
			<view class="status-header">
				<text class="status-title">网络连接状态</text>
			</view>
			
			<view class="status-content">
				<view class="status-item">
					<text class="item-label">网络连接:</text>
					<text :class="['item-value', networkStatus ? 'success' : 'error']">
						{{ networkStatus ? '正常' : '异常' }}
					</text>
				</view>
				
				<view class="status-item">
					<text class="item-label">云函数连接:</text>
					<text :class="['item-value', cloudStatus ? 'success' : 'error']">
						{{ cloudStatus ? '正常' : '异常' }}
					</text>
				</view>
				
				<view class="status-item">
					<text class="item-label">数据库连接:</text>
					<text :class="['item-value', dbStatus ? 'success' : 'error']">
						{{ dbStatus ? '正常' : '异常' }}
					</text>
				</view>
			</view>
			
			<view class="status-actions">
				<button @click="checkNetwork" :disabled="checking" class="check-btn">
					{{ checking ? '检测中...' : '重新检测' }}
				</button>
				<button @click="goBack" class="back-btn">返回</button>
			</view>
			
			<view v-if="errorMessage" class="error-message">
				<text class="error-text">{{ errorMessage }}</text>
				<text class="error-suggestion">
					建议：如果您在国外，可能需要使用VPN或联系管理员配置国际访问。
				</text>
			</view>
		</view>
	</view>
</template>

<script>
import api from '@/common/api.js'

export default {
	data() {
		return {
			networkStatus: false,
			cloudStatus: false,
			dbStatus: false,
			checking: false,
			errorMessage: ''
		}
	},
	
	onLoad() {
		this.checkNetwork()
	},
	
	methods: {
		async checkNetwork() {
			this.checking = true
			this.errorMessage = ''
			
			try {
				// 检查基础网络连接
				this.networkStatus = await this.checkBasicNetwork()
				
				// 检查云函数连接
				if (this.networkStatus) {
					this.cloudStatus = await this.checkCloudFunction()
					
					// 检查数据库连接
					if (this.cloudStatus) {
						this.dbStatus = await this.checkDatabase()
					}
				}
				
			} catch (error) {
				this.errorMessage = error.message
				console.error('网络检测失败:', error)
			} finally {
				this.checking = false
			}
		},
		
		async checkBasicNetwork() {
			try {
				const response = await fetch('https://httpbin.org/get', {
					method: 'GET',
					timeout: 5000
				})
				return response.ok
			} catch (error) {
				throw new Error('基础网络连接失败')
			}
		},
		
		async checkCloudFunction() {
			try {
				await api.callFunction('getBills', { limit: 1 })
				return true
			} catch (error) {
				throw new Error('云函数连接失败: ' + error.message)
			}
		},
		
		async checkDatabase() {
			try {
				const result = await api.getBills({ limit: 1 })
				return result && result.code === 200
			} catch (error) {
				throw new Error('数据库连接失败: ' + error.message)
			}
		},
		
		goBack() {
			uni.navigateBack()
		}
	}
}
</script>

<style scoped>
.network-status {
	padding: 20px;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.status-card {
	background-color: #fff;
	border-radius: 12px;
	padding: 20px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.status-header {
	text-align: center;
	margin-bottom: 20px;
}

.status-title {
	font-size: 18px;
	font-weight: bold;
	color: #333;
}

.status-content {
	margin-bottom: 20px;
}

.status-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 0;
	border-bottom: 1px solid #eee;
}

.status-item:last-child {
	border-bottom: none;
}

.item-label {
	font-size: 14px;
	color: #666;
}

.item-value {
	font-size: 14px;
	font-weight: bold;
}

.item-value.success {
	color: #52c41a;
}

.item-value.error {
	color: #ff4d4f;
}

.status-actions {
	display: flex;
	gap: 12px;
	margin-bottom: 20px;
}

.check-btn, .back-btn {
	flex: 1;
	height: 40px;
	border-radius: 6px;
	font-size: 14px;
}

.check-btn {
	background-color: #1890ff;
	color: #fff;
}

.check-btn:disabled {
	background-color: #d9d9d9;
	color: #999;
}

.back-btn {
	background-color: #f5f5f5;
	color: #666;
	border: 1px solid #d9d9d9;
}

.error-message {
	background-color: #fff2f0;
	border: 1px solid #ffccc7;
	border-radius: 6px;
	padding: 12px;
}

.error-text {
	display: block;
	color: #ff4d4f;
	font-size: 14px;
	margin-bottom: 8px;
}

.error-suggestion {
	display: block;
	color: #666;
	font-size: 12px;
	line-height: 1.5;
}
</style> 