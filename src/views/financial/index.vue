<template>
  <div class="financial-page page">
    <van-nav-bar title="财务收支" left-arrow @click-left="router.back()" fixed placeholder />

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card income-card">
        <div class="label">总收入</div>
        <div class="value">¥{{ stats.totalIncome }}</div>
      </div>
      <div class="stat-card expense-card">
        <div class="label">总支出</div>
        <div class="value">¥{{ stats.totalExpense }}</div>
      </div>
      <div class="stat-card profit-card">
        <div class="label">净利润</div>
        <div class="value">¥{{ stats.profit }}</div>
      </div>
    </div>

    <!-- 时间筛选 -->
    <van-tabs v-model:active="activeTime" @change="handleTimeChange">
      <van-tab title="今日" name="today"></van-tab>
      <van-tab title="本周" name="week"></van-tab>
      <van-tab title="本月" name="month"></van-tab>
      <van-tab title="自定义" name="custom"></van-tab>
    </van-tabs>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <van-button type="primary" block round icon="plus" @click="handleAddIncome">
        收入登记
      </van-button>
      <van-button type="warning" block round icon="minus" @click="handleAddExpense">
        支出登记
      </van-button>
    </div>

    <!-- 收支记录列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="record in recordList"
          :key="record.id"
          class="record-item"
        >
          <div class="record-icon" :class="record.type">
            <van-icon :name="record.type === 'income' ? 'plus' : 'minus'" />
          </div>
          <div class="record-info">
            <div class="record-title">{{ record.title }}</div>
            <div class="record-detail">
              <span>{{ record.category }}</span>
              <span class="time">{{ record.time }}</span>
            </div>
            <div class="record-remark" v-if="record.remark">{{ record.remark }}</div>
          </div>
          <div class="record-amount" :class="record.type">
            {{ record.type === 'income' ? '+' : '-' }}¥{{ record.amount }}
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 收入登记弹窗 -->
    <van-dialog
      v-model:show="showIncomeDialog"
      title="收入登记"
      show-cancel-button
      @confirm="handleIncomeSubmit"
    >
      <van-form class="income-form">
        <van-field
          v-model="incomeForm.amount"
          label="金额"
          type="digit"
          placeholder="请输入金额"
          required
        />
        <van-field
          v-model="incomeForm.category"
          label="类别"
          placeholder="请选择类别"
          readonly
          is-link
          @click="showIncomeCategoryPicker = true"
        />
        <van-field
          v-model="incomeForm.remark"
          label="备注"
          type="textarea"
          placeholder="请输入备注"
          rows="3"
        />
      </van-form>
    </van-dialog>

    <!-- 支出登记弹窗 -->
    <van-dialog
      v-model:show="showExpenseDialog"
      title="支出登记"
      show-cancel-button
      @confirm="handleExpenseSubmit"
    >
      <van-form class="expense-form">
        <van-field
          v-model="expenseForm.amount"
          label="金额"
          type="digit"
          placeholder="请输入金额"
          required
        />
        <van-field
          v-model="expenseForm.category"
          label="类别"
          placeholder="请选择类别"
          readonly
          is-link
          @click="showExpenseCategoryPicker = true"
        />
        <van-field
          v-model="expenseForm.remark"
          label="备注"
          type="textarea"
          placeholder="请输入备注"
          rows="3"
        />
      </van-form>
    </van-dialog>

    <!-- 收入类别选择 -->
    <van-popup v-model:show="showIncomeCategoryPicker" position="bottom">
      <van-picker
        :columns="incomeCategories"
        @confirm="onIncomeConfirm"
        @cancel="showIncomeCategoryPicker = false"
      />
    </van-popup>

    <!-- 支出类别选择 -->
    <van-popup v-model:show="showExpenseCategoryPicker" position="bottom">
      <van-picker
        :columns="expenseCategories"
        @confirm="onExpenseConfirm"
        @cancel="showExpenseCategoryPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'

const router = useRouter()

const activeTime = ref('today')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const recordList = ref([])

const showIncomeDialog = ref(false)
const showExpenseDialog = ref(false)
const showIncomeCategoryPicker = ref(false)
const showExpenseCategoryPicker = ref(false)

const incomeForm = ref({
  amount: '',
  category: '',
  remark: ''
})

