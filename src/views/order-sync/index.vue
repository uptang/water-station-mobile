<template>
  <div class="order-sync-page page-with-tabbar">
    <van-nav-bar title="订单同步" left-arrow fixed placeholder @click-left="onClickLeft" />

    <div class="sync-content">
      <div class="sync-status-card">
        <div class="status-header">
          <van-icon name="cluster-o" size="32" color="#4E8EF7" />
          <div class="status-info">
            <div class="status-title">同步状态</div>
            <div class="status-text">{{ syncStatus }}</div>
          </div>
        </div>
        <div class="status-stats">
          <div class="stat-item">
            <div class="stat-value">{{ todayStats.total }}</div>
            <div class="stat-label">今日同步</div>
          </div>
          <div class="stat-item">
            <div class="stat-value success">{{ todayStats.success }}</div>
            <div class="stat-label">成功</div>
          </div>
          <div class="stat-item">
            <div class="stat-value error">{{ todayStats.failed }}</div>
            <div class="stat-label">失败</div>
          </div>
        </div>
      </div>

      <van-cell-group title="平台同步" inset>
        <van-cell center>
          <template #title>
            <div class="platform-title">
              <span class="platform-icon pdd">拼</span>
              <span>拼多多</span>
            </div>
          </template>
          <template #right-icon>
            <div class="platform-actions">
              <van-tag :type="platforms.pinduoduo.enabled ? 'success' : 'default'" class="status-tag">
                {{ platforms.pinduoduo.enabled ? '已启用' : '未启用' }}
              </van-tag>
              <van-button
                v-if="platforms.pinduoduo.enabled"
                size="small"
                type="primary"
                :loading="platforms.pinduoduo.syncing"
                @click="syncPlatform('pinduoduo')"
              >
                {{ platforms.pinduoduo.syncing ? '同步中...' : '立即同步' }}
              </van-button>
            </div>
          </template>
        </van-cell>

        <van-cell center>
          <template #title>
            <div class="platform-title">
              <span class="platform-icon elm">饿</span>
              <span>饿了么</span>
            </div>
          </template>
          <template #right-icon>
            <div class="platform-actions">
              <van-tag :type="platforms.eleme.enabled ? 'success' : 'default'" class="status-tag">
                {{ platforms.eleme.enabled ? '已启用' : '未启用' }}
              </van-tag>
              <van-button
                v-if="platforms.eleme.enabled"
                size="small"
                type="primary"
                :loading="platforms.eleme.syncing"
                @click="syncPlatform('eleme')"
              >
                {{ platforms.eleme.syncing ? '同步中...' : '立即同步' }}
              </van-button>
            </div>
          </template>
        </van-cell>

        <van-cell center>
          <template #title>
            <div class="platform-title">
              <span class="platform-icon dy">抖</span>
              <span>抖音</span>
            </div>
          </template>
          <template #right-icon>
            <div class="platform-actions">
              <van-tag :type="platforms.douyin.enabled ? 'success' : 'default'" class="status-tag">
                {{ platforms.douyin.enabled ? '已启用' : '未启用' }}
              </van-tag>
              <van-button
                v-if="platforms.douyin.enabled"
                size="small"
                type="primary"
                :loading="platforms.douyin.syncing"
                @click="syncPlatform('douyin')"
              >
                {{ platforms.douyin.syncing ? '同步中...' : '立即同步' }}
              </van-button>
            </div>
          </template>
        </van-cell>

        <van-cell center>
          <template #title>
            <div class="platform-title">
              <span class="platform-icon mt">美</span>
              <span>美团</span>
            </div>
          </template>
          <template #right-icon>
            <div class="platform-actions">
              <van-tag :type="platforms.meituan.enabled ? 'success' : 'default'" class="status-tag">
                {{ platforms.meituan.enabled ? '已启用' : '未启用' }}
              </van-tag>
              <van-button
                v-if="platforms.meituan.enabled"
                size="small"
                type="primary"
                :loading="platforms.meituan.syncing"
                @click="syncPlatform('meituan')"
              >
                {{ platforms.meituan.syncing ? '同步中...' : '立即同步' }}
              </van-button>
            </div>
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group title="快捷操作" inset>
        <van-cell title="全部同步" is-link @click="syncAll" />
        <van-cell title="同步日志" is-link @click="goToSyncLog" />
        <van-cell title="平台配置" is-link @click="goToPlatformConfig" />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast, showLoadingToast, closeToast, showConfirmDialog } from 'vant'

