<template>
  <div class="order-sync-log-page page-with-tabbar">
    <van-nav-bar title="同步日志" left-arrow fixed placeholder @click-left="onClickLeft" />

    <div class="filter-bar">
      <van-dropdown-menu>
        <van-dropdown-item v-model="filterPlatform" :options="platformOptions" @change="loadLogs" />
        <van-dropdown-item v-model="filterStatus" :options="statusOptions" @change="loadLogs" />
      </van-dropdown-menu>
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div v-for="log in logList" :key="log.id" class="log-card">
          <div class="log-header">
            <div class="platform-info">
              <span class="platform-icon" :class="log.platform">{{ getPlatformShortName(log.platform) }}</span>
              <span class="platform-name">{{ getPlatformName(log.platform) }}</span>
            </div>
            <van-tag :type="getStatusType(log.status)">
              {{ log.status === 'success' ? '成功' : '失败' }}
            </van-tag>
          </div>

          <div class="log-info">
            <div class="info-row">
              <span class="label">同步时间：</span>
              <span class="value">{{ log.syncTime }}</span>
            </div>
            <div class="info-row">
              <span class="label">同步数量：</span>
              <span class="value">{{ log.orderCount }}条</span>
            </div>
            <div class="info-row">
              <span class="label">成功：</span>
              <span class="value success">{{ log.successCount }}条</span>
            </div>
            <div class="info-row">
              <span class="label">失败：</span>
              <span class="value error">{{ log.failCount }}条</span>
            </div>
            <div v-if="log.status === 'failed'" class="info-row">
              <span class="label">失败原因：</span>
              <span class="value error">{{ log.errorMessage }}</span>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const filterPlatform = ref('all')
const filterStatus = ref('all')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const logList = ref([])

const platformOptions = [
  { text: '全部平台', value: 'all' },
  { text: '拼多多', value: 'pinduoduo' },
  { text: '饿了么', value: 'eleme' },
  { text: '抖音', value: 'douyin' },
  { text: '美团', value: 'meituan' }
]

const statusOptions = [
  { text: '全部状态', value: 'all' },
  { text: '成功', value: 'success' },
  { text: '失败', value: 'failed' }
]

const mockLogs = [
  {
    id: '1',
    platform: 'pinduoduo',
    syncTime: '2025-03-04 14:30:25',
    status: 'success',
    orderCount: 15,
    successCount: 15,
    failCount: 0,
    errorMessage: ''
  },
  {
    id: '2',
    platform: 'eleme',
    syncTime: '2025-03-04 14:25:10',
    status: 'failed',
    orderCount: 8,
    successCount: 5,
    failCount: 3,
    errorMessage: 'Token已过期，请重新授权'
  },
  {
    id: '3',
    platform: 'douyin',
    syncTime: '2025-03-04 14:20:05',
    status: 'success',
    orderCount: 12,
    successCount: 12,
    failCount: 0,
    errorMessage: ''
  },
  {
    id: '4',
    platform: 'meituan',
    syncTime: '2025-03-04 14:15:30',
    status: 'success',
    orderCount: 20,
    successCount: 20,
    failCount: 0,
    errorMessage: ''
  }
]

const onClickLeft = () => {
  router.back()
}

const getPlatformName = (platform) => {
  const names = {
    pinduoduo: '拼多多',
    eleme: '饿了么',
    douyin: '抖音',
    meituan: '美团'
  }
  return names[platform] || platform
}

const getPlatformShortName = (platform) => {
  const names = {
    pinduoduo: '拼',
    eleme: '饿',
    douyin: '抖',
    meituan: '美'
  }
  return names[platform] || '?'
}

const getStatusType = (status) => {
  return status === 'success' ? 'success' : 'danger'
}

const loadLogs = async () => {
  try {
    loading.value = true

    setTimeout(() => {
      let filteredLogs = mockLogs

      if (filterPlatform.value !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.platform === filterPlatform.value)
      }

      if (filterStatus.value !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.status === filterStatus.value)
      }

      logList.value = filteredLogs
      loading.value = false
      finished.value = true
    }, 500)
  } catch (error) {
    console.error('加载日志失败:', error)
    showToast('加载失败')
    loading.value = false
  }
}

const onRefresh = () => {
  finished.value = false
  loadLogs().then(() => {
    refreshing.value = false
  })
}

const onLoad = () => {
  loadLogs()
}

onMounted(() => {
  loadLogs()
})
</script>

<style lang="scss" scoped>
.order-sync-log-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 50px;
}

.filter-bar {
  position: sticky;
  top: 46px;
  z-index: 10;
  background: white;
}

.log-card {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .platform-info {
      display: flex;
      align-items: center;
      gap: 8px;

      .platform-icon {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;

        &.pinduoduo {
          background: linear-gradient(135deg, #E02E24 0%, #F56C6C 100%);
        }

        &.eleme {
          background: linear-gradient(135deg, #0099FF 0%, #40A9FF 100%);
        }

        &.douyin {
          background: linear-gradient(135deg, #000000 0%, #333333 100%);
        }

        &.meituan {
          background: linear-gradient(135deg, #FFC300 0%, #FFD700 100%);
        }
      }

      .platform-name {
        font-weight: 500;
        color: #333;
      }
    }
  }

  .log-info {
    padding: 12px;
    background: #F7F8FA;
    border-radius: 8px;

    .info-row {
      display: flex;
      margin-bottom: 6px;
      font-size: 13px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #666;
        min-width: 70px;
      }

      .value {
        color: #333;
        flex: 1;

        &.success {
          color: #67C23A;
        }

        &.error {
          color: #F56C6C;
        }
      }
    }
  }
}
</style>
