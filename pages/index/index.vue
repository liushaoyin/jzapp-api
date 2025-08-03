<template>
  <view>
    <view class="container">
      <view style="display:flex;justify-content:flex-end;margin-bottom:10px;">
        <button @click="goToMembers" style="background:#409EFF;color:#fff;">成员管理</button>
        <button @click="refreshData" style="background:#67C23A;color:#fff;margin-left:10px;">刷新数据</button>
        <button @click="checkSystem" style="background:#E6A23C;color:#fff;margin-left:10px;">系统检查</button>
        <button @click="simpleInit" style="background:#909399;color:#fff;margin-left:10px;">初始化</button>
        <button @click="goToTest" style="background:#F56C6C;color:#fff;margin-left:10px;">系统诊断</button>
      </view>
      <!-- 消费方式统计卡片 -->
      <view class="stats-card">
        <view class="stats-item">
          <text class="stats-label">刷卡消费</text>
          <text class="stats-value">¥{{ cardTotal }}</text>
          <text class="stats-percent">({{ cardPercent }}%)</text>
        </view>
        <view class="stats-item">
          <text class="stats-label">现金消费</text>
          <text class="stats-value">¥{{ cashTotal }}</text>
          <text class="stats-percent">({{ cashPercent }}%)</text>
        </view>
        <view class="stats-item" style="margin-top:10px;">
          <text class="stats-label">本月总支出</text>
          <text class="stats-value">¥{{ monthTotal }}</text>
        </view>
        <view class="stats-item" style="margin-top:2px;">
          <text class="stats-label">本月刷卡</text>
          <text class="stats-value">¥{{ monthCardTotal }}</text>
          <text class="stats-percent">({{ monthCardPercent }}%)</text>
        </view>
        <view class="stats-item" style="margin-top:2px;">
          <text class="stats-label">本月现金</text>
          <text class="stats-value">¥{{ monthCashTotal }}</text>
          <text class="stats-percent">({{ monthCashPercent }}%)</text>
        </view>
      </view>
      <!-- 语音记账按钮 -->
      <view class="voice-section">
        <button class="voice-btn" @click="startVoice">
          <text class="voice-icon">🎤</text>
          <text>语音记账</text>
        </button>
        <view v-if="voiceText" class="voice-result">
          <text>识别结果：{{ voiceText }}</text>
        </view>
      </view>
      <!-- 快速录入表单（语音识别后自动填充） -->
      <view class="quick-form" v-if="showForm">
        <view class="form-item">
          <text>日期</text>
          <input v-model="form.date" type="date" />
        </view>
        <view class="form-item">
          <text>品种</text>
          <input v-model="form.category" placeholder="如大米" />
        </view>
        <view class="form-item">
          <text>金额</text>
          <input v-model="form.amount" type="number" />
        </view>
        <view class="form-item">
          <text>方式</text>
          <picker :range="payTypes" :value="payTypeIndex" @change="onPayTypeChange">
            <view class="picker-value">{{ form.payType || '请选择方式' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text>成员</text>
          <picker :range="memberNames" :value="memberIndex" @change="onMemberChange">
            <view class="picker-value">{{ getMemberName(form.memberId) || '请选择成员' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text>购买地点</text>
          <input v-model="form.location" placeholder="如超市、菜市场" />
        </view>
        <button @click="submitBill">保存账单</button>
      </view>
      <!-- 账单列表 -->
      <view class="bill-list">
        <view class="list-header">
          <text>最近账单</text>
        </view>
        <view v-if="bills.length === 0" class="empty-state">
          <text>暂无账单记录</text>
        </view>
        <view v-else>
          <view v-for="bill in bills" :key="bill._id" class="bill-item">
            <text>{{ formatDate(bill.date) }} {{ bill.category }} ¥{{ bill.amount }} ({{ bill.payType }}) - {{ getMemberName(bill.memberId) }}<span v-if="bill.location"> @{{ bill.location }}</span></text>
            <button size="mini" @click="onEditBill(bill)">编辑</button>
            <button size="mini" type="warn" @click="onDeleteBill(bill._id)">删除</button>
          </view>
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
      bills: [],
      cardTotal: 0,
      cashTotal: 0,
      cardPercent: 0,
      cashPercent: 0,
      payTypeIndex: 0,
      memberIndex: 0,
      voiceText: '',
      showForm: false,
      form: {
        date: '', // 始终用 yyyy-MM-dd 字符串
        category: '',
        amount: '',
        payType: '',
        memberId: '',
        location: ''
      },
      payTypes: ['刷卡', '现金', '支付宝', '微信'],
      members: [],
      isEdit: false,
      editBillId: '',
      monthTotal: 0,
      monthCardTotal: 0,
      monthCashTotal: 0,
      monthCardPercent: 0,
      monthCashPercent: 0,
    }
  },
  computed: {
    memberNames() {
      return this.members.map(m => m.name)
    }
  },
  onLoad() {
    this.loadBills()
    this.loadStats()
    this.loadMembers()
    // 自动尝试修复数据问题
    this.autoFixData()
    // 暂时注释掉初始化检查，避免影响正常使用
    // this.checkInitStatus()
  },
  methods: {
    goToMembers() {
      uni.navigateTo({ url: '/pages/members/members' })
    },
    // 语音识别相关
    async startVoice() {
      // 模拟语音识别：弹窗输入
      uni.showModal({
        title: '模拟语音输入',
        editable: true,
        placeholderText: '如：我今天刷卡买了10斤大米花了50元',
        success: (res) => {
          if (res.confirm && res.content) {
            this.onVoiceResult(res.content)
          }
        }
      })
    },
    stopVoice() {
      // 停止录音，自动识别
      // 假设识别结果通过 onVoiceResult 回调
    },
    async onVoiceResult(text) {
      this.voiceText = text
      // 解析语音内容，自动填充表单
      const parsed = this.parseVoiceText(text)
      this.form = { ...this.form, ...parsed }
      // payTypeIndex 联动
      const payTypeIdx = this.payTypes.indexOf(this.form.payType)
      this.payTypeIndex = payTypeIdx >= 0 ? payTypeIdx : 0
      // memberIndex 联动
      if (this.form.memberId) {
        const idx = this.members.findIndex(m => m._id === this.form.memberId)
        this.memberIndex = idx >= 0 ? idx : 0
      }
      this.showForm = true
    },
    parseVoiceText(text) {
      const result = {
        date: this.formatDate(new Date()),
        category: '',
        amount: '',
        payType: '',
        memberId: '',
        location: ''
      }
      // 类别识别
      if (/工资/.test(text)) result.category = '工资'
      else if (/购物|买/.test(text)) result.category = '购物'
      else if (/餐饮|吃/.test(text)) result.category = '餐饮'
      else if (/交通/.test(text)) result.category = '交通'
      else if (/医疗|看病/.test(text)) result.category = '医疗'
      else if (/菜/.test(text)) result.category = '菜'
      // 支付方式
      if (text.includes('刷卡')) result.payType = '刷卡'
      else if (text.includes('现金')) result.payType = '现金'
      else if (text.includes('支付宝')) result.payType = '支付宝'
      else if (text.includes('微信')) result.payType = '微信'
      // 金额
      const amountMatch = text.match(/([0-9]+(\.[0-9]+)?)元|([0-9]+(\.[0-9]+)?)/)
      if (amountMatch) result.amount = amountMatch[1] || amountMatch[3]
      // 成员名自动识别
      for (const m of this.members) {
        if (text.includes(m.name)) {
          result.memberId = m._id
          break
        }
      }
      // 购买地点自动识别
      if (text.includes('超市') || text.includes('菜市场')) {
        result.location = text.includes('超市') ? '超市' : '菜市场'
      }
      return result
    },
    onEditBill(bill) {
      this.isEdit = true;
      this.editBillId = bill._id;
      this.form = {
        date: this.formatDate(bill.date),
        category: bill.category,
        amount: bill.amount,
        payType: bill.payType,
        memberId: bill.memberId,
        location: bill.location || ''
      };
      // 联动picker索引
      const payTypeIdx = this.payTypes.indexOf(this.form.payType)
      this.payTypeIndex = payTypeIdx >= 0 ? payTypeIdx : 0
      const memberIdx = this.members.findIndex(m => m._id === this.form.memberId)
      this.memberIndex = memberIdx >= 0 ? memberIdx : 0
      this.showForm = true;
    },
    async onDeleteBill(_id) {
      const that = this;
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条账单吗？',
        success: async (res) => {
          if (res.confirm) {
            await api.deleteBill(_id);
            that.loadBills();
            that.loadStats();
          }
        }
      })
    },
    async submitBill() {
      // 校验字段
      let missing = []
      if (!this.form.date) missing.push('日期')
      if (!this.form.category) missing.push('类别')
      if (!this.form.amount) missing.push('金额')
      if (!this.form.payType) missing.push('方式')
      if (!this.form.memberId) missing.push('成员')
      if (missing.length) {
        uni.showToast({ title: '请填写完整：' + missing.join('、'), icon: 'none' });
        return;
      }
      // 编辑 or 新增
      if (this.isEdit && this.editBillId) {
        const submitForm = { ...this.form, date: new Date(this.form.date), _id: this.editBillId }
        await api.updateBill(submitForm)
      } else {
        const submitForm = { ...this.form, date: new Date(this.form.date) }
        await api.addBill(submitForm)
      }
      this.showForm = false
      this.isEdit = false
      this.editBillId = ''
      this.loadBills()
      this.loadStats()
    },
    async loadBills() {
      const result = await api.getBills({ pageSize: 10, sortBy: 'date', sortOrder: 'desc' })
      if (result.code === 200) this.bills = result.data.list
    },
    async loadStats() {
      // 统计刷卡与现金消费比例
      const cardRes = await api.getBills({ payType: '刷卡' })
      const cashRes = await api.getBills({ payType: '现金' })
      this.cardTotal = cardRes.data && cardRes.data.list ? cardRes.data.list.reduce((sum, b) => sum + Number(b.amount), 0) : 0
      this.cashTotal = cashRes.data && cashRes.data.list ? cashRes.data.list.reduce((sum, b) => sum + Number(b.amount), 0) : 0
      const total = this.cardTotal + this.cashTotal
      // 修复百分比计算，确保加起来等于100%
      const cardPercent = total ? ((this.cardTotal / total) * 100) : 0
      const cashPercent = total ? ((this.cashTotal / total) * 100) : 0
      this.cardPercent = cardPercent.toFixed(1)
      this.cashPercent = cashPercent.toFixed(1)
      
      // 统计本月总支出 - 使用前端过滤方式
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      
      // 获取所有账单数据，然后在前端过滤本月数据
      try {
        const allBillsRes = await api.getBills({ pageSize: 1000 });
        
        if (allBillsRes.data && allBillsRes.data.list) {
          // 在前端过滤本月数据
          const currentMonthBills = allBillsRes.data.list.filter(bill => {
            const billDate = new Date(bill.date);
            return billDate >= monthStart && billDate < nextMonth;
          });
          
          this.monthTotal = currentMonthBills.reduce((sum, b) => sum + Number(b.amount), 0);
          // 统计本月刷卡与现金
          const monthCard = currentMonthBills.filter(b => b.payType === '刷卡');
          const monthCash = currentMonthBills.filter(b => b.payType === '现金');
          this.monthCardTotal = monthCard.reduce((sum, b) => sum + Number(b.amount), 0);
          this.monthCashTotal = monthCash.reduce((sum, b) => sum + Number(b.amount), 0);
          
          // 修复百分比计算，确保加起来等于100%
          const monthCardPercent = this.monthTotal ? ((this.monthCardTotal / this.monthTotal) * 100) : 0;
          const monthCashPercent = this.monthTotal ? ((this.monthCashTotal / this.monthTotal) * 100) : 0;
          
          // 只显示刷卡和现金的百分比，其他支付方式不显示百分比
          this.monthCardPercent = monthCardPercent.toFixed(1);
          this.monthCashPercent = monthCashPercent.toFixed(1);
        } else {
          this.monthTotal = 0;
          this.monthCardTotal = 0;
          this.monthCashTotal = 0;
          this.monthCardPercent = 0;
          this.monthCashPercent = 0;
        }
      } catch (error) {
        console.error('加载统计数据失败:', error);
        this.monthTotal = 0;
        this.monthCardTotal = 0;
        this.monthCashTotal = 0;
        this.monthCardPercent = 0;
        this.monthCashPercent = 0;
      }
    },
    async loadMembers() {
      const res = await api.getMembers()
      if (res.code === 200) this.members = res.data.list
    },
    getMemberName(id) {
      const m = this.members.find(m => m._id === id)
      return m ? m.name : ''
    },
    formatDate(date) {
      if (!date) return '';
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    onPayTypeChange(e) {
      this.payTypeIndex = e.detail.value
      this.form.payType = this.payTypes[this.payTypeIndex]
    },
    onMemberChange(e) {
      this.memberIndex = e.detail.value
      this.form.memberId = this.members[this.memberIndex]._id
    },
    async refreshData() {
      uni.showLoading({ title: '刷新中...' });
      try {
        await this.loadBills();
        await this.loadStats();
        await this.loadMembers();
        uni.showToast({
          title: '数据已刷新',
          icon: 'success'
        });
      } catch (error) {
        console.error('刷新数据失败:', error);
        uni.showToast({
          title: '刷新失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    async checkSystem() {
      uni.showLoading({ title: '检查中...' });
      try {
        let checkResults = [];
        
        // 测试 API 连接
        try {
          const res = await api.getBills({ pageSize: 1 });
          if (res.code === 200) {
            checkResults.push('✅ API 连接正常');
          } else {
            checkResults.push('❌ API 连接失败');
          }
        } catch (error) {
          checkResults.push('❌ API 连接异常');
        }

        // 测试数据获取
        try {
          const allBillsRes = await api.getBills({ pageSize: 1000 });
          if (allBillsRes.data && allBillsRes.data.list) {
            checkResults.push(`✅ 账单数据正常 (共${allBillsRes.data.list.length}条)`);
          } else {
            checkResults.push('❌ 账单数据获取失败');
          }
        } catch (error) {
          checkResults.push('❌ 账单数据获取异常');
        }

        // 测试成员数据获取
        try {
          const membersRes = await api.getMembers();
          if (membersRes.code === 200 && membersRes.data && membersRes.data.list) {
            checkResults.push(`✅ 成员数据正常 (共${membersRes.data.list.length}人)`);
          } else {
            checkResults.push('❌ 成员数据获取失败');
          }
        } catch (error) {
          checkResults.push('❌ 成员数据获取异常');
        }

        // 测试本月统计数据
        try {
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          
          const allBillsRes = await api.getBills({ pageSize: 1000 });
          if (allBillsRes.data && allBillsRes.data.list) {
            const currentMonthBills = allBillsRes.data.list.filter(bill => {
              const billDate = new Date(bill.date);
              return billDate >= monthStart && billDate < nextMonth;
            });
            
            const monthTotal = currentMonthBills.reduce((sum, b) => sum + Number(b.amount), 0);
            checkResults.push(`✅ 本月统计正常 (总支出¥${monthTotal.toFixed(2)})`);
          } else {
            checkResults.push('❌ 本月统计计算失败');
          }
        } catch (error) {
          checkResults.push('❌ 本月统计计算异常');
        }

        // 显示检查结果
        const successCount = checkResults.filter(result => result.startsWith('✅')).length;
        const totalCount = checkResults.length;
        
        if (successCount === totalCount) {
          uni.showToast({
            title: '系统运行正常',
            icon: 'success'
          });
        } else {
          uni.showModal({
            title: '系统检查结果',
            content: `检查项目: ${totalCount}项\n正常: ${successCount}项\n异常: ${totalCount - successCount}项\n\n${checkResults.join('\n')}`,
            showCancel: false
          });
        }

      } catch (error) {
        console.error('系统检查失败:', error);
        uni.showToast({
          title: '系统检查失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    
    // 简单初始化功能
    async simpleInit() {
      uni.showModal({
        title: '初始化确认',
        content: '确定要创建默认成员和示例数据吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({ title: '初始化中...' });
            try {
               // 检查是否已有成员
               const membersRes = await api.getMembers();
               if (membersRes.code === 200 && membersRes.data && membersRes.data.list.length === 0) {
                 // 创建默认成员
                 await api.addMember({ name: '张三', description: '家庭成员' });
                 await api.addMember({ name: '李四', description: '家庭成员' });
               }
               
               // 检查是否已有账单
               const billsRes = await api.getBills({ pageSize: 1 });
               if (billsRes.code === 200 && billsRes.data && billsRes.data.list.length === 0) {
                 // 创建示例账单
                 const today = new Date().toISOString().split('T')[0];
                 await api.addBill({
                   amount: 100,
                   category: '餐饮',
                   description: '午餐',
                   date: today,
                   payType: '现金',
                   location: '食堂'
                 });
               }
              
              uni.showToast({
                title: '初始化完成',
                icon: 'success'
              });
              
              // 重新加载数据
              await this.loadBills();
              await this.loadStats();
              await this.loadMembers();
              
            } catch (error) {
              console.error('初始化失败:', error);
              uni.showToast({
                title: '初始化失败',
                icon: 'none'
              });
            } finally {
              uni.hideLoading();
            }
          }
        }
      });
    },
    async autoFixData() {
      // 如果本月统计数据为0，尝试重新加载
      if (this.monthTotal === 0) {
        setTimeout(() => {
          this.loadStats();
        }, 1000);
      }
    },
    async checkInitStatus() {
      try {
        // 简化检查：直接检查是否有数据，而不调用云函数
        const billsRes = await api.getBills({ pageSize: 1 });
        const membersRes = await api.getMembers();
        
        if (billsRes.code === 200 && membersRes.code === 200) {
          // 检查是否有数据
          const hasBills = billsRes.data && billsRes.data.list && billsRes.data.list.length > 0;
          const hasMembers = membersRes.data && membersRes.data.list && membersRes.data.list.length > 0;
          
          if (!hasBills && !hasMembers) {
            // 系统数据为空，但不强制初始化
          }
        }
      } catch (error) {
        console.error('检查系统状态失败:', error);
      }
    },
    
    // 跳转到系统诊断页面
    goToTest() {
      uni.navigateTo({
        url: '/pages/test/test'
      });
    }
  }
}
</script>