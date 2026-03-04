<template>
  <div class="delivery-detail-page page">
    <van-nav-bar title="配送明细" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <!-- 时间选择器 -->
      <div class="time-selector" @click="showTimePicker = true">
        <span>{{ currentTimeLabel }}</span>
        <van-icon name="arrow-down" />
      </div>

      <!-- 用户筛选 -->
      <div class="user-filter" @click="showUserPicker = true">
        <van-icon name="user-o" size="18" />
        <span>{{ currentUser }}</span>
      </div>

      <!-- 配送订单和配送用户统计 -->
      <div class="stats-cards">
        <div class="stats-card" @click="showOrderList">
          <div class="stats-label">配送订单</div>
          <div class="stats-value">{{ stats.deliveryOrders }}</div>
          <van-icon name="arrow" class="arrow-icon" />
        </div>
        <div class="stats-card" @click="showUserList">
          <div class="stats-label">配送用户</div>
          <div class="stats-value">{{ stats.deliveryUsers }}</div>
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>

      <!-- 回款回票 -->
      <div class="section-card">
        <div class="section-header">
          <span class="section-title">回款回票</span>
          <span class="detail-link" @click="showPaymentDetail">
            明细 <van-icon name="arrow" size="12" />
          </span>
        </div>

        <div class="highlight-row">
          <div class="highlight-item">
            <span class="highlight-label">新增欠票：</span>
            <span class="highlight-value error">{{ payment.newDebt }}</span>
          </div>
          <div class="highlight-item">
            <span class="highlight-label">新增欠款：</span>
            <span class="highlight-value error">¥{{ payment.newDebtAmount }}</span>
          </div>
        </div>

        <div class="stats-row">
          <div class="stats-item">
            <div class="stats-number">{{ payment.receivedTickets }}</div>
            <div class="stats-desc">收纸票</div>
          </div>
          <div class="stats-item">
            <div class="stats-number">¥{{ payment.actualReceived }}</div>
            <div class="stats-desc">实收款</div>
          </div>
          <div class="stats-item">
            <div class="stats-number">¥{{ payment.expectedReceived }}</div>
            <div class="stats-desc">应收款</div>
          </div>
        </div>
      </div>

      <!-- 订单回桶 -->
      <div class="section-card">
        <div class="section-header">
          <span class="section-title">订单回桶</span>
          <span class="detail-link" @click="showBarrelDetail">
            明细 <van-icon name="arrow" size="12" />
          </span>
        </div>

        <div class="highlight-row single">
          <div class="highlight-item">
            <span class="highlight-label">新增欠桶：</span>
            <span class="highlight-value error">{{ barrel.newDebt }}</span>
          </div>
        </div>

        <div class="stats-row five-cols">
          <div class="stats-item">
            <div class="stats-number">{{ barrel.deposit }}</div>
            <div class="stats-desc">押桶</div>
          </div>
          <div class="stats-item">
            <div class="stats-number">{{ barrel.refund }}</div>
            <div class="stats-desc">退桶</div>
          </div>
          <div class="stats-item">
            <div class="stats-number">{{ barrel.actualReturn }}</div>
            <div class="stats-desc">实回桶</div>
          </div>
          <div class="stats-item">
            <div class="stats-number" style="color: #4E8EF7">{{ barrel.expectedReturn }}</div>
            <div class="stats-desc">应回桶</div>
          </div>
        </div>
      </div>

      <!-- 配送商品 -->
      <div class="section-card">
        <div class="section-header">
          <span class="section-title">配送商品</span>
          <span class="detail-link" @click="showGoodsDetail">
            明细 <van-icon name="arrow" size="12" />
          </span>
        </div>

        <div class="goods-summary">
          <div class="summary-left">
            <span class="summary-label">商品总数</span>
            <span class="summary-value">{{ goods.totalCount }}</span>
          </div>
          <div class="summary-right">
            <span class="summary-label">配送收入</span>
            <span class="summary-value price">¥{{ goods.totalIncome }}</span>
          </div>
        </div>

        <div class="goods-note">
          注：商品不含纸票和空桶
        </div>

        <div class="third-party-header">
          <span class="third-party-title">拼多多商品</span>
          <span class="third-party-count">{{ goods.thirdPartyCount }}</span>
        </div>

        <div class="goods-list">
          <div v-for="(item, index) in goods.items" :key="index" class="goods-item">
            <div class="goods-info">
              <div class="goods-name">{{ item.name }}</div>
              <div class="goods-spec">{{ item.spec }}</div>
            </div>
            <div class="goods-tag">拼多多商品</div>
            <div class="goods-badge">
              <van-icon name="close" size="16" color="#fff" />
            </div>
            <div class="goods-count">×{{ item.count }}</div>
          </div>
        </div>
      </div>

      <!-- 配送纸票 -->
      <div class="section-card">
        <div class="section-title">配送纸票</div>
        <div class="ticket-summary">
          <span class="ticket-label">纸票总数</span>
          <span class="ticket-value">{{ ticket.totalCount }}</span>
        </div>
      </div>
    </div>

    <!-- 时间选择器弹窗 -->
    <van-popup v-model:show="showTimePicker" position="bottom" round>
      <van-picker
        :columns="timeOptions"
        @confirm="onTimeConfirm"
        @cancel="showTimePicker = false"
      />
    </van-popup>

    <!-- 用户选择器弹窗 -->
    <van-popup v-model:show="showUserPicker" position="bottom" round>
      <van-picker
        :columns="userOptions"
        @confirm="onUserConfirm"
        @cancel="showUserPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()

// 时间选择
const currentTimeLabel = ref('上月')
const showTimePicker = ref(false)
const timeOptions = ['本日', '昨日', '本周', '本月', '上月', '自定义时间']

