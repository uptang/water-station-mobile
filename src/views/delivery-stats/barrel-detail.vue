<template>
  <div class="barrel-detail-page page">
    <van-nav-bar title="回桶详情" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <!-- 顶部统计 -->
      <div class="top-stats">
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">应回桶：</span>
            <span class="stat-value">{{ summary.expectedReturn }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">实回桶：</span>
            <span class="stat-value">{{ summary.actualReturn }}</span>
          </div>
        </div>
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-label">押桶：</span>
            <span class="stat-value">{{ summary.deposit }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">退桶：</span>
            <span class="stat-value">{{ summary.refund }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">新增欠桶：</span>
            <span class="stat-value error">{{ summary.newDebt }}</span>
          </div>
        </div>
      </div>

      <!-- 回桶明细 -->
      <div class="section-card">
        <div class="section-title">回桶明细</div>
        <div v-if="barrelReturnList.length === 0" class="empty-placeholder">
          暂无数据
        </div>
      </div>

      <!-- 押桶明细 -->
      <div class="section-card">
        <div class="section-title">押桶明细</div>
        <div v-if="barrelDepositList.length === 0" class="empty-placeholder">
          暂无数据
        </div>
      </div>

      <!-- 退桶明细 -->
      <div class="section-card">
        <div class="section-title">退桶明细</div>
        <div v-if="barrelRefundList.length === 0" class="empty-placeholder">
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 顶部统计数据
const summary = ref({
  expectedReturn: 0,
  actualReturn: 0,
  deposit: 0,
  refund: 0,
  newDebt: 0
})

// 回桶明细列表
const barrelReturnList = ref([])

// 押桶明细列表
const barrelDepositList = ref([])

// 退桶明细列表
const barrelRefundList = ref([])
</script>

<style lang="scss" scoped>
.barrel-detail-page {
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
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;

  .stats-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

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
}

// 通用section卡片样式
.section-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 16px;
    padding-left: 12px;
    border-left: 4px solid #4E8EF7;
  }

  .empty-placeholder {
    text-align: center;
    padding: 40px 0;
    font-size: 14px;
    color: #999;
  }
}
</style>
