<template>
  <div class="order-list-page page-with-tabbar">
    <!-- 蓝色顶部导航栏 -->
    <div class="top-navbar">
      <van-icon name="wap-nav" size="24" @click="showMenu" />
      <span class="nav-title">订单</span>
      <div class="nav-right">
        <van-icon name="orders-o" size="24" @click="showList" />
        <van-icon name="search" size="24" @click="showSearch" />
      </div>
    </div>

    <!-- 状态标签栏 -->
    <van-tabs v-model:active="activeStatus" @change="handleStatusChange" scrollable>
      <van-tab title="待出库" name="pending"></van-tab>
      <van-tab title="配送中" name="delivering"></van-tab>
      <van-tab title="待退款" name="refunding"></van-tab>
      <van-tab title="已送达" name="delivered"></van-tab>
      <van-tab title="已核销" name="verified"></van-tab>
      <van-tab title="未支付" name="unpaid"></van-tab>
      <van-tab title="已取消" name="cancelled"></van-tab>
    </van-tabs>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-item" @click="showTimePicker = true">
        <span>时间</span>
        <van-icon name="arrow-down" />
      </div>
      <div class="filter-item" @click="showChannelPicker = true">
        <span>渠道</span>
        <van-icon name="arrow-down" />
      </div>
      <div class="filter-item" @click="showKeywordPicker = true">
        <span>关键字</span>
        <van-icon name="arrow-down" />
      </div>
    </div>

    <!-- 分页控制 -->
    <div class="pagination">
      <van-button plain size="small" round @click="prevPage">上一页</van-button>
      <span class="page-info">{{ currentPage }} / {{ totalPage }}</span>
      <van-button plain size="small" round @click="nextPage">下一页</van-button>
    </div>

    <!-- 订单列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div class="order-list">
        <div
          v-for="(order, index) in orderList"
          :key="order.id"
          class="order-card"
          @click="goOrderDetail(order.id)"
        >
          <!-- 右上角标签 -->
          <div class="corner-tag">天</div>

          <!-- 最迟送达时间 -->
          <div class="delivery-time">
            最迟送达：<span class="time-value">{{ order.deliveryTime }}</span>
          </div>

          <!-- 来源渠道 -->
          <div class="source">来自城配商：{{ order.source }}</div>

          <!-- 门店和时间 -->
          <div class="store-row">
            <span class="store-name">{{ order.storeName }}</span>
            <span class="order-time">{{ order.orderTime }}</span>
          </div>

          <!-- 客户信息 -->
          <div class="customer-row">
            <span class="customer-name">{{ order.customerName }}</span>
            <span class="divider">|</span>
            <span class="customer-phone">{{ order.phone }}</span>
            <van-icon name="replay" color="#4E8EF7" @click.stop="refreshOrder(order)" />
            <van-icon name="phone-o" color="#4E8EF7" @click.stop="callCustomer(order.phone)" />
          </div>

          <!-- 地址 -->
          <div class="address-row">
            <van-icon name="location-o" color="#4E8EF7" />
            <span class="address-text">{{ order.address }}</span>
            <span class="copy-btn" @click.stop="copyAddress(order.address)">复制</span>
          </div>

          <!-- 商品信息 -->
          <div class="product-row">
            <img :src="order.productImage" class="product-image" />
            <div class="product-info">
              <div class="product-name">{{ order.productName }}</div>
            </div>
            <van-icon name="label-o" color="#4E8EF7" />
            <span class="product-price">¥ {{ order.price }}</span>
            <span class="product-qty">x{{ order.qty }}</span>
          </div>

          <!-- 金额信息 -->
          <div class="amount-row">
            <div class="amount-item">
              <span class="label">线上</span>
              <span class="label">总价：</span>
              <span class="value">¥ {{ order.totalPrice }}</span>
            </div>
            <div class="amount-item">
              <span class="label">需收款：</span>
              <span class="value red">¥ {{ order.needCollect }}</span>
            </div>
          </div>

          <!-- 备注 -->
          <div class="remark-row">
            <div class="remark-item">订单备注：</div>
            <div class="remark-item">
              <span>商家备注：</span>
              <van-icon name="arrow" />
            </div>
          </div>

          <!-- 配送信息 -->
          <div class="delivery-row">
            <div class="delivery-item">
              <span class="label">配送工：</span>
              <span class="value">{{ order.deliveryWorker }}</span>
            </div>
            <div class="delivery-item">
              <span class="label">配送收入：</span>
              <span class="value blue">¥{{ order.deliveryIncome }}</span>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-row">
            <div class="more-btn" @click.stop="toggleMore(index)">
              更多 <van-icon :name="order.showMore ? 'arrow-down' : 'arrow-up'" size="12" />
            </div>
            <div class="action-buttons">
              <van-button size="small" @click.stop="verifyOrder(order)">核销</van-button>
              <van-button size="small" @click.stop="refreshOrder(order)">刷新</van-button>
            </div>
          </div>

          <!-- 交易号 - 可展开收起 -->
          <div class="transaction-row" v-show="order.showMore">
            交易号：{{ order.transactionId }}
          </div>
        </div>
      </div>
    </van-pull-refresh>

    <tabbar />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import Tabbar from '@/components/Tabbar.vue'