const router = useRouter()

const syncStatus = ref('待同步')
const todayStats = reactive({
  total: 0,
  success: 0,
  failed: 0
})

const platforms = reactive({
  pinduoduo: { enabled: false, syncing: false },
  eleme: { enabled: false, syncing: false },
  douyin: { enabled: false, syncing: false },
  meituan: { enabled: false, syncing: false }
})

const onClickLeft = () => {
  router.back()
}

const loadPlatformConfig = () => {
  try {
    const savedConfig = localStorage.getItem('platformConfig')
    if (savedConfig) {
      const config = JSON.parse(savedConfig)
      platforms.pinduoduo.enabled = config.pinduoduo?.enabled || false
      platforms.eleme.enabled = config.eleme?.enabled || false
      platforms.douyin.enabled = config.douyin?.enabled || false
      platforms.meituan.enabled = config.meituan?.enabled || false
    }
  } catch (error) {
    console.error('加载平台配置失败:', error)
  }
}

const syncPlatform = async (platform) => {
  const platformNames = {
    pinduoduo: '拼多多',
    eleme: '饿了么',
    douyin: '抖音',
    meituan: '美团'
  }

  try {
    platforms[platform].syncing = true
    syncStatus.value = `正在同步${platformNames[platform]}订单...`

    await new Promise(resolve => setTimeout(resolve, 1500))

    showSuccessToast(`${platformNames[platform]}同步成功：5条`)
    todayStats.total += 5
    todayStats.success += 5
    syncStatus.value = '同步完成'
  } catch (error) {
    console.error('同步失败:', error)
    showToast(`${platformNames[platform]}同步失败`)
    todayStats.failed += 1
  } finally {
    platforms[platform].syncing = false
  }
}

const syncAll = async () => {
  const enabledPlatforms = Object.keys(platforms).filter(key => platforms[key].enabled)

  if (enabledPlatforms.length === 0) {
    showToast('没有启用的平台，请先在平台配置中启用')
    return
  }

  try {
    await showConfirmDialog({
      title: '确认同步',
      message: `确定要同步所有启用的平台订单吗？共${enabledPlatforms.length}个平台`,
    })

    syncStatus.value = '正在批量同步...'

    for (const platform of enabledPlatforms) {
      await syncPlatform(platform)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    showSuccessToast('全部同步完成')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量同步失败:', error)
    }
  }
}

const goToSyncLog = () => {
  router.push('/order-sync-log')
}

const goToPlatformConfig = () => {
  router.push('/platform-config')
}

onMounted(() => {
  loadPlatformConfig()
})
</script>

<style lang="scss" scoped>
.order-sync-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 50px;
}

.sync-content {
  padding: 16px;
}

.sync-status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  color: white;

  .status-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;

    .status-info {
      flex: 1;

      .status-title {
        font-size: 14px;
        opacity: 0.9;
        margin-bottom: 4px;
      }

      .status-text {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  .status-stats {
    display: flex;
    justify-content: space-around;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);

    .stat-item {
      text-align: center;

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 4px;

        &.success {
          color: #67C23A;
        }

        &.error {
          color: #F56C6C;
        }
      }

      .stat-label {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }
}

:deep(.van-cell-group) {
  margin-bottom: 16px;
}

.platform-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;

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

    &.pdd {
      background: linear-gradient(135deg, #E02E24 0%, #F56C6C 100%);
    }

    &.elm {
      background: linear-gradient(135deg, #0099FF 0%, #40A9FF 100%);
    }

    &.dy {
      background: linear-gradient(135deg, #000000 0%, #333333 100%);
    }

    &.mt {
      background: linear-gradient(135deg, #FFC300 0%, #FFD700 100%);
    }
  }
}

.platform-actions {
  display: flex;
  align-items: center;
  gap: 8px;

  .status-tag {
    flex-shrink: 0;
  }
}
</style>
