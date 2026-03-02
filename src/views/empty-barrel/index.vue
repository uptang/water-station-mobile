<template>
  <div class="empty-barrel-page page">
    <van-nav-bar title="空桶库存" left-arrow fixed placeholder @click-left="router.back()" />

    <!-- 顶部统计卡片 -->
    <div class="barrel-summary">
      <div class="summary-item">
        <div class="label">总空桶数</div>
        <div class="value primary">{{ totalBarrels }}</div>
      </div>
      <div class="summary-item">
        <div class="label">可用空桶</div>
        <div class="value success">{{ availableBarrels }}</div>
      </div>
      <div class="summary-item">
        <div class="label">损坏空桶</div>
        <div class="value danger">{{ damagedBarrels }}</div>
      </div>
    </div>

    <!-- 空桶列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="barrel in barrelList"
          :key="barrel.id"
          class="barrel-card"
        >
          <div class="barrel-header">
            <div class="barrel-title">
              <van-icon name="shopping-cart-o" size="20" color="#4E8EF7" />
              <span>{{ barrel.barrelType }}</span>
            </div>
            <van-tag :type="barrel.status === '可用' ? 'success' : 'danger'">
              {{ barrel.status }}
            </van-tag>
          </div>

          <div class="barrel-info">
            <div class="info-row">
              <span class="label">所在仓库：</span>
              <span class="value">{{ barrel.warehouseName }}</span>
            </div>
            <div class="info-row">
              <span class="label">空桶数量：</span>
              <span class="value highlight">{{ barrel.quantity }}个</span>
            </div>
            <div class="info-row">
              <span class="label">规格：</span>
              <span class="value">{{ barrel.spec }}</span>
            </div>
            <div class="info-row" v-if="barrel.lastUpdateTime">
              <span class="label">更新时间：</span>
              <span class="value">{{ barrel.lastUpdateTime }}</span>
            </div>
            <div class="info-row" v-if="barrel.remark">
              <span class="label">备注：</span>
              <span class="value">{{ barrel.remark }}</span>
            </div>
          </div>

          <div class="barrel-actions">
            <van-button size="small" plain @click="handleAdjust(barrel)">
              调整库存
            </van-button>
            <van-button size="small" plain @click="handleRecord(barrel)">
              出入记录
            </van-button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && barrelList.length === 0" class="empty-state">
          <van-empty description="暂无空桶库存" />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const barrelList = ref([])

// 模拟空桶库存数据
const mockBarrelList = [
  {
    id: '1',
    barrelType: '怡宝 6L空桶',
    spec: '6L',
    status: '可用',
    warehouseName: '总仓库',
    quantity: 156,
    lastUpdateTime: '2026-03-02 14:30:00',
    remark: ''
  },
  {
    id: '2',
    barrelType: '农夫山泉 4L空桶',
    spec: '4L',
    status: '可用',
    warehouseName: '总仓库',
    quantity: 89,
    lastUpdateTime: '2026-03-02 10:20:00',
    remark: ''
  },
  {
    id: '3',
    barrelType: '景田 5L空桶',
    spec: '5L',
    status: '可用',
    warehouseName: '分仓库-邗江',
    quantity: 45,
    lastUpdateTime: '2026-03-01 16:15:00',
    remark: ''
  },
  {
    id: '4',
    barrelType: '娃哈哈 5L空桶',
    spec: '5L',
    status: '损坏',
    warehouseName: '总仓库',
    quantity: 8,
    lastUpdateTime: '2026-02-28 11:00:00',
    remark: '需要清洗维修'
  }
]

const totalBarrels = computed(() => {
  return barrelList.value.reduce((sum, item) => sum + item.quantity, 0)
})

const availableBarrels = computed(() => {
  return barrelList.value
    .filter(item => item.status === '可用')
    .reduce((sum, item) => sum + item.quantity, 0)
})

const damagedBarrels = computed(() => {
  return barrelList.value
    .filter(item => item.status === '损坏')
    .reduce((sum, item) => sum + item.quantity, 0)
})

const onLoad = () => {
  setTimeout(() => {
    barrelList.value = [...mockBarrelList]
    loading.value = false
    finished.value = true
  }, 500)
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  barrelList.value = []
  onLoad()
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

const handleAdjust = (barrel) => {
  showToast('调整库存功能开发中')
}

const handleRecord = (barrel) => {
  showToast('出入记录功能开发中')
}
</script>

<style lang="scss" scoped>
.empty-barrel-page {
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

.barrel-summary {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .summary-item {
    text-align: center;

    .label {
      font-size: 13px;
      color: #999;
      margin-bottom: 8px;
    }

    .value {
      font-size: 24px;
      font-weight: bold;

      &.primary {
        color: #4E8EF7;
      }

      &.success {
        color: #09BB07;
      }

      &.danger {
        color: #FF3B30;
      }
    }
  }
}

.barrel-card {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #4E8EF7;

  .barrel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 12px;

    .barrel-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      color: #333;
      font-weight: 500;
    }
  }

  .barrel-info {
    .info-row {
      display: flex;
      padding: 6px 0;
      font-size: 14px;

      .label {
        color: #999;
        min-width: 80px;
      }

      .value {
        color: #333;
        flex: 1;

        &.highlight {
          color: #4E8EF7;
          font-weight: 500;
          font-size: 16px;
        }
      }
    }
  }

  .barrel-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f5f5f5;
  }
}

.empty-state {
  padding: 60px 20px;
}
</style>