const router = useRouter()

const activeStatus = ref('delivered')
const refreshing = ref(false)
const currentPage = ref(1)
const totalPage = ref(1)
const showTimePicker = ref(false)
const showChannelPicker = ref(false)
const showKeywordPicker = ref(false)

// 模拟订单数据
const orderList = ref([
  {
    id: 1,
    deliveryTime: '2025-11-08 08:30',
    source: '扬州水达达电子商务有限公司总后台',
    storeName: '百一先到',
    orderTime: '2025-11-07 09:29:29',
    customerName: '刘**',
    phone: '17851445238,5343',
    address: '江苏省扬州市广陵区头桥镇镇中路178号 江苏中二楼',
    productImage: '/product.jpg',
    productName: '怡宝 饮用纯净水4.5L*4瓶/箱',
    price: '0',
    qty: 12,
    totalPrice: '0',
    needCollect: '0.00',
    deliveryWorker: '宋再洋',
    deliveryIncome: '0.00',
    transactionId: '3046265978283616561',
    showMore: false
  },
  {
    id: 2,
    deliveryTime: '2025-11-12 19:37',
    source: '扬州水达达电子商务有限公司总后台',
    storeName: '百一先到',
    orderTime: '2025-11-07 09:29:29',
    customerName: '刘**',
    phone: '17851445238,5343',
    address: '江苏省扬州市广陵区头桥镇镇中路178号 江苏中二楼',
    productImage: '/product.jpg',
    productName: '怡宝 饮用纯净水4.5L*4瓶/箱',
    price: '0',
    qty: 12,
    totalPrice: '0',
    needCollect: '0.00',
    deliveryWorker: '宋再洋',
    deliveryIncome: '0.00',
    transactionId: '3046265978283616562',
    showMore: false
  }
])

const onRefresh = () => {
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

const handleStatusChange = () => {
  showToast(`切换到${activeStatus.value}`)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPage.value) {
    currentPage.value++
  }
}

const showMenu = () => {
  showToast('菜单功能')
}

const showList = () => {
  showToast('列表功能')
}

const showSearch = () => {
  showToast('搜索功能')
}

const refreshOrder = (order) => {
  showToast('刷新订单')
}

const callCustomer = (phone) => {
  window.location.href = `tel:${phone.split(',')[0]}`
}

const copyAddress = (address) => {
  navigator.clipboard.writeText(address).then(() => {
    showToast('地址已复制')
  })
}

const verifyOrder = (order) => {
  showToast('核销订单')
}

const toggleMore = (index) => {
  orderList.value[index].showMore = !orderList.value[index].showMore
}

// 跳转到订单详情
const goOrderDetail = (orderId) => {
  router.push(`/order-detail/${orderId}`)
}
</script>

