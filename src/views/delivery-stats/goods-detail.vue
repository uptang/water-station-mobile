<template>
  <div class="goods-detail-page page">
    <van-nav-bar title="配送明细" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <!-- 顶部统计 -->
      <div class="top-summary">
        <div class="summary-item">
          <span class="summary-label">商品数量：</span>
          <span class="summary-value">{{ summary.totalCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">配送收入：</span>
          <span class="summary-value price">¥{{ summary.totalIncome }}</span>
        </div>
      </div>

      <!-- 商品列表 -->
      <div v-for="(item, index) in goodsList" :key="index" class="goods-card">
        <div class="goods-header">
          <div class="goods-info">
            <div class="goods-name">{{ item.name }}</div>
            <div class="goods-spec">{{ item.spec }}</div>
          </div>
          <div class="goods-count">×{{ item.count }}</div>
          <div class="goods-tag">{{ item.tag }}</div>
        </div>

        <div class="goods-details">
          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">用电子水票：</span>
              <span class="detail-value">{{ item.eTicket }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">线上支付：</span>
              <span class="detail-value">{{ item.onlinePayment }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">线下结算：</span>
              <span class="detail-value">{{ item.offlineSettlement }}</span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-item">
              <span class="detail-label">收纸票：</span>
              <span class="detail-value">{{ item.receivedTicket }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">线下已收：</span>
              <span class="detail-value">{{ item.offlineReceived }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">签单：</span>
              <span class="detail-value">{{ item.signedOrder }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">回桶：</span>
              <span class="detail-value">{{ item.returnBarrel }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 汇总数据
const summary = reactive({
  totalCount: 2,
  totalIncome: '0.00'
})

// 商品列表
const goodsList = ref([
  {
    name: '怡宝 饮用纯净水',
    spec: '1.55L*12瓶/箱',
    count: 1,
    tag: '拼多多商品',
    eTicket: 0,
    onlinePayment: 1,
    offlineSettlement: 0,
    receivedTicket: 0,
    offlineReceived: 0,
    signedOrder: 0,
    returnBarrel: 0
  },
  {
    name: '怡宝纯净水非矿泉水',
    spec: '4.5L*4桶/箱',
    count: 1,
    tag: '拼多多商品',
    eTicket: 0,
    onlinePayment: 1,
    offlineSettlement: 0,
    receivedTicket: 0,
    offlineReceived: 0,
    signedOrder: 0,
    returnBarrel: 0
  }
])
</script>

<style lang="scss" scoped>
.goods-detail-page {
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
.top-summary {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16px;
  background: white;
  margin-bottom: 12px;
  border-radius: 8px;

  .summary-item {
    display: flex;
    align-items: baseline;
    gap: 4px;

    .summary-label {
      font-size: 14px;
      color: #333;
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
}

// 商品卡片
.goods-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  .goods-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 12px;

    .goods-info {
      flex: 1;

      .goods-name {
        font-size: 15px;
        color: #333;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .goods-spec {
        font-size: 13px;
        color: #666;
      }
    }

    .goods-count {
      font-size: 15px;
      color: #333;
      font-weight: 500;
    }

    .goods-tag {
      padding: 4px 8px;
      background: #4E8EF7;
      color: white;
      font-size: 12px;
      border-radius: 4px;
      white-space: nowrap;
    }
  }

  .goods-details {
    .detail-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 16px;
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .detail-item {
        display: flex;
        align-items: baseline;
        gap: 4px;
        min-width: 0;

        .detail-label {
          font-size: 13px;
          color: #666;
          white-space: nowrap;
        }

        .detail-value {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
