<template>
	<view class="container">
		<view class="header">
			<text class="title">系统初始化</text>
			<text class="subtitle">首次使用或系统重置后的初始化设置</text>
		</view>

		<!-- 系统状态检查 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">系统状态</text>
				<button @click="checkSystemStatus" :disabled="checking" class="check-btn">
					{{ checking ? '检查中...' : '检查状态' }}
				</button>
			</view>
			
			<view v-if="systemStatus" class="status-card">
				<view class="status-item">
					<text class="status-label">系统状态:</text>
					<text :class="['status-value', systemStatus.initialized ? 'success' : 'warning']">
						{{ systemStatus.initialized ? '已初始化' : '未初始化' }}
					</text>
				</view>
				
				<view v-for="(status, collection) in systemStatus.collections" :key="collection" class="status-item">
					<text class="status-label">{{ getCollectionName(collection) }}:</text>
					<text :class="['status-value', status.exists ? 'success' : 'error']">
						{{ status.exists ? `${status.count}条记录` : '不存在' }}
					</text>
				</view>
				
				<view class="status-item">
					<text class="status-label">系统配置:</text>
					<text :class="['status-value', systemStatus.hasConfig ? 'success' : 'warning']">
						{{ systemStatus.hasConfig ? '已配置' : '未配置' }}
					</text>
				</view>
			</view>
		</view>

		<!-- 初始化选项 -->
		<view class="section">
			<view class="section-header">
				<text class="section-title">初始化选项</text>
			</view>
			
			<view class="init-options">
				<view class="option-item">
					<checkbox v-model="initOptions.createDefaultMembers" />
					<text class="option-label">创建默认成员</text>
				</view>
				
				<view class="option-item">
					<checkbox v-model="initOptions.createSampleBills" />
					<text class="option-label">创建示例账单</text>
				</view>
				
				<view class="option-item">
					<checkbox v-model="initOptions.createBackup" />
					<text class="option-label">创建初始备份</text>
				</view>
			</view>
		</view>

		<!-- 默认成员设置 -->
		<view v-if="initOptions.createDefaultMembers" class="section">
			<view class="section-header">
				<text class="section-title">默认成员</text>
				<button @click="addDefaultMember" class="add-btn">添加</button>
			</view>
			
			<view v-for="(member, index) in defaultMembers" :key="index" class="member-item">
				<input v-model="member.name" placeholder="成员姓名" class="member-input" />
				<input v-model="member.description" placeholder="描述（可选）" class="member-input" />
				<button @click="removeDefaultMember(index)" class="remove-btn">删除</button>
			</view>
		</view>

		<!-- 示例账单设置 -->
		<view v-if="initOptions.createSampleBills" class="section">
			<view class="section-header">
				<text class="section-title">示例账单</text>
				<button @click="addSampleBill" class="add-btn">添加</button>
			</view>
			
			<view v-for="(bill, index) in sampleBills" :key="index" class="bill-item">
				<input v-model="bill.amount" type="number" placeholder="金额" class="bill-input" />
				<input v-model="bill.category" placeholder="分类" class="bill-input" />
				<input v-model="bill.description" placeholder="描述" class="bill-input" />
				<picker :range="payTypes" v-model="bill.payTypeIndex" @change="onPayTypeChange(index, $event)">
					<view class="picker-value">{{ payTypes[bill.payTypeIndex] }}</view>
				</picker>
				<button @click="removeSampleBill(index)" class="remove-btn">删除</button>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="actions">
			<button @click="initializeSystem" :disabled="initializing" class="primary-btn">
				{{ initializing ? '初始化中...' : '开始初始化' }}
			</button>
			
			<button @click="backupSystem" :disabled="backingUp" class="secondary-btn">
				{{ backingUp ? '备份中...' : '备份系统' }}
			</button>
			
			<button @click="resetSystem" class="danger-btn">
				重置系统
			</button>
		</view>

		<!-- 初始化结果 -->
		<view v-if="initResult" class="result-section">
			<view class="section-header">
				<text class="section-title">初始化结果</text>
			</view>
			
			<view class="result-card">
				<view v-for="(result, key) in initResult.results" :key="key" class="result-item">
					<text class="result-label">{{ getResultLabel(key) }}:</text>
					<text class="result-value">{{ result }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	
	export default {
		data() {
			return {
				checking: false,
				initializing: false,
				backingUp: false,
				systemStatus: null,
				initResult: null,
				initOptions: {
					createDefaultMembers: true,
					createSampleBills: true,
					createBackup: true
				},
				defaultMembers: [
					{ name: '张三', description: '家庭成员' },
					{ name: '李四', description: '家庭成员' }
				],
				sampleBills: [
					{
						amount: 100,
						category: '餐饮',
						description: '午餐',
						payTypeIndex: 1,
						date: new Date().toISOString().split('T')[0]
					}
				],
				payTypes: ['刷卡', '现金', '支付宝', '微信']
			}
		},
		onLoad() {
			this.checkSystemStatus()
		},
		methods: {
			// 检查系统状态
			async checkSystemStatus() {
				this.checking = true
				try {
					const result = await api.initSystem('check')
					if (result.code === 200) {
						this.systemStatus = result.data
					} else {
						uni.showToast({
							title: '检查失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('检查系统状态失败:', error)
					uni.showToast({
						title: '检查失败',
						icon: 'none'
					})
				} finally {
					this.checking = false
				}
			},
			
			// 初始化系统
			async initializeSystem() {
				uni.showModal({
					title: '确认初始化',
					content: '确定要初始化系统吗？这将创建必要的数据库结构和示例数据。',
					success: async (res) => {
						if (res.confirm) {
							await this.performInit()
						}
					}
				})
			},
			
			async performInit() {
				this.initializing = true
				try {
					const initData = {}
					
					if (this.initOptions.createDefaultMembers) {
						initData.defaultMembers = this.defaultMembers
					}
					
					if (this.initOptions.createSampleBills) {
						initData.sampleBills = this.sampleBills.map(bill => ({
							...bill,
							payType: this.payTypes[bill.payTypeIndex]
						}))
					}
					
					const result = await api.initSystem('init', initData)
					if (result.code === 200) {
						this.initResult = result.data
						uni.showToast({
							title: '初始化成功',
							icon: 'success'
						})
						// 重新检查系统状态
						await this.checkSystemStatus()
					} else {
						uni.showToast({
							title: '初始化失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('初始化失败:', error)
					uni.showToast({
						title: '初始化失败',
						icon: 'none'
					})
				} finally {
					this.initializing = false
				}
			},
			
			// 备份系统
			async backupSystem() {
				uni.showModal({
					title: '确认备份',
					content: '确定要备份当前系统数据吗？',
					success: async (res) => {
						if (res.confirm) {
							await this.performBackup()
						}
					}
				})
			},
			
			async performBackup() {
				this.backingUp = true
				try {
					const result = await api.initSystem('backup')
					if (result.code === 200) {
						uni.showToast({
							title: '备份成功',
							icon: 'success'
						})
					} else {
						uni.showToast({
							title: '备份失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('备份失败:', error)
					uni.showToast({
						title: '备份失败',
						icon: 'none'
					})
				} finally {
					this.backingUp = false
				}
			},
			
			// 重置系统
			async resetSystem() {
				uni.showModal({
					title: '警告',
					content: '确定要重置系统吗？这将删除所有数据并恢复到初始状态！',
					success: async (res) => {
						if (res.confirm) {
							uni.showModal({
								title: '最终确认',
								content: '此操作不可逆，确定要继续吗？',
								success: async (res2) => {
									if (res2.confirm) {
										await this.performReset()
									}
								}
							})
						}
					}
				})
			},
			
			async performReset() {
				try {
					const result = await api.initSystem('reset')
					if (result.code === 200) {
						uni.showToast({
							title: '重置成功',
							icon: 'success'
						})
						// 重新检查系统状态
						await this.checkSystemStatus()
					} else {
						uni.showToast({
							title: '重置失败',
							icon: 'none'
						})
					}
				} catch (error) {
					console.error('重置失败:', error)
					uni.showToast({
						title: '重置失败',
						icon: 'none'
					})
				}
			},
			
			// 辅助方法
			getCollectionName(collection) {
				const names = {
					bills: '账单数据',
					members: '成员数据'
				}
				return names[collection] || collection
			},
			
			getResultLabel(key) {
				const labels = {
					config: '系统配置',
					members: '成员数据',
					bills: '账单数据'
				}
				return labels[key] || key
			},
			
			addDefaultMember() {
				this.defaultMembers.push({ name: '', description: '' })
			},
			
			removeDefaultMember(index) {
				this.defaultMembers.splice(index, 1)
			},
			
			addSampleBill() {
				this.sampleBills.push({
					amount: 0,
					category: '',
					description: '',
					payTypeIndex: 1,
					date: new Date().toISOString().split('T')[0]
				})
			},
			
			removeSampleBill(index) {
				this.sampleBills.splice(index, 1)
			},
			
			onPayTypeChange(index, event) {
				this.sampleBills[index].payTypeIndex = event.detail.value
			}
		}
	}
</script>

<style scoped>
	.container {
		padding: 20px;
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	
	.header {
		text-align: center;
		margin-bottom: 30px;
	}
	
	.title {
		font-size: 24px;
		font-weight: bold;
		color: #333;
		display: block;
		margin-bottom: 10px;
	}
	
	.subtitle {
		font-size: 14px;
		color: #666;
	}
	
	.section {
		background: white;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}
	
	.section-title {
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}
	
	.check-btn, .add-btn {
		background: #409EFF;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 4px;
		font-size: 14px;
	}
	
	.status-card {
		background: #f8f9fa;
		border-radius: 6px;
		padding: 15px;
	}
	
	.status-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	
	.status-label {
		font-weight: bold;
		color: #333;
	}
	
	.status-value.success {
		color: #67C23A;
	}
	
	.status-value.warning {
		color: #E6A23C;
	}
	
	.status-value.error {
		color: #F56C6C;
	}
	
	.init-options {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}
	
	.option-item {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	
	.option-label {
		font-size: 16px;
		color: #333;
	}
	
	.member-item, .bill-item {
		display: flex;
		gap: 10px;
		margin-bottom: 10px;
		align-items: center;
	}
	
	.member-input, .bill-input {
		flex: 1;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 8px;
		font-size: 14px;
	}
	
	.picker-value {
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 8px;
		font-size: 14px;
		min-width: 80px;
		text-align: center;
	}
	
	.remove-btn {
		background: #F56C6C;
		color: white;
		border: none;
		padding: 8px 12px;
		border-radius: 4px;
		font-size: 12px;
	}
	
	.actions {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-top: 30px;
	}
	
	.primary-btn {
		background: #67C23A;
		color: white;
		border: none;
		padding: 15px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: bold;
	}
	
	.secondary-btn {
		background: #409EFF;
		color: white;
		border: none;
		padding: 15px;
		border-radius: 8px;
		font-size: 16px;
	}
	
	.danger-btn {
		background: #F56C6C;
		color: white;
		border: none;
		padding: 15px;
		border-radius: 8px;
		font-size: 16px;
	}
	
	.result-section {
		margin-top: 30px;
	}
	
	.result-card {
		background: #f8f9fa;
		border-radius: 6px;
		padding: 15px;
	}
	
	.result-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}
	
	.result-label {
		font-weight: bold;
		color: #333;
	}
	
	.result-value {
		color: #666;
	}
</style> 