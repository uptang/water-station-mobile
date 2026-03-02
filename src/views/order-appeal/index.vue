<template>
  <div class="order-appeal-page page">
    <van-nav-bar title="工单申诉列表" left-arrow @click-left="router.back()" fixed placeholder />

    <!-- 筛选标签 -->
    <van-tabs v-model:active="activeStatus" @change="handleStatusChange">
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="待处理" name="pending"></van-tab>
      <van-tab title="已通过" name="approved"></van-tab>
      <van-tab title="已拒绝" name="rejected"></van-tab>
    </van-tabs>

    <!-- 搜索栏 -->
    <div class="search-section">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索订单号、申诉原因"
        @search="handleSearch"
      >
        <template #action>
          <van-button size="small" type="primary" @click="handleSearch">搜索</van-button>
        </template>
      </van-search>
    </div>

    <!-- 申诉列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="appeal in appealList"
          :key="appeal.id"
          class="appeal-card"
        >
          <div class="appeal-header">
            <div class="header-left">
              <span class="order-no">订单号：{{ appeal.orderNo }}</span>
              <van-tag :type="getStatusType(appeal.status)">{{ appeal.statusText }}</van-tag>
            </div>
            <div class="appeal-time">{{ appeal.createTime }}</div>
          </div>

          <div class="appeal-info">
            <div class="info-row">
              <span class="label">申诉类型：</span>
              <span class="value">{{ appeal.type }}</span>
            </div>
            <div class="info-row">
              <span class="label">申诉原因：</span>
              <span class="value">{{ appeal.reason }}</span>
            </div>
            <div class="info-row" v-if="appeal.description">
              <span class="label">详细说明：</span>
              <span class="value">{{ appeal.description }}</span>
            </div>
          </div>

          <!-- 图片证据 -->
          <div class="appeal-images" v-if="appeal.images && appeal.images.length">
            <div class="images-label">图片证据：</div>
            <div class="images-grid">
              <van-image
                v-for="(img, index) in appeal.images"
                :key="index"
                :src="img"
                width="80"
                height="80"
                fit="cover"
                @click="previewImage(appeal.images, index)"
              />
            </div>
          </div>

          <!-- 处理结果 -->
          <div class="appeal-result" v-if="appeal.status !== 'pending'">
            <div class="result-row">
              <span class="label">处理时间：</span>
              <span class="value">{{ appeal.handleTime }}</span>
            </div>
            <div class="result-row" v-if="appeal.handleRemark">
              <span class="label">处理意见：</span>
              <span class="value">{{ appeal.handleRemark }}</span>
            </div>
          </div>

          <div class="appeal-footer">
            <van-button
              v-if="appeal.status === 'pending'"
              size="small"
              type="danger"
              plain
              @click="cancelAppeal(appeal)"
            >
              撤销申诉
            </van-button>
            <van-button
              size="small"
              plain
              @click="viewDetail(appeal)"
            >
              查看详情
            </van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog, showImagePreview } from 'vant'

const router = useRouter()

const activeStatus = ref('all')
const searchKeyword = ref('')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const appealList = ref([])

// 模拟申诉数据
const mockAppeals = [
  {
    id: '1',
    orderNo: '400447028470919304040',
    type: '配送问题',
    reason: '配送超时',
    description: '订单在约定时间内未送达，客户多次催促，影响客户体验',
    images: [],
    status: 'pending',
    statusText: '待处理',
    createTime: '2026-01-03 14:30',
    handleTime: '',
    handleRemark: ''
  },
  {
    id: '2',
    orderNo: '400447028470919304041',
    type: '平台问题',
    reason: '系统错误扣款',
    description: '系统重复扣除配送费用，请核实处理',
    images: [],
    status: 'approved',
    statusText: '已通过',
    createTime: '2026-01-02 10:20',
    handleTime: '2026-01-02 16:45',
    handleRemark: '经核实确认系统错误，已退还重复扣款金额'
  },
  {
    id: '3',
    orderNo: '400447028470919304042',
    type: '处罚问题',
    reason: '误判超时',
    description: '客户要求延迟配送，但系统仍然判定超时并扣款',
    images: [],
    status: 'rejected',
    statusText: '已拒绝',
    createTime: '2026-01-01 09:15',
    handleTime: '2026-01-01 18:30',
    handleRemark: '经查订单记录，未发现客户延迟配送请求，判定合理'
  }
]

// 加载申诉列表
const onLoad = () => {
  setTimeout(() => {
    appealList.value = [...mockAppeals]
    loading.value = false
    finished.value = true
  }, 500)
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  appealList.value = []
  onLoad()
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

// 状态切换
const handleStatusChange = () => {
  appealList.value = []
  finished.value = false
  onLoad()
}

// 搜索
const handleSearch = () => {
  if (!searchKeyword.value) {
    showToast('请输入搜索关键词')
    return
  }
  showToast('搜索功能开发中')
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'default'
}

// 预览图片
const previewImage = (images, index) => {
  showImagePreview({
    images,
    startPosition: index,
  })
}

// 撤销申诉
const cancelAppeal = (appeal) => {
  showConfirmDialog({
    title: '提示',
    message: '确定要撤销此申诉吗？',
  })
    .then(() => {
      showToast('撤销成功')
      onRefresh()
    })
    .catch(() => {
      // 用户取消
    })
}

// 查看详情
const viewDetail = (appeal) => {
  router.push(`/order-detail/${appeal.orderNo}`)
}
</script>

<style lang="scss" scoped>
.order-appeal-page {
  background: #f5f5f5;
  min-height: 100vh;

  // 导航栏样式
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

  // Tab标签样式
  :deep(.van-tabs) {
    background: white;
    margin-bottom: 0;

    .van-tab {
      font-size: 15px;
      color: #666;
    }

    .van-tab--active {
      color: #4E8EF7;
      font-weight: 500;
    }

    .van-tabs__line {
      background: #4E8EF7;
      width: 30px;
    }
  }
}

.search-section {
  background: white;
  padding: 12px 16px;
  margin-bottom: 8px;

  :deep(.van-search) {
    padding: 0;

    .van-search__content {
      background: #f5f5f5;
    }
  }
}

.appeal-card {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .appeal-header {
    margin-bottom: 12px;

    .header-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .order-no {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }
    }

    .appeal-time {
      font-size: 12px;
      color: #999;
    }
  }

  .appeal-info {
    padding: 12px 0;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 12px;

    .info-row {
      display: flex;
      margin-bottom: 8px;
      font-size: 13px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #999;
        min-width: 80px;
        flex-shrink: 0;
      }

      .value {
        color: #333;
        flex: 1;
      }
    }
  }

  .appeal-images {
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 12px;

    .images-label {
      font-size: 13px;
      color: #999;
      margin-bottom: 8px;
    }

    .images-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;

      .van-image {
        border-radius: 8px;
      }
    }
  }

  .appeal-result {
    padding: 12px;
    background: #f7f8fa;
    border-radius: 8px;
    margin-bottom: 12px;

    .result-row {
      display: flex;
      margin-bottom: 8px;
      font-size: 13px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #999;
        min-width: 80px;
        flex-shrink: 0;
      }

      .value {
        color: #333;
        flex: 1;
      }
    }
  }

  .appeal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>
