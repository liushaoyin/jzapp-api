<template>
	<view class="container">
		<!-- 成员列表 -->
		<view class="member-list">
			<view class="list-header">
				<text class="list-title">家庭成员</text>
				<button class="add-member-btn" @click="showAddMember">
					<text class="add-icon">+</text>
					<text>添加成员</text>
				</button>
			</view>
			
			<view v-if="members.length === 0" class="empty-state">
				<text class="empty-text">暂无成员</text>
				<text class="empty-tip">点击上方按钮添加家庭成员</text>
			</view>
			
			<view v-else class="member-items">
				<view 
					v-for="member in members" 
					:key="member._id" 
					class="member-item"
					@click="editMember(member)"
				>
					<view class="member-avatar">
						<text class="avatar-text">{{ member.name.charAt(0) }}</text>
					</view>
					<view class="member-info">
						<text class="member-name">{{ member.name }}</text>
						<text class="member-role">{{ member.role || '成员' }}</text>
					</view>
					<view class="member-actions">
						<button class="action-btn edit-btn" @click.stop="editMember(member)">编辑</button>
						<button class="action-btn delete-btn" @click.stop="deleteMember(member)">删除</button>
					</view>
				</view>
			</view>
		</view>

		<!-- 添加/编辑成员弹窗 -->
		<uni-popup ref="memberPopup" type="bottom">
			<view class="popup-content">
				<view class="popup-header">
					<text class="popup-title">{{ isEditing ? '编辑成员' : '添加成员' }}</text>
					<text class="popup-close" @click="closeMemberPopup">×</text>
				</view>
				
				<view class="form-content">
					<view class="form-item">
						<text class="form-label">姓名</text>
						<input 
							class="form-input" 
							v-model="memberForm.name"
							placeholder="请输入姓名"
						/>
					</view>
					
					<view class="form-item">
						<text class="form-label">角色</text>
						<picker 
							:range="roleOptions"
							@change="onRoleChange"
						>
							<view class="picker-value">
								{{ memberForm.role || '请选择角色' }}
							</view>
						</picker>
					</view>
					
					<view class="form-item">
						<text class="form-label">备注</text>
						<input 
							class="form-input" 
							v-model="memberForm.note"
							placeholder="请输入备注（可选）"
						/>
					</view>
					
					<button class="submit-btn" @click="submitMember">保存</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import api from '@/common/api.js'
	
	export default {
		data() {
			return {
				members: [],
				isEditing: false,
				memberForm: {
					name: '',
					role: '',
					note: ''
				},
				roleOptions: ['家长', '孩子', '老人', '其他'],
				currentMemberId: null
			}
		},
		onLoad() {
			this.loadMembers()
		},
		onShow() {
			this.loadMembers()
		},
		methods: {
			// 加载成员列表
			async loadMembers() {
				try {
					uni.showLoading({ title: '加载中...' })
					const result = await api.getMembers()
					if (result.code === 200) {
						this.members = result.data.list || result.data
					}
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none'
					})
				} finally {
					uni.hideLoading()
				}
			},
			
			// 显示添加成员弹窗
			showAddMember() {
				this.isEditing = false
				this.memberForm = {
					name: '',
					role: '',
					note: ''
				}
				this.currentMemberId = null
				this.$refs.memberPopup.open()
			},
			
			// 编辑成员
			editMember(member) {
				this.isEditing = true
				this.memberForm = {
					name: member.name,
					role: member.role || '',
					note: member.note || ''
				}
				this.currentMemberId = member._id
				this.$refs.memberPopup.open()
			},
			
			// 关闭成员弹窗
			closeMemberPopup() {
				this.$refs.memberPopup.close()
			},
			
			// 角色选择
			onRoleChange(e) {
				this.memberForm.role = this.roleOptions[e.detail.value]
			},
			
			// 提交成员信息
			async submitMember() {
				if (!this.memberForm.name) {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					})
					return
				}
				try {
					uni.showLoading({ title: '保存中...' })
					let result
					if (this.isEditing) {
						result = await api.updateMember(this.currentMemberId, this.memberForm.name)
					} else {
						result = await api.addMember({ name: this.memberForm.name })
					}
					if (result.code === 200) {
						uni.showToast({
							title: '保存成功',
							icon: 'success'
						})
						this.closeMemberPopup()
						this.loadMembers()
					} else {
						uni.showToast({
							title: result.message || '保存失败',
							icon: 'none'
						})
					}
				} catch (error) {
					uni.showToast({
						title: '保存失败',
						icon: 'none'
					})
				} finally {
					uni.hideLoading()
				}
			},
			
			// 删除成员
			async deleteMember(member) {
				uni.showModal({
					title: '确认删除',
					content: `确定要删除成员"${member.name}"吗？`,
					success: async (res) => {
						if (res.confirm) {
							try {
								uni.showLoading({ title: '删除中...' })
								const result = await api.deleteMember(member._id)
								if (result.code === 200) {
									uni.showToast({
										title: '删除成功',
										icon: 'success'
									})
									this.loadMembers()
								} else {
									uni.showToast({
										title: result.message || '删除失败',
										icon: 'none'
									})
								}
							} catch (error) {
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								})
							} finally {
								uni.hideLoading()
							}
						}
					}
				})
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
	
	.member-list {
		background: white;
		border-radius: 20rpx;
		padding: 30rpx;
	}
	
	.list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
	}
	
	.list-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
	
	.add-member-btn {
		display: flex;
		align-items: center;
		gap: 10rpx;
		background: linear-gradient(135deg, #667eea, #764ba2);
		color: white;
		border-radius: 20rpx;
		padding: 15rpx 25rpx;
		font-size: 28rpx;
		border: none;
	}
	
	.add-icon {
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.empty-state {
		text-align: center;
		padding: 60rpx 0;
	}
	
	.empty-text {
		display: block;
		font-size: 32rpx;
		color: #999;
		margin-bottom: 20rpx;
	}
	
	.empty-tip {
		display: block;
		font-size: 28rpx;
		color: #ccc;
	}
	
	.member-items {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.member-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background: #f8f9fa;
		border-radius: 15rpx;
	}
	
	.member-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #667eea, #764ba2);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
	}
	
	.avatar-text {
		color: white;
		font-size: 32rpx;
		font-weight: bold;
	}
	
	.member-info {
		flex: 1;
	}
	
	.member-name {
		display: block;
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.member-role {
		display: block;
		font-size: 28rpx;
		color: #666;
	}
	
	.member-actions {
		display: flex;
		gap: 15rpx;
	}
	
	.action-btn {
		padding: 10rpx 20rpx;
		border-radius: 10rpx;
		font-size: 24rpx;
		border: none;
	}
	
	.edit-btn {
		background: #007AFF;
		color: white;
	}
	
	.delete-btn {
		background: #ff6b6b;
		color: white;
	}
	
	.popup-content {
		background: white;
		border-radius: 20rpx 20rpx 0 0;
		padding: 30rpx;
		max-height: 80vh;
	}
	
	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
	}
	
	.popup-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
	}
	
	.popup-close {
		font-size: 48rpx;
		color: #999;
		line-height: 1;
	}
	
	.form-content {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}
	
	.form-item {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #eee;
	}
	
	.form-label {
		width: 120rpx;
		font-size: 28rpx;
		color: #333;
	}
	
	.form-input {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}
	
	.picker-value {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}
	
	.submit-btn {
		background: linear-gradient(135deg, #667eea, #764ba2);
		color: white;
		border-radius: 40rpx;
		height: 80rpx;
		font-size: 32rpx;
		border: none;
		margin-top: 20rpx;
	}
</style>
