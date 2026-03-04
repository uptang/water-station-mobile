<template>
  <div class="my-delivery-page page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <van-icon name="arrow-left" size="24" @click="router.back()" />
        <van-icon name="wap-nav" size="24" />
      </div>
      <div class="nav-center">
        <span class="nav-title">订单</span>
      </div>
      <div class="nav-right">
        <van-icon name="description" size="20" />
        <van-icon name="bars" size="20" />
        <van-icon name="search" size="20" @click="showSearch = true" />
        <van-badge :content="messageCount" @click="router.push('/message')">
          <van-icon name="chat-o" size="20" />
        </van-badge>
      </div>
    </div>

    <!-- 状态标签 -->
    <div class="status-tabs">
      <van-tabs v-model:active="activeStatus" @change="onStatusChange">
        <van-tab title="告警中" name="alert" />
        <van-tab title="待取货" name="pending" />
        <van-tab title="配送中" name="delivering" />
        <van-tab title="优先送" name="priority" />
        <van-tab title="已送达" name="delivered" />
        <van-tab title="已核销" name="verified" />
      </van-tabs>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-item" @click="showTimePicker = true">
        <span>时间</span>
        <van-icon name="arrow-down" size="12" />
      </div>
      <div class="filter-item" @click="showChannelPicker = true">
        <span>渠道</span>
        <van-icon name="arrow-down" size="12" />
      </div>
      <div class="filter-item" @click="showKeywordPicker = true">
        <span>关键字</span>
        <van-icon name="arrow-down" size="12" />
      </div>
    </div>

    <!-- 分页和订单分布 -->
    <div class="pagination-bar">
      <div class="pagination-center">
        <span class="page-btn" @click="prevPage">上一页</span>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <span class="page-btn" @click="nextPage">下一页</span>
      </div>
      <van-button type="primary" size="small" round @click="showDistribution">
        订单分布
      </van-button>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="(order, index) in orderList"
            :key="index"
            class="order-card"
            @click="goToOrderDetail(order)"
          >
            <!-- 卡片顶部粉红色边框 -->
            <div class="card-top-border"></div>

            <!-- 右上角天标签 -->
            <div class="day-corner-tag">天</div>

            <!-- 最迟送达时间 - 带背景色 -->
            <div class="deadline-row">
              <span class="label-gray">最迟送达：</span>
              <span class="time-purple">{{ order.latestDeliveryTime }}</span>
            </div>

            <!-- 欠款信息 - 靠右 -->
            <div class="debt-row">
              <span>押{{ order.deposit }}</span>
              <span>欠{{ order.debt }}</span>
              <span>欠票:{{ order.debtTicket }}</span>
              <span>欠¥{{ order.debtAmount }}</span>
            </div>

            <!-- 百一先到 + 订单时间 - 不换行 -->
            <div class="time-section">
              <div class="priority-tag" v-if="order.priority">百一先到</div>
              <div class="order-datetime">{{ order.orderTime.replace('\n', ' ') }}</div>
            </div>

            <!-- 客户信息 -->
            <div class="customer-row">
              <span class="name">{{ order.customerName }}</span>
              <span class="phone">{{ order.customerPhone }}</span>
              <van-icon name="replay" size="18" color="#4E8EF7" @click.stop />
              <van-icon name="phone-o" size="18" color="#4E8EF7" @click.stop />
            </div>

            <!-- 地址 -->
            <div class="address-row">
              <span class="addr-text">{{ order.address }}</span>
              <van-icon name="location-o" size="16" color="#4E8EF7" />
              <span class="copy-text" @click.stop>复制</span>
            </div>

            <!-- 商品信息 -->
            <div class="goods-row">
              <img :src="order.goodsImage || '/placeholder.png'" class="goods-img" alt="商品" />
              <div class="goods-info">
                <div class="goods-name">{{ order.goodsName }}</div>
              </div>
              <div class="goods-price-qty">
                <span>¥{{ order.goodsPrice }}</span>
                <span>×{{ order.goodsQuantity }}</span>
              </div>
            </div>

            <!-- 线上 + 总价 + 需收款 -->
            <div class="payment-row">
              <span class="online-badge">线上</span>
              <span class="label-gray">总价：</span>
              <span class="price-black">¥{{ order.totalPrice }}</span>
              <span class="label-gray" style="margin-left: 40px;">需收款：</span>
              <span class="price-red">¥{{ order.needPay }}</span>
            </div>

            <!-- 订单备注 -->
            <div class="remark-row">
              <span class="label-gray">订单备注：</span>
            </div>

            <!-- 商家备注 -->
            <div class="merchant-remark-row" @click.stop>
              <span class="label-gray">商家备注：</span>
              <van-icon name="arrow" size="12" color="#ccc" />
            </div>

            <!-- 配送工和配送收入 -->
            <div class="worker-income-row">
              <span>配送工：{{ order.worker }}</span>
              <span class="income-blue">配送收入：¥{{ order.income }}</span>
            </div>

            <!-- 更多和刷新 -->
            <div class="action-row">
              <div class="more-text" @click.stop="toggleMore(index)">
                更多 <van-icon :name="order.showMore ? 'arrow-down' : 'arrow-up'" size="12" />
              </div>
              <van-button size="small" round plain @click.stop>刷新</van-button>
            </div>

            <!-- 交易号 - 可展开收起 -->
            <div class="transaction-row" v-show="order.showMore">
              交易号：{{ order.transactionId }}
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 弹窗 -->
    <van-popup v-model:show="showTimePicker" position="bottom" round>
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择日期"
        @confirm="onTimeConfirm"
        @cancel="showTimePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showChannelPicker" position="bottom" round>
      <van-picker
        :columns="channelOptions"
        @confirm="onChannelConfirm"
        @cancel="showChannelPicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showKeywordPicker" position="bottom" round>
      <van-search
        v-model="keyword"
        placeholder="请输入关键字"
        @search="onKeywordSearch"
      />
    </van-popup>

    <van-popup v-model:show="showSearch" position="top">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索订单"
        show-action
        @search="onSearch"
        @cancel="showSearch = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const activeStatus = ref('delivered')
