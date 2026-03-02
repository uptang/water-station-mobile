<template>
  <div class="order-feedback-page page-with-tabbar">
    <van-nav-bar title="工单反馈" left-arrow @click-left="router.back()" fixed placeholder />

    <div class="filter-bar">
      <van-field
        readonly
        label="时间:"
        :model-value="`${dateRange.start} 至 ${dateRange.end}`"
        is-link
        @click="showDatePicker = true"
      />
      <van-field
        v-model="orderNumber"
        label="订单号:"
        placeholder="请输入订单号"
        clearable
      />
      <van-field
        readonly
        label="来源渠道:"
        :model-value="selectedSource"
        is-link
        @click="showSourcePicker = true"
      />
    </div>

    <!-- 工单状态标签 -->
    <van-tabs v-model:active="activeTab" class="order-tabs" @change="handleTabChange">
      <van-tab title="全部工单" name="all" />
      <van-tab title="处罚单" name="penalty" />
      <van-tab title="待处理" name="pending" />
      <van-tab title="待送达" name="delivering" />
      <van-tab title="平台催单" name="platform" />
    </van-tabs>

    <!-- 工单列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了！"
        @load="onLoad"
      >
        <div class="empty-state" v-if="orderList.length === 0">
          <div class="empty-icon">
            <img src="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png" alt="" />
          </div>
          <p>没有更多了！</p>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 0">
      <van-button plain type="primary" size="small" @click="handlePrevPage" :disabled="currentPage === 1">
        上一页
      </van-button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <van-button plain type="primary" size="small" @click="handleNextPage" :disabled="currentPage >= totalPages">
        下一页
      </van-button>
    </div>

    <!-- 日期选择器 -->
    <van-calendar
      v-model:show="showDatePicker"
      type="range"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onDateConfirm"
    />

    <!-- 来源渠道选择 -->
    <van-popup v-model:show="showSourcePicker" position="bottom" round>
      <van-picker
        :columns="sourceOptions"
        @confirm="onSourceConfirm"
        @cancel="showSourcePicker = false"
      />
    </van-popup>

    <!-- 底部导航 -->
    <tabbar />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Tabbar from '@/components/Tabbar.vue'

const router = useRouter()

const activeTab = ref('all')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(true)
const showDatePicker = ref(false)
const showSourcePicker = ref(false)
const orderNumber = ref('')
const selectedSource = ref('自定义搜索')
const currentPage = ref(1)
const totalPages = ref(0)

const orderList = ref([])

const dateRange = reactive({
  start: '2026-01-29 00:00:00',
  end: '2026-02-28 23:59:59'
})

// 来源渠道选项
const sourceOptions = [
  '自定义搜索',
  '微信小程序',
  '公众号',
  '电话',
  '支付宝'
]

const minDate = new Date(2020, 0, 1)
const maxDate = new Date(2030, 11, 31)

const onLoad = () => {
  loading.value = false
}

const onRefresh = () => {
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}

const handleTabChange = (name) => {
  console.log('切换标签:', name)
  orderList.value = []
  currentPage.value = 1
}

const onDateConfirm = (values) => {
  const [start, end] = values
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  dateRange.start = `${formatDate(start)} 00:00:00`
  dateRange.end = `${formatDate(end)} 23:59:59`
  showDatePicker.value = false
}

const onSourceConfirm = ({ selectedValues }) => {
  selectedSource.value = selectedValues[0]
  showSourcePicker.value = false
}

const handlePrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<style lang="scss" scoped>
.order-feedback-page {
  background: #F5F5F5;
  min-height: 100vh;
}

// 导航栏样式
:deep(.van-nav-bar) {
  .van-nav-bar__arrow,
  .van-icon-arrow-left {
    color: #323233 !important; // 返回箭头颜色与标题一致
    font-size: 18px;
  }

  .van-nav-bar__title {
    color: #323233;
    font-weight: 500;
    font-size: 16px;
  }
}

.filter-bar {
  background: white;
  padding: 8px 16px;
  margin-bottom: 8px;

  .custom-search-text {
    color: #4E8EF7;
    font-size: 14px;
  }

  :deep(.van-field) {
    padding: 10px 0;
  }

  :deep(.van-field__label) {
    color: #333;
    font-size: 14px;
  }

  :deep(.van-field__control) {
    color: #666;
    font-size: 14px;
  }
}

.order-tabs {
  background: white;
  margin-bottom: 8px;

  :deep(.van-tab) {
    font-size: 14px;
    color: #666;
    padding: 0 12px;
  }

  :deep(.van-tab--active) {
    color: #4E8EF7;
    font-weight: 500;
  }

  :deep(.van-tabs__line) {
    background: #4E8EF7;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;

  .empty-icon {
    width: 160px;
    height: 160px;
    margin-bottom: 16px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  p {
    color: #999;
    font-size: 14px;
    margin: 0;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  background: white;
  margin-top: 8px;

  .page-info {
    font-size: 14px;
    color: #666;
    min-width: 60px;
    text-align: center;
  }

  :deep(.van-button) {
    min-width: 70px;
  }
}

:deep(.van-pull-refresh) {
  min-height: calc(100vh - 300px);
}

:deep(.van-list) {
  background: white;
}
</style>
