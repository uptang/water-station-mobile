<template>
  <div class="order-timeout-page page">
    <van-nav-bar
      title="即将超时订单"
      left-arrow
      fixed
      placeholder
      @click-left="router.back()"
    />

    <!-- 超时提醒区域 -->
    <div class="timeout-alert-banner">
      <van-icon name="warning-o" color="#FF8C00" size="24" />
      <div class="alert-content">
        <div class="alert-title">即将超时订单提醒</div>
        <div class="alert-desc">以下订单即将超时，请尽快处理！</div>
      </div>
    </div>

    <!-- 订单列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="order in orderList"
          :key="order.id"
          class="order-card"
          @click="goOrderDetail(order.id)"
        >
          <!-- 订单头部 -->
          <div class="order-header">
            <span class="order-no">订单号：{{ order.orderNo }}</span>
            <van-tag type="danger">即将超时</van-tag>
          </div>

          <!-- 倒计时 -->
          <div class="timeout-countdown">
            <van-icon name="clock-o" />
            <span>剩余时间：</span>
            <van-count-down
              :time="order.remainingTime"
              format="HH:mm:ss"
              class="countdown-text"
            />
          </div>

          <!-- 订单信息 -->
          <div class="order-info">
            <div class="customer-info">
              <van-icon name="user-o" />
              <span>{{ order.customerName }} {{ order.phone }}</span>
            </div>
            <div class="address-info">
              <van-icon name="location-o" />
              <span>{{ order.address }}</span>
            </div>
            <div class="time-info">
              <van-icon name="clock-o" />
              <span>下单时间：{{ order.orderTime }}</span>
            </div>
            <div class="time-info">
              <van-icon name="clock-o" color="#FF8C00" />
              <span class="deadline">要求送达：{{ order.deliveryDeadline }}</span>
            </div>
          </div>

          <!-- 订单商品 -->
          <div class="order-products">
            <div class="product-item">
              <span>{{ order.productName }}</span>
              <span class="qty">×{{ order.qty }}</span>
            </div>
          </div>

          <!-- 订单底部 -->
          <div class="order-footer">
            <div class="order-amount">
              <span class="label">订单金额：</span>
              <span class="amount">¥{{ order.amount }}</span>
            </div>
            <div class="order-actions">
              <van-button
                v-if="order.status === 'pending'"
                size="small"
                type="primary"
                @click.stop="handleDispatch(order)"
              >
                立即派单
              </van-button>
              <van-button
                v-if="order.status === 'dispatched'"
                size="small"
                type="primary"
                @click.stop="handleUrge(order)"
              >
                催促配送
              </van-button>
              <van-button size="small" plain @click.stop="goOrderDetail(order.id)">
                查看详情
              </van-button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && orderList.length === 0" class="empty-state">
          <div class="empty-icon">🎉</div>
          <p>太棒了！暂无即将超时的订单</p>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 派单弹窗 -->
    <van-dialog
      v-model:show="showDispatchDialog"
      title="立即派单"
      show-cancel-button
      @confirm="confirmDispatch"
    >
      <div class="dispatch-form">
        <van-field
          v-model="dispatchForm.worker"
          label="配送员"
          placeholder="请选择配送员"
          readonly
          is-link
          @click="showWorkerPicker = true"
        />
        <van-field
          v-model="dispatchForm.remark"
          label="备注"
          type="textarea"
          placeholder="请输入备注信息（选填）"
          rows="2"
        />
      </div>
    </van-dialog>

    <!-- 配送员选择器 -->
    <van-popup v-model:show="showWorkerPicker" position="bottom">
      <van-picker
        :columns="workerList"
        @confirm="onWorkerConfirm"
        @cancel="showWorkerPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'

const router = useRouter()

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const orderList = ref([])
const showDispatchDialog = ref(false)
const showWorkerPicker = ref(false)
const currentOrder = ref(null)

// 派单表单
const dispatchForm = reactive({
  worker: '',
  remark: ''
})

// 配送员列表
const workerList = [
  '张三 - 13800138000',
  '李四 - 13900139000',
  '王五 - 13700137000',
  '赵六 - 13600136000'
]

