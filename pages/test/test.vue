<template>
	<view class="test-page">
		<view class="test-header">
			<text class="test-title">系统诊断测试</text>
			<text class="test-subtitle">检测网络连接和云服务状态</text>
		</view>
		
		<view class="test-section">
			<view class="section-title">基础网络测试</view>
			<view class="test-item">
				<text class="test-name">网络连接</text>
				<button @click="testBasicNetwork" :disabled="testing.network" class="test-btn">
					{{ testing.network ? '测试中...' : '测试' }}
				</button>
				<text :class="['test-result', results.network ? 'success' : 'error']">
					{{ results.network ? '✓ 正常' : results.network === false ? '✗ 失败' : '未测试' }}
				</text>
			</view>
		</view>
		
		<view class="test-section">
			<view class="section-title">云函数测试</view>
			<view class="test-item">
				<text class="test-name">云函数连接</text>
				<button @click="testCloudFunction" :disabled="testing.cloud" class="test-btn">
					{{ testing.cloud ? '测试中...' : '测试' }}
				</button>
				<text :class="['test-result', results.cloud ? 'success' : 'error']">
					{{ results.cloud ? '✓ 正常' : results.cloud === false ? '✗ 失败' : '未测试' }}
				</text>
			</view>
		</view>
		
		<view class="test-section">
			<view class="section-title">数据库测试</view>
			<view class="test-item">
				<text class="test-name">数据库连接</text>
				<button @click="testDatabase" :disabled="testing.database" class="test-btn">
					{{ testing.database ? '测试中...' : '测试' }}
				</button>
				<text :class="['test-result', results.database ? 'success' : 'error']">
					{{ results.database ? '✓ 正常' : results.database === false ? '✗ 失败' : '未测试' }}
				</text>
			</view>
		</view>
		
		<view class="test-section">
			<view class="section-title">完整测试</view>
			<view class="test-item">
				<text class="test-name">一键测试所有</text>
				<button @click="runAllTests" :disabled="testing.all" class="test-btn primary">
					{{ testing.all ? '测试中...' : '开始测试' }}
				</button>
			</view>
		</view>
		
		<view v-if="errorLog.length > 0" class="error-log">
			<view class="log-title">错误日志</view>
			<view v-for="(log, index) in errorLog" :key="index" class="log-item">
				<text class="log-time">{{ log.time }}</text>
				<text class="log-message">{{ log.message }}</text>
			</view>
		</view>
		
		<view v-if="suggestions.length > 0" class="suggestions">
			<view class="suggestions-title">解决建议</view>
			<view v-for="(suggestion, index) in suggestions" :key="index" class="suggestion-item">
				<text class="suggestion-text">{{ suggestion }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import api from '@/common/api.js'

export default {
	data() {
		return {
			testing: {
				network: false,
				cloud: false,
				database: false,
				all: false
			},
			results: {
				network: null,
				cloud: null,
				database: null
			},
			errorLog: [],
			suggestions: []
		}
	},
	
	onLoad() {
		this.addLog('页面加载完成，开始诊断测试')
	},
	
	methods: {
		async testBasicNetwork() {
			this.testing.network = true
			this.addLog('开始测试基础网络连接...')
			
			try {
				const response = await fetch('https://httpbin.org/get', {
					method: 'GET',
					timeout: 5000
				})
				
				if (response.ok) {
					this.results.network = true
					this.addLog('✓ 基础网络连接正常')
				} else {
					this.results.network = false
					this.addLog('✗ 基础网络连接失败: HTTP ' + response.status)
				}
			} catch (error) {
				this.results.network = false
				this.addLog('✗ 基础网络连接失败: ' + error.message)
				this.addSuggestion('检查网络连接，如果在国外可能需要使用VPN')
			} finally {
				this.testing.network = false
			}
		},
		
		async testCloudFunction() {
			this.testing.cloud = true
			this.addLog('开始测试云函数连接...')
			
			try {
				// 测试云函数调用
				const result = await uniCloud.callFunction({
					name: 'getBills',
					data: { limit: 1 }
				})
				
				if (result && result.result) {
					this.results.cloud = true
					this.addLog('✓ 云函数连接正常')
				} else {
					this.results.cloud = false
					this.addLog('✗ 云函数连接失败: 返回结果异常')
				}
			} catch (error) {
				this.results.cloud = false
				this.addLog('✗ 云函数连接失败: ' + error.message)
				this.addSuggestion('检查云函数是否已正确部署')
				this.addSuggestion('检查云空间配置是否正确')
			} finally {
				this.testing.cloud = false
			}
		},
		
		async testDatabase() {
			this.testing.database = true
			this.addLog('开始测试数据库连接...')
			
			try {
				// 使用新的测试云函数
				const result = await uniCloud.callFunction({
					name: 'testConnection'
				})
				
				if (result.result && result.result.code === 200) {
					this.results.database = true
					this.addLog('✓ 数据库连接正常')
					this.addLog(`可用集合: ${result.result.data.collections.join(', ')}`)
					this.addLog(`账单数量: ${result.result.data.billsCount}`)
					this.addLog(`成员数量: ${result.result.data.membersCount}`)
				} else {
					this.results.database = false
					this.addLog('✗ 数据库连接失败: ' + (result.result?.message || '未知错误'))
				}
			} catch (error) {
				this.results.database = false
				this.addLog('✗ 数据库连接失败: ' + error.message)
				this.addSuggestion('检查数据库集合是否存在')
				this.addSuggestion('检查数据库权限配置')
			} finally {
				this.testing.database = false
			}
		},
		
		async runAllTests() {
			this.testing.all = true
			this.addLog('开始运行完整测试...')
			
			// 清空之前的建议
			this.suggestions = []
			
			// 按顺序执行测试
			await this.testBasicNetwork()
			
			if (this.results.network) {
				await this.testCloudFunction()
				
				if (this.results.cloud) {
					await this.testDatabase()
				}
			}
			
			// 生成总体建议
			this.generateSuggestions()
			
			this.testing.all = false
			this.addLog('完整测试完成')
		},
		
		generateSuggestions() {
			if (!this.results.network) {
				this.addSuggestion('网络连接失败，请检查网络设置')
				this.addSuggestion('如果在国外，建议使用VPN或代理')
			}
			
			if (this.results.network && !this.results.cloud) {
				this.addSuggestion('网络正常但云函数连接失败，请检查云函数部署状态')
				this.addSuggestion('在HBuilderX中重新部署云函数')
			}
			
			if (this.results.cloud && !this.results.database) {
				this.addSuggestion('云函数正常但数据库连接失败，请检查数据库配置')
				this.addSuggestion('检查数据库集合是否已创建')
			}
			
			if (this.results.network && this.results.cloud && this.results.database) {
				this.addSuggestion('所有测试通过！系统运行正常')
			}
		},
		
		addLog(message) {
			const time = new Date().toLocaleTimeString()
			this.errorLog.unshift({
				time,
				message
			})
			
			// 限制日志数量
			if (this.errorLog.length > 20) {
				this.errorLog = this.errorLog.slice(0, 20)
			}
		},
		
		addSuggestion(suggestion) {
			if (!this.suggestions.includes(suggestion)) {
				this.suggestions.push(suggestion)
			}
		}
	}
}
</script>

<style scoped>
.test-page {
	padding: 20px;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.test-header {
	text-align: center;
	margin-bottom: 30px;
}

.test-title {
	display: block;
	font-size: 20px;
	font-weight: bold;
	color: #333;
	margin-bottom: 8px;
}

.test-subtitle {
	display: block;
	font-size: 14px;
	color: #666;
}

.test-section {
	background-color: #fff;
	border-radius: 12px;
	padding: 20px;
	margin-bottom: 20px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-title {
	font-size: 16px;
	font-weight: bold;
	color: #333;
	margin-bottom: 15px;
}

.test-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 0;
}

.test-name {
	font-size: 14px;
	color: #666;
	flex: 1;
}

.test-btn {
	width: 80px;
	height: 32px;
	border-radius: 6px;
	font-size: 12px;
	margin: 0 15px;
}

.test-btn.primary {
	background-color: #1890ff;
	color: #fff;
	width: 120px;
}

.test-result {
	font-size: 14px;
	font-weight: bold;
	min-width: 80px;
	text-align: right;
}

.test-result.success {
	color: #52c41a;
}

.test-result.error {
	color: #ff4d4f;
}

.error-log {
	background-color: #fff;
	border-radius: 12px;
	padding: 20px;
	margin-bottom: 20px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.log-title {
	font-size: 16px;
	font-weight: bold;
	color: #333;
	margin-bottom: 15px;
}

.log-item {
	margin-bottom: 8px;
	padding: 8px;
	background-color: #f8f9fa;
	border-radius: 6px;
}

.log-time {
	font-size: 12px;
	color: #999;
	margin-right: 10px;
}

.log-message {
	font-size: 13px;
	color: #333;
}

.suggestions {
	background-color: #fff;
	border-radius: 12px;
	padding: 20px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.suggestions-title {
	font-size: 16px;
	font-weight: bold;
	color: #333;
	margin-bottom: 15px;
}

.suggestion-item {
	margin-bottom: 10px;
	padding: 10px;
	background-color: #e6f7ff;
	border-left: 4px solid #1890ff;
	border-radius: 6px;
}

.suggestion-text {
	font-size: 14px;
	color: #333;
	line-height: 1.5;
}
</style> 