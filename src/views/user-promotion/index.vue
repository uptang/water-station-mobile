<template>
  <div class="user-promotion-page page">
    <van-nav-bar
      title="用户推广统计"
      left-arrow
      fixed
      placeholder
      @click-left="router.back()"
    />

    <!-- 筛选区域 -->
    <div class="filter-section">
      <!-- 统计维度 -->
      <van-field
        readonly
        label="统计维度"
        :model-value="dimensionText"
        placeholder="请选择"
        is-link
        @click="showDimensionPicker = true"
      />

      <!-- 推广日期范围 -->
      <van-field
        readonly
        label="推广"
        :model-value="`${promotionDateRange.start} — ${promotionDateRange.end}`"
        is-link
        @click="showPromotionDatePicker = true"
      />

      <!-- 下单日期范围 -->
      <van-field
        readonly
        label="下单"
        :model-value="`${orderDateRange.start} — ${orderDateRange.end}`"
        is-link
        @click="showOrderDatePicker = true"
      />

      <!-- 渠道选择和刷新按钮 -->
      <div class="filter-row">
        <div class="channel-select" @click="showChannelPicker = true">
          <span>{{ channelText }}</span>
          <van-icon name="arrow-down" />
        </div>
        <van-button type="primary" plain size="small" @click="handleRefresh">刷新</van-button>
      </div>
    </div>

    <!-- 统计数据展示 -->
    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-label">推广用户数</div>
        <div class="stat-value">{{ stats.promotionUsers }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">下单用户</div>
        <div class="stat-value">{{ stats.orderUsers }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">推广订单金额</div>
        <div class="stat-value">{{ stats.orderAmount }}</div>
      </div>
    </div>

    <!-- 统计维度选择器 -->
    <van-popup v-model:show="showDimensionPicker" position="bottom" round>
      <van-picker
        :columns="dimensionOptions"
        @confirm="onDimensionConfirm"
        @cancel="showDimensionPicker = false"
      />
    </van-popup>

    <!-- 推广日期选择器 -->
    <van-calendar
      v-model:show="showPromotionDatePicker"
      type="range"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onPromotionDateConfirm"
    />

    <!-- 下单日期选择器 -->
    <van-calendar
      v-model:show="showOrderDatePicker"
      type="range"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onOrderDateConfirm"
    />

    <!-- 渠道选择器 -->
    <van-popup v-model:show="showChannelPicker" position="bottom" round>
      <van-picker
        :columns="channelOptions"
        @confirm="onChannelConfirm"
        @cancel="showChannelPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const showDimensionPicker = ref(false)
const showPromotionDatePicker = ref(false)
const showOrderDatePicker = ref(false)
const showChannelPicker = ref(false)
const selectedDimension = ref('')
const selectedChannel = ref('all')

// 统计维度选项
const dimensionOptions = [
  { text: '请选择', value: '' },
  { text: '按日统计', value: 'day' },
  { text: '按周统计', value: 'week' },
  { text: '按月统计', value: 'month' }
]

// 渠道选项
const channelOptions = [
  { text: '所有渠道', value: 'all' },
  { text: '公众号', value: 'gzh' },
  { text: '微信小程序', value: 'wxapp' },
  { text: '电话', value: 'phone' },
  { text: '二维码', value: 'qrcode' },
  { text: '支付宝小程序', value: 'aliapp' }
]

// 推广日期范围
const promotionDateRange = reactive({
  start: '2026-01-28',
  end: '2026-02-28'
})

// 下单日期范围
const orderDateRange = reactive({
  start: '2026-01-28',
  end: '2026-02-28'
})

// 统计数据
const stats = ref({
  promotionUsers: 0,
  orderUsers: 0,
  orderAmount: 0
})

const minDate = new Date(2020, 0, 1)
const maxDate = new Date(2030, 11, 31)

// 统计维度文本
const dimensionText = computed(() => {
  if (!selectedDimension.value) return '请选择'
  const dimension = dimensionOptions.find(item => item.value === selectedDimension.value)
  return dimension ? dimension.text : '请选择'
})

// 渠道文本
const channelText = computed(() => {
  const channel = channelOptions.find(item => item.value === selectedChannel.value)
  return channel ? channel.text : '所有渠道'
})

// 统计维度确认
const onDimensionConfirm = ({ selectedOptions }) => {
  selectedDimension.value = selectedOptions[0].value
  showDimensionPicker.value = false
}

// 推广日期确认
const onPromotionDateConfirm = (values) => {
  const [start, end] = values
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  promotionDateRange.start = formatDate(start)
  promotionDateRange.end = formatDate(end)
  showPromotionDatePicker.value = false
}

// 下单日期确认
const onOrderDateConfirm = (values) => {
  const [start, end] = values
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  orderDateRange.start = formatDate(start)
  orderDateRange.end = formatDate(end)
  showOrderDatePicker.value = false
}

// 渠道确认
const onChannelConfirm = ({ selectedOptions }) => {
  selectedChannel.value = selectedOptions[0].value
  showChannelPicker.value = false
}

// 刷新数据
const handleRefresh = () => {
  showToast('正在刷新...')
  // 这里可以调用API获取数据
  setTimeout(() => {
    showToast('刷新成功')
  }, 500)
}
</script>

<style lang="scss" scoped>
.user-promotion-page {
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

.filter-section {
  background: white;
  margin-bottom: 8px;

  :deep(.van-cell) {
    padding: 14px 16px;
  }

  :deep(.van-field__label) {
    width: 80px;
    color: #333;
    font-size: 15px;
  }

  :deep(.van-field__control) {
    color: #333;
    font-size: 15px;
  }

  :deep(.van-field__control::placeholder) {
    color: #c8c9cc;
  }

  .filter-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-top: 1px solid #f0f0f0;

    .channel-select {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #333;
      font-size: 15px;
      cursor: pointer;

      .van-icon {
        font-size: 12px;
        color: #969799;
      }
    }

    .van-button {
      border-color: #4E8EF7;
      color: #4E8EF7;
      height: 32px;
      padding: 0 20px;
      font-size: 14px;
    }
  }
}

.stats-section {
  background: white;
  padding: 16px;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  gap: 12px;

  .stat-item {
    flex: 1;
    text-align: center;

    .stat-label {
      font-size: 14px;
      color: #999;
      margin-bottom: 12px;
      line-height: 1.5;
    }

    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }
  }
}
</style>
