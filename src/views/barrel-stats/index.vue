<template>
  <div class="barrel-stats-page page">
    <van-nav-bar title="空桶综合统计" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <!-- 日期范围选择 -->
      <div class="date-range" @click="showDatePicker = true">
        <span>{{ dateRange.start }} - {{ dateRange.end }}</span>
        <van-icon name="arrow-down" />
      </div>

      <!-- 用户欠桶新增 -->
      <div class="highlight-card">
        <div class="highlight-value">{{ stats.newDebt }}</div>
        <div class="highlight-label">用户欠桶新增</div>
      </div>

      <!-- 统计数据网格 -->
      <div class="stats-grid">
        <div class="grid-item">
          <div class="grid-value">{{ stats.expectedReturn }}</div>
          <div class="grid-label">应回桶</div>
        </div>
        <div class="grid-item">
          <div class="grid-value">{{ stats.actualReturn }}</div>
          <div class="grid-label">实回桶</div>
        </div>
        <div class="grid-item">
          <div class="grid-value">{{ stats.deposit }}</div>
          <div class="grid-label">押桶</div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="grid-item">
          <div class="grid-value">{{ stats.manualAdd }}</div>
          <div class="grid-label">手动加欠桶</div>
        </div>
        <div class="grid-item">
          <div class="grid-value">{{ stats.manualReduce }}</div>
          <div class="grid-label">手动减欠桶</div>
        </div>
        <div class="grid-item">
          <div class="grid-value">{{ stats.refund }}</div>
          <div class="grid-label">退桶</div>
        </div>
      </div>
    </div>

    <!-- 日期选择器弹窗 -->
    <van-popup v-model:show="showDatePicker" position="bottom" round>
      <van-date-picker
        v-model="currentDate"
        title="选择日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 日期范围
const dateRange = reactive({
  start: '2026-02-05',
  end: '2026-03-05'
})

// 日期选择器
const showDatePicker = ref(false)
const currentDate = ref(['2026', '03', '05'])
const minDate = new Date(2020, 0, 1)
const maxDate = new Date(2030, 11, 31)

// 统计数据
const stats = reactive({
  newDebt: 0,
  expectedReturn: 0,
  actualReturn: 0,
  deposit: 0,
  manualAdd: 0,
  manualReduce: 0,
  refund: 0
})

// 日期确认
const onDateConfirm = ({ selectedValues }) => {
  dateRange.end = `${selectedValues[0]}-${selectedValues[1]}-${selectedValues[2]}`
  showDatePicker.value = false
  showToast('日期已更新')
  // 这里可以调用API重新获取数据
}
</script>

<style lang="scss" scoped>
.barrel-stats-page {
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

// 日期范围选择
.date-range {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: white;
  margin-bottom: 20px;
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

// 高亮卡片（用户欠桶新增）
.highlight-card {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;

  .highlight-value {
    font-size: 64px;
    font-weight: bold;
    color: #FF3B30;
    line-height: 1;
    margin-bottom: 16px;
  }

  .highlight-label {
    font-size: 16px;
    color: #333;
  }
}

// 统计数据网格
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1px;

  &:last-child {
    margin-bottom: 0;
  }

  .grid-item {
    background: white;
    padding: 24px 12px;
    text-align: center;

    .grid-value {
      font-size: 32px;
      font-weight: bold;
      color: #333;
      line-height: 1;
      margin-bottom: 8px;
    }

    .grid-label {
      font-size: 13px;
      color: #666;
    }
  }
}
</style>
