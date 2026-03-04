<template>
  <div class="route-planning-page page">
    <van-nav-bar title="线路规划" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <!-- 地图显示区域 -->
      <div class="map-container">
        <div class="map-placeholder">
          <van-icon name="location-o" size="48" color="#999" />
          <p>地图显示区域</p>
        </div>
      </div>

      <!-- 配送员选择 -->
      <div class="worker-select-card">
        <van-cell title="配送员" is-link @click="showWorkerPicker = true">
          <template #value>
            <span :class="{ 'placeholder': !selectedWorker }">
              {{ selectedWorker || '请选择配送员' }}
            </span>
          </template>
        </van-cell>
      </div>

      <!-- 统计信息 -->
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-label">待配送订单</div>
          <div class="stat-value">{{ orderList.length }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">预计距离</div>
          <div class="stat-value">{{ totalDistance }}<span class="unit">km</span></div>
        </div>
        <div class="stat-item">
          <div class="stat-label">预计时长</div>
          <div class="stat-value">{{ totalDuration }}<span class="unit">分钟</span></div>
        </div>
      </div>

      <!-- 订单列表 -->
      <div class="orders-section">
        <div class="section-header">
          <span class="section-title">配送订单</span>
          <van-button plain type="primary" size="small" @click="handleOptimizeRoute">
            <van-icon name="exchange" />
            优化路线
          </van-button>
        </div>

        <van-checkbox-group v-model="checkedOrders">
          <div v-for="(order, index) in orderList" :key="order.id" class="order-item">
            <div class="order-header">
              <van-checkbox :name="order.id" />
              <div class="order-number">
                <span class="sequence">{{ index + 1 }}</span>
                <span class="order-id">订单号：{{ order.orderNo }}</span>
              </div>
              <van-icon name="bars" class="drag-icon" />
            </div>

            <div class="order-info">
              <div class="info-row">
                <van-icon name="user-o" size="14" />
                <span>{{ order.userName }}</span>
                <span class="phone">{{ order.phone }}</span>
              </div>
              <div class="info-row">
                <van-icon name="location-o" size="14" />
                <span>{{ order.address }}</span>
              </div>
              <div class="info-row">
                <van-icon name="shopping-cart-o" size="14" />
                <span>{{ order.productName }} × {{ order.quantity }}</span>
              </div>
            </div>

            <div class="order-footer">
              <div class="distance-info">
                <van-icon name="guide-o" size="12" />
                <span>距上一站 {{ order.distance }}km</span>
              </div>
              <div class="time-info">{{ order.deliveryTime }}</div>
            </div>
          </div>
        </van-checkbox-group>

        <div v-if="orderList.length === 0" class="empty-state">
          <van-empty description="暂无待配送订单" />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button block type="primary" :disabled="checkedOrders.length === 0" @click="handleStartDelivery">
          开始配送 ({{ checkedOrders.length }})
        </van-button>
      </div>
    </div>

    <!-- 配送员选择器 -->
    <van-popup v-model:show="showWorkerPicker" position="bottom" round>
      <van-picker
        :columns="workerOptions"
        @confirm="onWorkerConfirm"
        @cancel="showWorkerPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()

// 配送员选择
const showWorkerPicker = ref(false)
const selectedWorker = ref('')
const workerOptions = [
  { text: '张三', value: '1' },
  { text: '李四', value: '2' },
  { text: '王五', value: '3' }
]

// 已选订单
const checkedOrders = ref([])

// 模拟订单数据
const orderList = ref([
  {
    id: 1,
    orderNo: 'O202603050001',
    userName: '张先生',
    phone: '138****5678',
    address: '北京市朝阳区望京SOHO T1 1801',
    productName: '怡宝桶装水',
    quantity: 2,
    distance: 0,
    deliveryTime: '09:00-10:00'
  },
  {
    id: 2,
    orderNo: 'O202603050002',
    userName: '李女士',
    phone: '139****6789',
    address: '北京市朝阳区望京西园四区 5号楼 201',
    productName: '农夫山泉桶装水',
    quantity: 1,
    distance: 1.2,
    deliveryTime: '10:00-11:00'
  },
  {
    id: 3,
    orderNo: 'O202603050003',
    userName: '王先生',
    phone: '136****7890',
    address: '北京市朝阳区南湖东园 121号楼 302',
    productName: '怡宝桶装水',
    quantity: 3,
    distance: 2.5,
    deliveryTime: '11:00-12:00'
  }
])

// 计算总距离
const totalDistance = computed(() => {
  return orderList.value.reduce((total, order) => total + order.distance, 0).toFixed(1)
})

// 计算总时长
const totalDuration = computed(() => {
  // 简单估算：每公里3分钟 + 每单10分钟配送时间
  const travelTime = totalDistance.value * 3
  const deliveryTime = orderList.value.length * 10
  return Math.ceil(travelTime + deliveryTime)
})

// 配送员选择确认
const onWorkerConfirm = ({ selectedOptions }) => {
  selectedWorker.value = selectedOptions[0].text
  showWorkerPicker.value = false
  showToast(`已选择配送员：${selectedOptions[0].text}`)
}

// 优化路线
const handleOptimizeRoute = () => {
  showToast('正在优化路线...')
  // 模拟路线优化
  setTimeout(() => {
    // 这里可以调用路线优化算法
    showToast('路线优化完成')
  }, 1000)
}

// 开始配送
const handleStartDelivery = () => {
  if (!selectedWorker.value) {
    showToast('请先选择配送员')
    return
  }

  if (checkedOrders.value.length === 0) {
    showToast('请至少选择一个订单')
    return
  }

  showConfirmDialog({
    title: '确认开始配送',
    message: `配送员：${selectedWorker.value}\n订单数：${checkedOrders.value.length}个`,
  })
    .then(() => {
      showToast('配送任务已创建')
      setTimeout(() => {
        router.back()
      }, 1500)
    })
    .catch(() => {
      // 取消
    })
}
</script>

<style lang="scss" scoped>
.route-planning-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 80px;

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

// 地图容器
.map-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;

  .map-placeholder {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);

    p {
      margin-top: 12px;
      font-size: 14px;
      color: #999;
    }
  }
}

