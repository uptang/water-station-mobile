<template>
  <div class="delivery-user-detail-page page">
    <van-nav-bar title="配送用户明细" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <!-- 顶部统计 -->
      <div class="top-stats">
        <div class="stat-item">
          <span class="stat-label">欠款：</span>
          <span class="stat-value error">¥{{ summary.totalDebt }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">欠桶：</span>
          <span class="stat-value error">{{ summary.totalBarrelDebt }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">用户：</span>
          <span class="stat-value">{{ summary.totalUsers }}</span>
        </div>
      </div>

      <!-- 标签切换 -->
      <div class="tabs">
        <div
          class="tab-item"
          :class="{ active: currentTab === 'all' }"
          @click="switchTab('all')"
        >
          全部用户
        </div>
        <div
          class="tab-item"
          :class="{ active: currentTab === 'debt' }"
          @click="switchTab('debt')"
        >
          只看有欠用户
        </div>
      </div>

      <!-- 用户列表 -->
      <div v-for="(user, index) in filteredUsers" :key="index" class="user-card">
        <div class="user-title">{{ user.type }}</div>

        <div class="user-info-grid">
          <div class="info-item">
            <span class="info-label">订单数量：</span>
            <span class="info-value">×{{ user.orderCount }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">订单金额：</span>
            <span class="info-value price">¥{{ user.orderAmount }}</span>
          </div>
        </div>

        <div class="user-info-grid three-cols">
          <div class="info-item">
            <span class="info-label">应回桶：</span>
            <span class="info-value">{{ user.expectedBarrel }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">实回桶：</span>
            <span class="info-value">{{ user.actualBarrel }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">收纸票：</span>
            <span class="info-value">{{ user.receivedTicket }}</span>
          </div>
        </div>

        <div class="user-info-grid">
          <div class="info-item">
            <span class="info-label">实收款：</span>
            <span class="info-value">¥{{ user.actualReceived }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">应收款：</span>
            <span class="info-value error">¥{{ user.expectedReceived }}</span>
          </div>
        </div>

        <div class="user-debt-row">
          <div class="debt-item">
            <span class="debt-label">欠款：</span>
            <span class="debt-value error">¥{{ user.debt }}</span>
            <span class="debt-detail">(¥{{ user.debtDetail }})</span>
          </div>
          <div class="debt-item">
            <span class="debt-label">欠桶：</span>
            <span class="debt-value error">{{ user.barrelDebt }}</span>
            <span class="debt-detail">({{ user.barrelDebtDetail }})</span>
          </div>
        </div>
      </div>

      <div class="empty-tip">没有更多数据了！</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 当前标签
const currentTab = ref('all')

// 汇总数据
const summary = ref({
  totalDebt: '0.00',
  totalBarrelDebt: 0,
  totalUsers: 1
})

// 用户列表
const users = ref([
  {
    type: '三方用户',
    orderCount: 1,
    orderAmount: '21.90',
    expectedBarrel: 0,
    actualBarrel: 0,
    receivedTicket: 0,
    actualReceived: '0.00',
    expectedReceived: '0.00',
    debt: '0.00',
    debtDetail: '0.00',
    barrelDebt: 0,
    barrelDebtDetail: 0
  }
])

// 过滤后的用户列表
const filteredUsers = computed(() => {
  if (currentTab.value === 'debt') {
    return users.value.filter(user =>
      parseFloat(user.debt) > 0 || user.barrelDebt > 0
    )
  }
  return users.value
})

// 切换标签
const switchTab = (tab) => {
  currentTab.value = tab
}
</script>

<style lang="scss" scoped>
.delivery-user-detail-page {
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

// 顶部统计
.top-stats {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px;
  background: white;
  margin-bottom: 12px;
  border-radius: 8px;

  .stat-item {
    display: flex;
    align-items: baseline;
    gap: 4px;

    .stat-label {
      font-size: 14px;
      color: #333;
    }

    .stat-value {
      font-size: 16px;
      font-weight: bold;
      color: #333;

      &.error {
        color: #FF3B30;
      }
    }
  }
}

// 标签切换
.tabs {
  display: flex;
  background: white;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;

  .tab-item {
    flex: 1;
    padding: 12px;
    text-align: center;
    font-size: 15px;
    color: #666;
    cursor: pointer;
    position: relative;

    &.active {
      color: #4E8EF7;
      font-weight: 500;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #4E8EF7;
      }
    }
  }
}

// 用户卡片
.user-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  .user-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }

  .user-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 24px;
    margin-bottom: 12px;

    &.three-cols {
      grid-template-columns: 1fr 1fr 1fr;
    }

    .info-item {
      display: flex;
      align-items: baseline;
      gap: 4px;

      .info-label {
        font-size: 13px;
        color: #666;
        white-space: nowrap;
      }

      .info-value {
        font-size: 14px;
        color: #333;
        font-weight: 500;

        &.price {
          color: #FF3B30;
        }

        &.error {
          color: #FF3B30;
        }
      }
    }
  }

  .user-debt-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;

    .debt-item {
      flex: 1;
      display: flex;
      align-items: baseline;
      gap: 4px;

      .debt-label {
        font-size: 13px;
        color: #333;
      }

      .debt-value {
        font-size: 15px;
        font-weight: bold;

        &.error {
          color: #FF3B30;
        }
      }

      .debt-detail {
        font-size: 13px;
        color: #999;
      }
    }
  }
}

.empty-tip {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>
