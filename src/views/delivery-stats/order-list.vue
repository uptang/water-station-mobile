<template>
  <div class="order-list-page page">
    <van-nav-bar title="订单回单明细" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <!-- 顶部统计 -->
      <div class="top-stats">
        <div class="stat-item">
          <span class="stat-label">欠款：</span>
          <span class="stat-value error">¥{{ summary.debt }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">欠桶：</span>
          <span class="stat-value error">{{ summary.debtBarrels }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">订单：</span>
          <span class="stat-value">{{ summary.orderCount }}</span>
        </div>
      </div>

      <!-- 筛选标签 -->
      <div class="filter-tabs">
        <div
          :class="['tab-item', { active: activeTab === 'all' }]"
          @click="activeTab = 'all'"
        >
          全部订单
        </div>
        <div
          :class="['tab-item', { active: activeTab === 'debtOnly' }]"
          @click="activeTab = 'debtOnly'"
        >
          只看有欠订单
        </div>
      </div>

      <!-- 订单列表 -->
      <div class="order-list">
        <div
          v-for="order in filteredOrders"
          :key="order.orderNo"
          class="order-card"
        >
          <!-- 订单头部 -->
          <div class="order-header">
            <div class="order-no-row">
              <span class="order-label">订单号：</span>
              <span class="order-no">{{ order.orderNo }}</span>
            </div>
            <div class="payment-badge online">线上支付</div>
          </div>

          <!-- 配送信息 -->
          <div class="delivery-info">
            <div class="info-row">
              <span class="info-label">配送信息：</span>
              <span class="info-value">{{ order.customerName }}—{{ order.customerPhone }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">配送地址：</span>
              <span class="info-value">{{ order.address }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">送达时间：</span>
              <span class="info-value">{{ order.deliveryTime }}</span>
            </div>
          </div>

          <!-- 财务信息 -->
          <div class="finance-info">
            <div class="finance-row">
              <div class="finance-item">
                <span class="finance-label">用电子水票：</span>
                <span class="finance-value">×{{ order.eTicketCount }}</span>
              </div>
              <div class="finance-item">
                <span class="finance-label">收现金：</span>
                <span class="finance-value">¥{{ order.cashReceived }}</span>
              </div>
            </div>
            <div class="finance-row">
              <div class="finance-item">
                <span class="finance-label">欠款：</span>
                <span class="finance-value error">¥{{ order.debt }}</span>
              </div>
              <div class="finance-item">
                <span class="finance-label">欠票：</span>
                <span class="finance-value error">{{ order.debtTickets }}</span>
              </div>
              <div class="finance-item">
                <span class="finance-label">欠桶：</span>
                <span class="finance-value error">{{ order.debtBarrels }}</span>
              </div>
            </div>
          </div>

          <!-- 商品列表 -->
          <div class="goods-list">
            <div v-for="(goods, idx) in order.goodsList" :key="idx" class="goods-item">
              <span class="goods-name">{{ goods.name }}</span>
              <span class="goods-count">×{{ goods.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="bottom-tip">没有更多了</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选标签
const activeTab = ref('all')

// 顶部统计
const summary = ref({
  debt: '0.00',
  debtBarrels: 0,
  orderCount: 2
})

// 订单列表数据
const orders = ref([
  {
    orderNo: 'LP00798139939609',
    paymentType: 'online',
    customerName: '黄**',
    customerPhone: '18468387305,6631',
    address: '江苏省扬州市广陵区斗桥镇红桥社区居委会',
    deliveryTime: '2026-02-11 09:18:28',
    eTicketCount: 0,
    cashReceived: '0.00',
    debt: '0.00',
    debtTickets: 0,
    debtBarrels: 0,
    goodsList: [
      { name: '怡宝纯净水非矿泉水4.5L*4桶/箱', count: 1 }
    ]
  },
  {
    orderNo: '408400029511132110',
    paymentType: 'online',
    customerName: '王******',
    customerPhone: '15784029616,657',
    address: '江苏省扬州市广陵区斗桥镇鑫桥·康郡(南1门)康郡花园 5栋 3单元305室',
    deliveryTime: '2026-02-04 11:09:21',
    eTicketCount: 0,
    cashReceived: '0.00',
    debt: '0.00',
    debtTickets: 0,
    debtBarrels: 0,
    goodsList: [
      { name: '怡宝饮用纯净水1.555L×12瓶/箱', count: 1 }
    ]
  }
])

// 过滤后的订单列表
const filteredOrders = computed(() => {
  if (activeTab.value === 'debtOnly') {
    return orders.value.filter(order =>
      parseFloat(order.debt) > 0 || order.debtTickets > 0 || order.debtBarrels > 0
    )
  }
  return orders.value
})
</script>

<style lang="scss" scoped>
.order-list-page {
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
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 12px;

  .stat-item {
    display: flex;
    align-items: baseline;
    gap: 4px;

    .stat-label {
      font-size: 14px;
      color: #666;
    }

    .stat-value {
      font-size: 18px;
      font-weight: bold;
      color: #333;

      &.error {
        color: #FF3B30;
      }
    }
  }
}

// 筛选标签
.filter-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 10px 16px;
    background: white;
    border-radius: 8px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;

    &.active {
      color: #4E8EF7;
      border-color: #4E8EF7;
      font-weight: 500;
    }
  }
}

// 订单列表
.order-list {
  .order-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
  }
}

// 订单头部
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;

  .order-no-row {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 4px;

    .order-label {
      font-size: 14px;
      color: #666;
    }

    .order-no {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }

  .payment-badge {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    flex-shrink: 0;

    &.online {
      background: #E8F8F2;
      color: #00C48C;
    }

    &.offline {
      background: #FFF4E6;
      color: #FF8C00;
    }
  }
}

// 配送信息
.delivery-info {
  margin-bottom: 12px;

  .info-row {
    display: flex;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 1.6;

    &:last-child {
      margin-bottom: 0;
    }

    .info-label {
      color: #666;
      flex-shrink: 0;
    }

    .info-value {
      color: #333;
      flex: 1;
    }
  }
}

// 财务信息
.finance-info {
  padding: 12px;
  background: #F8F8F8;
  border-radius: 8px;
  margin-bottom: 12px;

  .finance-row {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    .finance-item {
      display: flex;
      align-items: baseline;
      gap: 4px;

      .finance-label {
        font-size: 13px;
        color: #666;
      }

      .finance-value {
        font-size: 14px;
        color: #333;
        font-weight: 500;

        &.error {
          color: #FF3B30;
        }
      }
    }
  }
}

// 商品列表
.goods-list {
  .goods-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 14px;

    .goods-name {
      color: #333;
      flex: 1;
    }

    .goods-count {
      color: #666;
      flex-shrink: 0;
      margin-left: 12px;
    }
  }
}

// 底部提示
.bottom-tip {
  text-align: center;
  padding: 20px;
  font-size: 13px;
  color: #999;
}
</style>