<style lang="scss" scoped>
.order-list-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 50px;
}

// 蓝色顶部导航栏
.top-navbar {
  background: #4E8EF7;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;

  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
  }

  .nav-right {
    display: flex;
    gap: 16px;
  }

  .van-icon {
    color: white;
    cursor: pointer;
  }
}

// 状态标签
:deep(.van-tabs) {
  background: white;

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
  }
}

// 筛选栏
.filter-bar {
  background: white;
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  .filter-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;

    span {
      font-size: 14px;
      color: #333;
    }

    .van-icon {
      font-size: 12px;
      color: #999;
    }
  }
}

// 分页控制
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f5f5f5;

  .page-info {
    font-size: 15px;
    color: #333;
  }

  .van-button {
    padding: 0 20px;
    border-color: #4E8EF7;
    color: #4E8EF7;
  }
}

// 订单卡片
.order-list {
  padding: 0 12px;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:active {
    transform: scale(0.98);
  }

  .corner-tag {
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 0 12px 0 12px;
    font-size: 13px;
    font-weight: bold;
  }

  .delivery-time {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;

    .time-value {
      color: #9C27B0;
      font-weight: bold;
      font-size: 14px;
    }
  }

  .source {
    font-size: 12px;
    color: #999;
    margin-bottom: 12px;
  }

  .store-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .store-name {
      font-size: 16px;
      font-weight: bold;
      color: #4E8EF7;
    }

    .order-time {
      font-size: 13px;
      color: #999;
    }
  }

  .customer-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 14px;

    .customer-name {
      color: #333;
    }

    .divider {
      color: #ddd;
    }

    .customer-phone {
      color: #333;
      font-weight: 500;
    }

    .van-icon {
      cursor: pointer;
    }
  }

  .address-row {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 12px;
    padding: 8px;
    background: #F7F8FA;
    border-radius: 6px;

    .address-text {
      flex: 1;
      font-size: 13px;
      color: #666;
      line-height: 1.6;
    }

    .copy-btn {
      color: #4E8EF7;
      font-size: 13px;
      cursor: pointer;
      white-space: nowrap;
    }
  }

  .product-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 12px;

    .product-image {
      width: 50px;
      height: 50px;
      border-radius: 6px;
      object-fit: cover;
    }

    .product-info {
      flex: 1;

      .product-name {
        font-size: 13px;
        color: #333;
        line-height: 1.4;
      }
    }

    .product-price {
      font-size: 14px;
      color: #333;
      margin: 0 8px;
    }

    .product-qty {
      font-size: 14px;
      color: #666;
    }
  }

  .amount-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;

    .amount-item {
      display: flex;
      align-items: center;
      gap: 4px;

      .label {
        font-size: 13px;
        color: #666;
      }

      .value {
        font-size: 14px;
        color: #333;
        font-weight: 500;

        &.red {
          color: #FF3B30;
          font-size: 16px;
          font-weight: bold;
        }
      }
    }
  }

  .remark-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;

    .remark-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #666;
    }
  }

  .delivery-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-top: 1px solid #f0f0f0;
    margin-bottom: 12px;

    .delivery-item {
      display: flex;
      align-items: center;

      .label {
        font-size: 13px;
        color: #666;
      }

      .value {
        font-size: 14px;
        color: #333;

        &.blue {
          color: #4E8EF7;
          font-weight: 500;
        }
      }
    }
  }

  .action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .more-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #666;
      cursor: pointer;
    }

    .action-buttons {
      display: flex;
      gap: 8px;

      .van-button {
        padding: 0 16px;
        height: 32px;
        font-size: 13px;
      }

      .van-button--plain {
        border-color: #ddd;
        color: #666;
      }

      .van-button:not(.van-button--plain) {
        background: white;
        border: 1px solid #4E8EF7;
        color: #4E8EF7;
      }
    }
  }

  .transaction-row {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
    font-size: 12px;
    color: #999;
  }
}
</style>
