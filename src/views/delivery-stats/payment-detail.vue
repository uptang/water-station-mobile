<template>
  <div class="payment-detail-page page">
    <van-nav-bar title="回票/现金详情" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <!-- 汇总统计 -->
      <div class="summary-section">
        <div class="summary-item">
          <div class="summary-label">应收款</div>
          <div class="summary-value">¥{{ summaryData.receivable }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">实收款</div>
          <div class="summary-value">¥{{ summaryData.actualReceived }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">实收水票</div>
          <div class="summary-value">{{ summaryData.ticketCount }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">新增欠款</div>
          <div class="summary-value debt">¥{{ summaryData.newDebt }}</div>
        </div>
      </div>

      <!-- 回票明细 -->
      <div class="section-card">
        <div class="section-title">回票明细</div>

        <div v-if="invoiceList.length === 0" class="empty-state">
          <van-empty description="暂无回票！" />
        </div>

        <div v-else class="detail-list">
          <div v-for="(item, index) in invoiceList" :key="index" class="detail-item">
            <div class="detail-content">
              <div class="detail-label">{{ item.ticketType }}</div>
              <div v-if="item.ticketNumber" class="detail-desc">{{ item.ticketNumber }}</div>
            </div>
            <div class="detail-value">{{ item.count }}张</div>
          </div>
        </div>
      </div>

      <!-- 收款明细 -->
      <div class="section-card">
        <div class="section-title">收款明细</div>

        <div class="detail-list">
          <!-- 现金 -->
          <div class="detail-item highlight">
            <div class="detail-label bold">现金</div>
            <div class="detail-value highlight-value">¥{{ summaryData.cashAmount }}</div>
          </div>

          <!-- 地址收款列表 -->
          <div v-for="(item, index) in paymentList" :key="index" class="detail-item">
            <div class="detail-content">
              <div class="detail-address">{{ item.address }}</div>
            </div>
            <div class="detail-value">¥{{ item.amount }}</div>
          </div>

          <!-- 退桶支出 -->
          <div class="refund-summary">
            <span class="refund-text">（含退桶支出 ¥{{ summaryData.refundAmount }}）</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'

const router = useRouter()
const route = useRoute()

// 汇总数据
const summaryData = reactive({
  receivable: '0.00',
  actualReceived: '0.00',
  ticketCount: 0,
  newDebt: '0.00',
  cashAmount: '0.00',
  refundAmount: '0.00'
})

// 回票列表
const invoiceList = ref([])

// 收款列表
const paymentList = ref([])

// 加载数据
const loadData = async () => {
  try {
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })

    // TODO: 替换为实际的 API 调用
    // const response = await fetch('/api/delivery/payment-detail/' + route.query.id)
    // const data = await response.json()

    // 模拟数据（与截图一致）
    setTimeout(() => {
      Object.assign(summaryData, {
        receivable: '0.00',
        actualReceived: '0.00',
        ticketCount: 0,
        newDebt: '0.00',
        cashAmount: '0.00',
        refundAmount: '0.00'
      })

      // 空的回票列表
      invoiceList.value = []

      // 收款地址列表
      paymentList.value = [
        {
          address: '江苏省扬州市广陵区头桥镇鑫桥·康郡(南1门)康郡花园 5栋 3单元305室',
          amount: '0.00'
        },
        {
          address: '江苏省扬州市广陵区头桥镇红杜社区居委会',
          amount: '0.00'
        }
      ]

      closeToast()
    }, 500)

  } catch (error) {
    console.error('加载失败:', error)
    closeToast()
    showToast({
      message: '加载失败，请稍后重试',
      position: 'bottom'
    })
  }
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.payment-detail-page {
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
  padding: 0 0 20px;
}

// 汇总统计区域
.summary-section {
  display: flex;
  background: white;
  padding: 20px 0;
  margin-bottom: 10px;

  .summary-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid #e5e5e5;

    &:last-child {
      border-right: none;
    }

    .summary-label {
      font-size: 13px;
      color: #666;
      margin-bottom: 8px;
    }

    .summary-value {
      font-size: 16px;
      font-weight: 500;
      color: #333;

      &.debt {
        color: #ff3b30;
      }
    }
  }
}

// 卡片区域
.section-card {
  background: white;
  padding: 16px;
  margin-bottom: 10px;

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #000;
    margin-bottom: 16px;
  }
}

// 空状态
.empty-state {
  padding: 30px 0;
  text-align: center;

  :deep(.van-empty) {
    padding: 0;

    .van-empty__description {
      font-size: 14px;
      color: #999;
      margin-top: 12px;
    }
  }
}

// 明细列表
.detail-list {
  .detail-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    &.highlight {
      padding: 16px 0;
    }

    .detail-content {
      flex: 1;
      margin-right: 12px;
    }

    .detail-label {
      font-size: 15px;
      color: #333;
      margin-bottom: 4px;

      &.bold {
        font-weight: 500;
        font-size: 16px;
      }
    }

    .detail-desc {
      font-size: 13px;
      color: #999;
      margin-top: 4px;
    }

    .detail-address {
      font-size: 14px;
      color: #333;
      line-height: 20px;
    }

    .detail-value {
      font-size: 15px;
      color: #333;
      white-space: nowrap;
      flex-shrink: 0;

      &.highlight-value {
        font-size: 18px;
        font-weight: 500;
        color: #ff3b30;
      }
    }
  }

  .refund-summary {
    padding: 15px 0 5px;
    text-align: right;

    .refund-text {
      font-size: 13px;
      color: #999;
    }
  }
}
</style>