const expenseForm = ref({
  amount: '',
  category: '',
  remark: ''
})

const incomeCategories = ['订单收入', '水票收入', '押金收入', '其他收入']
const expenseCategories = ['采购支出', '人工支出', '运输支出', '其他支出']

// 统计数据
const stats = computed(() => {
  const income = recordList.value
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + parseFloat(r.amount), 0)
  const expense = recordList.value
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + parseFloat(r.amount), 0)

  return {
    totalIncome: income.toFixed(2),
    totalExpense: expense.toFixed(2),
    profit: (income - expense).toFixed(2)
  }
})

// 模拟数据
const mockRecords = [
  {
    id: '1',
    type: 'income',
    title: '订单收入',
    category: '订单收入',
    amount: '2850.00',
    time: '2026-01-03 14:30',
    remark: '今日订单收入'
  },
  {
    id: '2',
    type: 'expense',
    title: '采购支出',
    category: '采购支出',
    amount: '5600.00',
    time: '2026-01-03 10:20',
    remark: '进货付款'
  },
  {
    id: '3',
    type: 'income',
    title: '水票收入',
    category: '水票收入',
    amount: '1200.00',
    time: '2026-01-02 16:45',
    remark: ''
  },
  {
    id: '4',
    type: 'expense',
    title: '人工支出',
    category: '人工支出',
    amount: '800.00',
    time: '2026-01-02 09:00',
    remark: '配送员工资'
  }
]

// 加载数据
const onLoad = () => {
  setTimeout(() => {
    recordList.value = [...mockRecords]
    loading.value = false
    finished.value = true
  }, 500)
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  recordList.value = []
  onLoad()
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

// 时间切换
const handleTimeChange = () => {
  recordList.value = []
  finished.value = false
  onLoad()
}

// 添加收入
const handleAddIncome = () => {
  incomeForm.value = { amount: '', category: '', remark: '' }
  showIncomeDialog.value = true
}

// 添加支出
const handleAddExpense = () => {
  expenseForm.value = { amount: '', category: '', remark: '' }
  showExpenseDialog.value = true
}

// 收入类别确认
const onIncomeConfirm = ({ selectedValues }) => {
  incomeForm.value.category = selectedValues[0]
  showIncomeCategoryPicker.value = false
}

// 支出类别确认
const onExpenseConfirm = ({ selectedValues }) => {
  expenseForm.value.category = selectedValues[0]
  showExpenseCategoryPicker.value = false
}

// 提交收入
const handleIncomeSubmit = () => {
  if (!incomeForm.value.amount) {
    showToast('请输入金额')
    return false
  }
  if (!incomeForm.value.category) {
    showToast('请选择类别')
    return false
  }
  showSuccessToast('收入登记成功')
  showIncomeDialog.value = false
  onRefresh()
}

// 提交支出
const handleExpenseSubmit = () => {
  if (!expenseForm.value.amount) {
    showToast('请输入金额')
    return false
  }
  if (!expenseForm.value.category) {
    showToast('请选择类别')
    return false
  }
  showSuccessToast('支出登记成功')
  showExpenseDialog.value = false
  onRefresh()
}
</script>

<style lang="scss" scoped>
.financial-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 16px 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .label {
      font-size: 13px;
      color: #999;
      margin-bottom: 8px;
    }

    .value {
      font-size: 18px;
      font-weight: bold;
    }

    &.income-card .value {
      color: #09BB07;
    }

    &.expense-card .value {
      color: #FF3B30;
    }

    &.profit-card .value {
      color: #4E8EF7;
    }
  }
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
  background: white;
}

.record-item {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .record-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &.income {
      background: #E8F5E9;
      color: #09BB07;
    }

    &.expense {
      background: #FFEBEE;
      color: #FF3B30;
    }

    .van-icon {
      font-size: 20px;
    }
  }

  .record-info {
    flex: 1;

    .record-title {
      font-size: 15px;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .record-detail {
      font-size: 13px;
      color: #999;
      display: flex;
      gap: 12px;
    }

    .record-remark {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }
  }

  .record-amount {
    font-size: 18px;
    font-weight: bold;

    &.income {
      color: #09BB07;
    }

    &.expense {
      color: #FF3B30;
    }
  }
}

.income-form,
.expense-form {
  padding: 16px;
}
</style>
