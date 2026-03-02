<template>
  <div class="order-stats-page page">
    <!-- 顶部导航 -->
    <van-nav-bar title="订单统计" left-arrow @click-left="router.back()" fixed placeholder />

    <!-- 时间筛选标签 -->
    <van-tabs v-model:active="activeTab" @change="handleTabChange" class="time-tabs">
      <van-tab title="今日" name="today" />
      <van-tab title="昨日" name="yesterday" />
      <van-tab title="本月" name="thisMonth" />
      <van-tab title="上月" name="lastMonth" />
    </van-tabs>

    <!-- 累计订单量 -->
    <div class="stats-header">
      <span class="label">累计订单量：</span>
      <span class="count">{{ totalOrders }}</span>
      <van-button size="small" type="primary" icon="search" class="search-btn">
        搜索
      </van-button>
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
        >
          <!-- 用户信息 -->
          <div class="user-info">
            <div class="user-basic">
              <div class="label">用户编号：</div>
              <div class="info-row">
                <span class="name">用户信息：{{ order.userName }}</span>
                <span class="phone">{{ order.phone }}</span>
              </div>
              <div class="address">收货地址：{{ order.address }}</div>
            </div>
          </div>

          <!-- 订单状态时间线 -->
          <div class="order-timeline">
            <div
              v-for="(status, index) in order.statusList"
              :key="index"
              class="timeline-item"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="status-header">
                  <span class="status-name">{{ status.name }}</span>
                  <span class="operator">操作人：{{ status.operator }}</span>
                </div>
                <div class="status-time">{{ status.time }}</div>
                <div v-if="status.worker" class="status-detail">
                  配送工：{{ status.worker }}
                </div>
                <div v-if="status.store" class="status-detail">
                  分配门店：{{ status.store }}
                </div>
                <div v-if="status.reason" class="status-detail">
                  原因：{{ status.reason }}
                </div>
                <div v-if="status.money !== undefined" class="status-detail">
                  收现金：¥{{ status.money }}（）
                  <span style="margin-left: 20px">欠款：¥{{ status.debt }}</span>
                </div>
                <div v-if="status.product" class="status-detail product-name">
                  {{ status.product }}
                  <span class="product-qty">*{{ status.qty }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部金额和详情 -->
          <div class="order-footer">
            <span class="amount">¥{{ order.amount }}</span>
            <span class="detail-link" @click="goToDetail(order.id)">
              查看详情 <van-icon name="arrow" />
            </span>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && orderList.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <p>没有更多了！</p>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('thisMonth')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const totalOrders = ref(2)

// 模拟订单数据
const orderList = ref([
  {
    id: 1,
    userName: '李***',
    phone: '184683873050',
    address: '江苏省扬州市广陵区永桥镇杯区益农会',
    amount: 0.00,
    statusList: [
      {
        name: '送达',
        operator: '宋再洋',
        time: '2026-02-11 09:18:27',
        worker: '宋再洋',
        money: 0.00,
        debt: 0.00,
        product: '怡宝饮用纯净水4.5L*4瓶/箱',
        qty: 1
      },
      {
        name: '派单',
        operator: '海涛',
        time: '2026-02-09 17:18:28',
        worker: '宋再洋'
      },
      {
        name: '转单',
        operator: '海涛',
        time: '2026-02-09 10:52:40',
        store: '百一先到'
      },
      {
        name: '自动转单',
        operator: '',
        time: '2026-02-09 08:50:04',
        store: '扬州水达速电子商务有限公司总后台'
      },
      {
        name: '下单',
        operator: '',
        time: '2026-02-09 08:50:03',
        store: '怡宝天猫旗舰店中台'
      }
    ]
  },
  {
    id: 2,
    userName: '李***',
    phone: '15784029676',
    address: '江苏省扬州市广陵区桥镇杯康陈(景区(门))康嘉园北院 5栋 3号305室',
    amount: 0.00,
    statusList: [
      {
        name: '送达',
        operator: '宋再洋',
        time: '2026-02-04 11:09:18',
        worker: '宋再洋',
        money: 0.00,
        debt: 0.00,
        product: '怡宝饮用纯净水1.555L×12瓶/箱',
        qty: 1
      },
      {
        name: '派单',
        operator: '宋再洋',
        time: '2026-02-04 11:08:37',
        worker: '宋再洋'
      },
      {
        name: '转单',
        operator: '海涛',
        time: '2026-02-04 10:55:23',
        store: '百一先到'
      },
      {
        name: '派单',
        operator: '海涛',
        time: '2026-02-04 08:43:08',
        worker: '刘庆申'
      },
      {
        name: '转单',
        operator: '海涛',
        time: '2026-02-04 08:42:39',
        store: '扬州达水网'
      },
      {
        name: '分配订单',
        operator: '系统',
        time: '2026-02-03 19:39:50',
        store: '扬州水达速电子商务有限公司总后台',
        reason: '(缺货时电话与我联系)'
      },
      {
        name: '电子囤栏分单',
        operator: '',
        time: '2026-02-03 19:39:50'
      },
      {
        name: '下单',
        operator: '',
        time: '2026-02-03 19:39:50',
        store: '怡宝O2O官旗中台',
        reason: '(缺货时电话与我联系)'
      }
    ]
  }
])

const onLoad = () => {
  setTimeout(() => {
    loading.value = false
    finished.value = true
  }, 500)
}

const onRefresh = () => {
  setTimeout(() => {
    refreshing.value = false
    finished.value = false
  }, 1000)
}

const handleTabChange = (name) => {
  console.log('切换到:', name)
  // 重新加载数据
}

const goToDetail = (id) => {
  router.push(`/order-detail/${id}`)
}
</script>

<style lang="scss" scoped>
.order-stats-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 20px;

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

.time-tabs {
  background: white;
  margin-bottom: 0;

  :deep(.van-tab) {
    font-size: 15px;
    color: #666;
  }

  :deep(.van-tab--active) {
    color: #4E8EF7;
    font-weight: 500;
  }

  :deep(.van-tabs__line) {
    background: #4E8EF7;
    width: 30px;
  }
}

.stats-header {
  padding: 16px;
  background: white;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

  .label {
    font-size: 15px;
    color: #666;
  }

  .count {
    flex: 1;
    font-size: 20px;
    font-weight: bold;
    color: #4E8EF7;
    margin-left: 8px;
  }

  .search-btn {
    height: 32px;
    padding: 0 20px;
    font-size: 14px;
    border-radius: 16px;

    :deep(.van-icon) {
      margin-right: 4px;
    }
  }
}

.order-card {
  background: white;
  margin: 0 16px 12px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  }

  .user-info {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .user-basic {
      .label {
        font-size: 13px;
        color: #999;
        margin-bottom: 4px;
      }

      .info-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 6px;

        .name {
          font-size: 14px;
          color: #333;
        }

        .phone {
          font-size: 14px;
          color: #4E8EF7;
        }
      }

      .address {
        font-size: 13px;
        color: #666;
        line-height: 1.6;
      }
    }
  }

  .order-timeline {
    position: relative;
    padding-left: 24px;
    margin-bottom: 12px;

    &::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 12px;
      bottom: 12px;
      width: 2px;
      background: linear-gradient(180deg, #4E8EF7 0%, #E5E5E5 100%);
    }

    .timeline-item {
      position: relative;
      padding-bottom: 20px;

      &:last-child {
        padding-bottom: 0;
      }

      .timeline-dot {
        position: absolute;
        left: -21px;
        top: 4px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #4E8EF7;
        border: 2px solid #fff;
        box-shadow: 0 0 0 2px #4E8EF7;
        z-index: 1;
      }

      &:first-child .timeline-dot {
        background: #FF8C00;
        box-shadow: 0 0 0 2px #FF8C00;
      }

      .timeline-content {
        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;

          .status-name {
            font-size: 15px;
            font-weight: 500;
            color: #333;
          }

          .operator {
            font-size: 13px;
            color: #999;
          }
        }

        .status-time,
        .status-detail {
          font-size: 13px;
          color: #666;
          line-height: 1.8;
        }

        .product-name {
          color: #333;
          margin-top: 6px;
          background: #F7F8FA;
          padding: 8px 12px;
          border-radius: 6px;
          font-weight: 500;

          .product-qty {
            margin-left: 8px;
            color: #4E8EF7;
            font-weight: 600;
          }
        }
      }
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f5f5f5;

    .amount {
      font-size: 20px;
      font-weight: bold;
      color: #FF3B30;
    }

    .detail-link {
      color: #4E8EF7;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: opacity 0.3s;

      &:active {
        opacity: 0.6;
      }

      .van-icon {
        font-size: 12px;
      }
    }
  }
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  margin: 0 16px 12px;
  border-radius: 12px;

  .empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  p {
    font-size: 14px;
    color: #999;
    margin: 0;
  }
}
</style>
