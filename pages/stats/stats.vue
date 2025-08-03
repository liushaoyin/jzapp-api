<template>
	<view class="container">
		<!-- 时间筛选 -->
		<view class="filter-section">
			<view class="filter-tabs">
				<view 
					v-for="tab in timeTabs" 
					:key="tab.value"
					:class="['filter-tab', { active: currentTimeRange === tab.value }]"
					@click="selectTimeRange(tab.value)"
				>
					{{ tab.label }}
				</view>
			</view>
		</view>

		<!-- 总览卡片 -->
		<view class="overview-cards">
			<view class="overview-card">
				<text class="overview-label">总支出</text>
				<text class="overview-value expense">¥{{ totalExpense }}</text>
			</view>
			<view class="overview-card">
				<text class="overview-label">总收入</text>
				<text class="overview-value income">¥{{ totalIncome }}</text>
			</view>
			<view class="overview-card">
				<text class="overview-label">净收入</text>
				<text :class="['overview-value', netIncome >= 0 ? 'income' : 'expense']">
					¥{{ netIncome }}
				</text>
			</view>
		</view>

		<!-- 支出分类统计 -->
		<view class="stats-section">
			<view class="section-header">
				<text class="section-title">支出分类</text>
			</view>
			<view class="category-list">
				<view 
					v-for="category in expenseCategories" 
					:key="category.name"
					class="category-item"
				>
					<view class="category-info">
						<text class="category-name">{{ category.name }}</text>
						<text class="category-amount">¥{{ category.amount }}</text>
					</view>
					<view class="category-bar">
						<view 
							class="category-progress" 
							:style="{ width: category.percentage + '%' }"
						></view>
					</view>
					<text class="category-percentage">{{ category.percentage }}%</text>
				</view>
			</view>
		</view>

		<!-- 收入分类统计 -->
		<view class="stats-section">
			<view class="section-header">
				<text class="section-title">收入分类</text>
			</view>
			<view class="category-list">
				<view 
					v-for="category in incomeCategories" 
					:key="category.name"
					class="category-item"
				>
					<view class="category-info">
						<text class="category-name">{{ category.name }}</text>
						<text class="category-amount">¥{{ category.amount }}</text>
					</view>
					<view class="category-bar">
						<view 
							class="category-progress income" 
							:style="{ width: category.percentage + '%' }"
						></view>
					</view>
					<text class="category-percentage">{{ category.percentage }}%</text>
				</view>
			</view>
		</view>

		<!-- 趋势图表 -->
		<view class="stats-section">
			<view class="section-header">
				<text class="section-title">收支趋势</text>
			</view>
			<view class="trend-chart">
				<view class="chart-placeholder">
					<text class="chart-text">图表功能开发中...</text>
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
				currentTimeRange: 'month',
				timeTabs: [
					{ label: '本周', value: 'week' },
					{ label: '本月', value: 'month' },
					{ label: '本年', value: 'year' }
				],
				totalExpense: '0.00',
				totalIncome: '0.00',
				netIncome: '0.00',
				expenseCategories: [],
				incomeCategories: []
			}
		},
		onLoad() {
			this.loadStats()
		},
		methods: {
			// 选择时间范围
			selectTimeRange(range) {
				this.currentTimeRange = range
				this.loadStats()
			},
			
			// 加载统计数据
			async loadStats() {
				try {
					uni.showLoading({ title: '加载中...' })
					
					const { startDate, endDate } = this.getDateRange()
					
					// 获取支出数据
					const expenseResult = await api.getBills({
						startDate: startDate.toISOString(),
						endDate: endDate.toISOString(),
						type: 'expense'
					})
					
					// 获取收入数据
					const incomeResult = await api.getBills({
						startDate: startDate.toISOString(),
						endDate: endDate.toISOString(),
						type: 'income'
					})
					
					if (expenseResult.code === 200) {
						this.processExpenseData(expenseResult.data.list)
					}
					
					if (incomeResult.code === 200) {
						this.processIncomeData(incomeResult.data.list)
					}
					
				} catch (error) {
					console.error('加载统计数据失败:', error)
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				} finally {
					uni.hideLoading()
				}
			},
			
			// 获取日期范围
			getDateRange() {
				const now = new Date()
				let startDate, endDate
				
				switch (this.currentTimeRange) {
					case 'week':
						const weekStart = new Date(now)
						weekStart.setDate(now.getDate() - now.getDay())
						weekStart.setHours(0, 0, 0, 0)
						startDate = weekStart
						endDate = new Date(weekStart)
						endDate.setDate(weekStart.getDate() + 6)
						endDate.setHours(23, 59, 59, 999)
						break
					case 'month':
						startDate = new Date(now.getFullYear(), now.getMonth(), 1)
						endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
						endDate.setHours(23, 59, 59, 999)
						break
					case 'year':
						startDate = new Date(now.getFullYear(), 0, 1)
						endDate = new Date(now.getFullYear(), 11, 31)
						endDate.setHours(23, 59, 59, 999)
						break
					default:
						startDate = new Date(now.getFullYear(), now.getMonth(), 1)
						endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
						endDate.setHours(23, 59, 59, 999)
				}
				
				return { startDate, endDate }
			},
			
			// 处理支出数据
			processExpenseData(bills) {
				const categoryMap = {}
				let total = 0
				
				bills.forEach(bill => {
					const category = bill.category || '其他'
					if (!categoryMap[category]) {
						categoryMap[category] = 0
					}
					categoryMap[category] += bill.amount
					total += bill.amount
				})
				
				this.totalExpense = total.toFixed(2)
				
				// 转换为数组并计算百分比
				this.expenseCategories = Object.keys(categoryMap).map(name => ({
					name,
					amount: categoryMap[name].toFixed(2),
					percentage: total > 0 ? Math.round((categoryMap[name] / total) * 100) : 0
				})).sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
			},
			
			// 处理收入数据
			processIncomeData(bills) {
				const categoryMap = {}
				let total = 0
				
				bills.forEach(bill => {
					const category = bill.category || '其他'
					if (!categoryMap[category]) {
						categoryMap[category] = 0
					}
					categoryMap[category] += bill.amount
					total += bill.amount
				})
				
				this.totalIncome = total.toFixed(2)
				
				// 计算净收入
				const net = total - parseFloat(this.totalExpense)
				this.netIncome = net.toFixed(2)
				
				// 转换为数组并计算百分比
				this.incomeCategories = Object.keys(categoryMap).map(name => ({
					name,
					amount: categoryMap[name].toFixed(2),
					percentage: total > 0 ? Math.round((categoryMap[name] / total) * 100) : 0
				})).sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
			}
		}
	}