// 用户筛选
const currentUser = ref('全部')
const showUserPicker = ref(false)
const userOptions = ['全部', '宋再洋', '李明', '王强']

// 统计数据
const stats = reactive({
  deliveryOrders: 2,
  deliveryUsers: 1
})

// 回款回票数据
const payment = reactive({
  newDebt: 0,
  newDebtAmount: '0.00',
  receivedTickets: 0,
  actualReceived: '0.00',
  expectedReceived: '0.00'
})

// 订单回桶数据
const barrel = reactive({
  newDebt: 0,
  deposit: 0,
  refund: 0,
  actualReturn: 0,
  expectedReturn: 0
})

// 配送商品数据
const goods = reactive({
  totalCount: 2,
  totalIncome: '0.00',
  thirdPartyCount: 2,
  items: [
    {
      name: '怡宝 饮用纯净水',
      spec: '1.55L*12瓶/箱',
      count: 2
    },
    {
      name: '怡宝纯净水非矿泉水',
      spec: '4.5L*4桶/箱',
      count: 1
    }
  ]
})

// 配送纸票数据
const ticket = reactive({
  totalCount: 0
})

// 时间选择确认
const onTimeConfirm = ({ selectedValues }) => {
  currentTimeLabel.value = selectedValues[0]
  showTimePicker.value = false
  showToast(`切换到${selectedValues[0]}`)
}

// 用户选择确认
const onUserConfirm = ({ selectedValues }) => {
  currentUser.value = selectedValues[0]
  showUserPicker.value = false
  showToast(`筛选用户：${selectedValues[0]}`)
}

// 显示订单列表
const showOrderList = () => {
  router.push('/delivery-order-list')
}

// 显示用户列表
const showUserList = () => {
  router.push('/delivery-user-detail')
}

// 显示回款回票明细
const showPaymentDetail = () => {
  router.push('/delivery-payment-detail')
}

// 显示订单回桶明细
const showBarrelDetail = () => {
  router.push('/delivery-barrel-detail')
}

// 显示配送商品明细
const showGoodsDetail = () => {
  router.push('/delivery-goods-detail')
}
</script>

<style lang="scss" scoped>
.delivery-detail-page {
  background: #f5f5f5;
  min-height: 100vh;

  :deep(.van-nav-bar) {
    background: white;

    .van-nav-bar__title {
      color: #333;
      font-weight: 500;
    }

    .van-icon {
      color: #333;
    }
  }
}

.container {
  padding: 0 12px 20px;
}

// 时间选择器
.time-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: white;
  margin-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;

  span {
    font-size: 15px;
    color: #333;
    font-weight: 500;
  }

  .van-icon {
    font-size: 14px;
    color: #666;
  }
}

// 用户筛选
.user-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  margin-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;

  span {
    font-size: 15px;
    color: #333;
  }

  .van-icon {
    color: #666;
  }
}

// 配送订单和配送用户统计卡片
.stats-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  .stats-card {
    flex: 1;
    background: linear-gradient(135deg, #E8F4F8 0%, #D1E9F3 100%);
    border-radius: 12px;
    padding: 16px;
    position: relative;
    cursor: pointer;

    .stats-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .stats-value {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }

    .arrow-icon {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 16px;
      color: #999;
    }
  }
}

// 通用section卡片样式
.section-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .detail-link {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #999;
      cursor: pointer;

      .van-icon {
        font-size: 12px;
      }
    }
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 16px;
  }
}

// 高亮行（新增欠票、新增欠款）
.highlight-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;

  &.single {
    justify-content: flex-start;
  }

  .highlight-item {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 4px;

    .highlight-label {
      font-size: 14px;
      color: #333;
    }

    .highlight-value {
      font-size: 18px;
      font-weight: bold;

      &.error {
        color: #FF3B30;
      }
    }
  }
}

// 统计行
.stats-row {
  display: flex;
  justify-content: space-around;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;

  &.five-cols {
    .stats-item {
      flex: 0 0 auto;
      min-width: 0;
    }
  }

  .stats-item {
    flex: 1;
    text-align: center;

    .stats-number {
      font-size: 18px;
      font-weight: 500;
      color: #333;
      margin-bottom: 6px;
    }

    .stats-desc {
      font-size: 12px;
      color: #666;
    }
  }
}

// 配送商品
.goods-summary {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;

  .summary-left,
  .summary-right {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .summary-label {
    font-size: 14px;
    color: #666;
  }

  .summary-value {
    font-size: 16px;
    font-weight: 500;
    color: #333;

    &.price {
      color: #FF3B30;
    }
  }
}

.goods-note {
  font-size: 12px;
  color: #999;
  margin-bottom: 16px;
}

.third-party-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;

  .third-party-title {
    font-size: 15px;
    color: #333;
  }

  .third-party-count {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
}

.goods-list {
  .goods-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f8f8f8;
    border-radius: 8px;
    margin-bottom: 8px;
    position: relative;

    &:last-child {
      margin-bottom: 0;
    }

    .goods-info {
      flex: 1;

      .goods-name {
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
      }

      .goods-spec {
        font-size: 12px;
        color: #999;
      }
    }

    .goods-tag {
      padding: 4px 8px;
      background: #4E8EF7;
      color: white;
      font-size: 12px;
      border-radius: 4px;
    }

    .goods-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 24px;
      height: 24px;
      background: #FF3B30;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .goods-count {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }
}

// 配送纸票
.ticket-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .ticket-label {
    font-size: 14px;
    color: #666;
  }

  .ticket-value {
    font-size: 18px;
    font-weight: 500;
    color: #333;
  }
}
</style>