const currentPage = ref(1)
const totalPages = ref(1)
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const messageCount = ref(0)

const showTimePicker = ref(false)
const showChannelPicker = ref(false)
const showKeywordPicker = ref(false)
const showSearch = ref(false)
const currentDate = ref(new Date())
const keyword = ref('')
const searchKeyword = ref('')
const channelOptions = ['全部渠道', '美团', '饿了么', '京东到家', '拼多多']

const orderList = ref([
  {
    latestDeliveryTime: '2025-11-08 08:30',
    deposit: 0,
    debt: 0,
    debtTicket: 0,
    debtAmount: '0.00',
    priority: true,
    orderTime: '2025-11-07\n09:29:29',
    customerName: '刘**',
    customerPhone: '17851445238,5343',
    address: '江苏省扬州市广陵区头桥镇镇中路178号 江苏苏中二楼',
    goodsImage: '',
    goodsName: '怡宝 饮用纯净水4.5L*4桶/箱',
    goodsPrice: '0',
    goodsQuantity: 12,
    totalPrice: '0',
    needPay: '0.00',
    worker: '宋再洋',
    income: '0.00',
    transactionId: '3046265978283616561',
    showMore: false
  }
])

const onStatusChange = (name) => {
  currentPage.value = 1
  orderList.value = []
  finished.value = false
  onLoad()
}

const onRefresh = () => {
  refreshing.value = true
  currentPage.value = 1
  orderList.value = []
  finished.value = false
  setTimeout(() => {
    onLoad()
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

const onLoad = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    finished.value = true
  }, 500)
}

const onTimeConfirm = () => {
  showTimePicker.value = false
  showToast('时间已选择')
}

const onChannelConfirm = ({ selectedValues }) => {
  showChannelPicker.value = false
  showToast(`已选择：${selectedValues[0]}`)
}

const onKeywordSearch = () => {
  showKeywordPicker.value = false
  showToast(`搜索：${keyword.value}`)
}

const onSearch = () => {
  showSearch.value = false
  showToast(`搜索：${searchKeyword.value}`)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    orderList.value = []
    finished.value = false
    onLoad()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    orderList.value = []
    finished.value = false
    onLoad()
  }
}

const showDistribution = () => {
  router.push('/order-distribution')
}

const goToOrderDetail = (order) => {
  router.push(`/order-detail/${order.transactionId}`)
}

const toggleMore = (index) => {
  orderList.value[index].showMore = !orderList.value[index].showMore
}
</script>