</script>

<style scoped>
	.container {
		padding: 20rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
	}
	
	.filter-section {
		background: white;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.filter-tabs {
		display: flex;
		gap: 20rpx;
	}
	
	.filter-tab {
		flex: 1;
		text-align: center;
		padding: 20rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #666;
		background: #f8f9fa;
	}
	
	.filter-tab.active {
		background: #007AFF;
		color: white;
	}
	
	.overview-cards {
		display: flex;
		gap: 20rpx;
		margin-bottom: 20rpx;
	}
	
	.overview-card {
		flex: 1;
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
		text-align: center;
	}
	
	.overview-label {
		display: block;
		font-size: 24rpx;
		color: #666;
		margin-bottom: 10rpx;
	}
	
	.overview-value {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.overview-value.expense {
		color: #ff6b6b;
	}
	
	.overview-value.income {
		color: #4ecdc4;
	}
	
	.stats-section {
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}
	
	.section-header {
		margin-bottom: 30rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.category-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.category-item {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}
	
	.category-info {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.category-name {
		font-size: 28rpx;
		color: #333;
	}
	
	.category-amount {
		font-size: 28rpx;
		color: #666;
	}
	
	.category-bar {
		width: 200rpx;
		height: 20rpx;
		background: #f0f0f0;
		border-radius: 10rpx;
		overflow: hidden;
	}
	
	.category-progress {
		height: 100%;
		background: #ff6b6b;
		border-radius: 10rpx;
		transition: width 0.3s ease;
	}
	
	.category-progress.income {
		background: #4ecdc4;
	}
	
	.category-percentage {
		width: 80rpx;
		text-align: right;
		font-size: 24rpx;
		color: #999;
	}
	
	.trend-chart {
		height: 400rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.chart-placeholder {
		text-align: center;
	}
	
	.chart-text {
		font-size: 28rpx;
		color: #999;
	}
</style>