// 模拟即将超时的订单数据
const mockTimeoutOrders = [
  {
    id: '1',
    orderNo: '400447028470919304050',
    customerName: '王先生',
    phone: '13712345678',
    address: '江苏省扬州市广陵区文昌中路某某小区3号楼201',
    productName: '怡宝 饮用纯净水6L×3桶/箱',
    qty: 2,
    amount: '36.00',
    orderTime: '2026-01-03 08:15:22',
    deliveryDeadline: '2026-01-03 12:00:00',
    remainingTime: 45 * 60 * 1000, // 剩余45分钟
    status: 'pending'
  },
  {
    id: '2',
    orderNo: '400447028470919304051',
    customerName: '李女士',
    phone: '13898765432',
    address: '江苏省扬州市邗江区兴城西路某某花园5栋302',
    productName: '农夫山泉 饮用天然水4L×6桶/箱',
    qty: 1,
    amount: '48.00',
    orderTime: '2026-01-03 09:00:00',
    deliveryDeadline: '2026-01-03 13:00:00',
    remainingTime: 30 * 60 * 1000, // 剩余30分钟
    status: 'dispatched'
  },
  {
    id: '3',
    orderNo: '400447028470919304052',
    customerName: '张先生',
    phone: '13656781234',
    address: '江苏省扬州市广陵区东关街某某巷12号',
    productName: '景田 百岁山饮用水5L×4桶/箱',
    qty: 3,
    amount: '72.00',
    orderTime: '2026-01-03 09:30:00',
    deliveryDeadline: '2026-01-03 14:00:00',
    remainingTime: 55 * 60 * 1000, // 剩余55分钟
    status: 'pending'
  }
]

// 加载订单列表
const onLoad = () => {
  setTimeout(() => {
    orderList.value = [...mockTimeoutOrders]
    loading.value = false
    finished.value = true
  }, 500)
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  orderList.value = []
  onLoad()
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

// 派单
const handleDispatch = (order) => {
  currentOrder.value = order
  dispatchForm.worker = ''
  dispatchForm.remark = ''
  showDispatchDialog.value = true
}

// 催促配送
const handleUrge = (order) => {
  showToast('已向配送员发送催促通知')
}

// 配送员选择确认
const onWorkerConfirm = ({ selectedValues }) => {
  dispatchForm.worker = selectedValues[0]
  showWorkerPicker.value = false
}

// 确认派单
const confirmDispatch = () => {
  if (!dispatchForm.worker) {
    showToast('请选择配送员')
    return false
  }

  // 更新订单状态
  const order = orderList.value.find(o => o.id === currentOrder.value.id)
  if (order) {
    order.status = 'dispatched'
  }

  showSuccessToast('派单成功')
  showDispatchDialog.value = false
  return true
}

// 查看订单详情
const goOrderDetail = (id) => {
  router.push(`/order-detail/${id}`)
}
</script>

<style lang="scss" scoped>
.order-timeout-page {
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

// 超时提醒横幅
.timeout-alert-banner {
  background: linear-gradient(135deg, #FFF4E6 0%, #FFE8CC 100%);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(255, 140, 0, 0.15);

  .alert-content {
    flex: 1;

    .alert-title {
      font-size: 16px;
      font-weight: 500;
      color: #FF8C00;
      margin-bottom: 4px;
    }

    .alert-desc {
      font-size: 13px;
      color: #999;
    }
  }
}

.order-card {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #FF8C00;
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 12px;

    .order-no {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }

  .timeout-countdown {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 12px;
    background: #FFF4E6;
    border-radius: 8px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #FF8C00;

    .van-icon {
      font-size: 18px;
    }

    .countdown-text {
      font-weight: bold;
      color: #FF3B30;
      font-size: 16px;
    }
  }

  .order-info {
    margin-bottom: 12px;

    > div {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #666;

      &:last-child {
        margin-bottom: 0;
      }

      .van-icon {
        color: #999;
        font-size: 16px;
      }

      &.time-info .deadline {
        color: #FF8C00;
        font-weight: 500;
      }
    }
  }

  .order-products {
    padding: 12px 0;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 12px;

    .product-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #333;

      .qty {
        color: #999;
      }
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .order-amount {
      .label {
        font-size: 13px;
        color: #666;
      }

      .amount {
        font-size: 18px;
        font-weight: bold;
        color: #FF3B30;
        margin-left: 4px;
      }
    }

    .order-actions {
      display: flex;
      gap: 8px;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.8;
  }

  p {
    color: #09BB07;
    font-size: 15px;
    font-weight: 500;
    margin: 0;
  }
}

// 派单表单样式
.dispatch-form {
  padding: 20px 16px;

  :deep(.van-field) {
    margin-bottom: 12px;
  }

  :deep(.van-field__label) {
    width: 80px;
  }
}
</style>