<style lang="scss" scoped>
.my-delivery-page {
  background: #f5f5f5;
  min-height: 100vh;
}

// 顶部导航 - 蓝色背景
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #4E8EF7;
  color: white;

  .nav-left, .nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
    .van-icon {
      cursor: pointer;
      color: white;
    }
  }

  .nav-center {
    flex: 1;
    text-align: center;
    .nav-title {
      font-size: 18px;
      font-weight: 500;
    }
  }
}

// 状态标签
.status-tabs {
  background: white;
  :deep(.van-tabs__nav) {
    padding: 0 8px;
  }
  :deep(.van-tab) {
    font-size: 14px;
    padding: 0 12px;
  }
  :deep(.van-tabs__line) {
    background: #4E8EF7;
  }
}

// 筛选栏
.filter-bar {
  display: flex;
  background: white;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;

  .filter-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
  }
}

// 分页栏
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
  position: relative;

  .pagination-center {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;

    .page-btn {
      color: #4E8EF7;
      cursor: pointer;
    }
    .page-info {
      color: #333;
    }
  }

  .van-button {
    position: absolute;
    right: 16px;
  }
}

// 订单列表
.order-list {
  padding: 12px;
}

// 订单卡片
.order-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;

  // 顶部粉红色边框
  .card-top-border {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #FFB6C1, #FFC0CB);
    border-radius: 8px 8px 0 0;
  }

  // 右上角天标签
  .day-corner-tag {
    position: absolute;
    top: 0;
    right: 0;
    background: #FF6B6B;
    color: white;
    padding: 4px 12px;
    border-radius: 0 8px 0 12px;
    font-size: 12px;
  }

  // 最迟送达 - 带背景色
  .deadline-row {
    margin-top: 8px;
    margin-bottom: 6px;
    margin-left: -12px;
    margin-right: -12px;
    padding: 8px 12px;
    background: #FFF9F0;
    font-size: 13px;
    .label-gray {
      color: #999;
    }
    .time-purple {
      color: #9966FF;
      font-weight: 500;
      margin-left: 4px;
    }
  }

  // 欠款信息 - 靠右
  .debt-row {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-bottom: 10px;
    font-size: 13px;
    color: #333;
  }

  // 百一先到 + 时间 - 不换行
  .time-section {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;

    .priority-tag {
      background: #4E8EF7;
      color: white;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      white-space: nowrap;
    }

    .order-datetime {
      font-size: 20px;
      font-weight: 500;
      color: #4E8EF7;
      line-height: 1.4;
      white-space: nowrap;
    }
  }

  // 客户信息
  .customer-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 14px;

    .name {
      color: #333;
      font-weight: 500;
    }
    .phone {
      color: #666;
    }
    .van-icon {
      cursor: pointer;
    }
  }

  // 地址
  .address-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
    font-size: 14px;

    .addr-text {
      flex: 1;
      color: #333;
    }
    .copy-text {
      color: #4E8EF7;
      font-size: 13px;
      cursor: pointer;
    }
  }

  // 商品行
  .goods-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;

    .goods-img {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      object-fit: cover;
      background: #f5f5f5;
    }

    .goods-info {
      flex: 1;
      .goods-name {
        font-size: 14px;
        color: #333;
      }
    }

    .goods-price-qty {
      display: flex;
      gap: 8px;
      font-size: 14px;
      color: #333;
    }
  }

  // 线上 + 价格行
  .payment-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 13px;

    .online-badge {
      background: #52C41A;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      margin-right: 8px;
    }

    .label-gray {
      color: #666;
      margin-right: 4px;
    }

    .price-black {
      color: #333;
    }

    .price-red {
      color: #FF3B30;
      font-weight: 500;
    }
  }

  // 备注行
  .remark-row, .merchant-remark-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
    font-size: 13px;

    .label-gray {
      color: #666;
    }
  }

  .merchant-remark-row {
    cursor: pointer;
  }

  // 配送工和收入
  .worker-income-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 13px;
    color: #333;

    .income-blue {
      color: #4E8EF7;
      font-weight: 500;
    }
  }

  // 操作按钮行
  .action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .more-text {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #666;
      cursor: pointer;
    }
  }

  // 交易号
  .transaction-row {
    font-size: 12px;
    color: #999;
  }
}
</style>