// 配送员选择卡片
.worker-select-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;

  :deep(.van-cell) {
    padding: 16px;

    .van-cell__title {
      font-size: 15px;
      color: #333;
      font-weight: 500;
    }

    .van-cell__value {
      font-size: 15px;
      color: #333;

      .placeholder {
        color: #999;
      }
    }
  }
}

// 统计卡片
.stats-card {
  display: flex;
  justify-content: space-around;
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  .stat-item {
    text-align: center;
    flex: 1;

    .stat-label {
      font-size: 13px;
      color: #666;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #4E8EF7;

      .unit {
        font-size: 12px;
        font-weight: normal;
        margin-left: 2px;
      }
    }
  }
}

// 订单部分
.orders-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0 12px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    :deep(.van-button) {
      height: 32px;
      padding: 0 12px;
      font-size: 13px;

      .van-icon {
        margin-right: 4px;
      }
    }
  }

  .order-item {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;

    .order-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
      margin-bottom: 12px;

      .order-number {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;

        .sequence {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: #4E8EF7;
          color: white;
          border-radius: 50%;
          font-size: 12px;
          font-weight: bold;
        }

        .order-id {
          font-size: 14px;
          color: #666;
        }
      }

      .drag-icon {
        color: #999;
        cursor: move;
      }
    }

    .order-info {
      .info-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 14px;
        color: #333;

        &:last-child {
          margin-bottom: 0;
        }

        .van-icon {
          color: #666;
        }

        .phone {
          margin-left: auto;
          color: #666;
        }
      }
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;

      .distance-info {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #999;

        .van-icon {
          color: #4E8EF7;
        }
      }

      .time-info {
        font-size: 12px;
        color: #4E8EF7;
        font-weight: 500;
      }
    }
  }

  .empty-state {
    padding: 60px 0;
  }
}

// 操作按钮
.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);

  :deep(.van-button) {
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 24px;
  }
}
</style>
