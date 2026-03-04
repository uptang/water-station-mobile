<template>
  <div class="home-page page-with-tabbar">
    <!-- 顶部搜索栏 - 白色背景 -->
    <div class="home-header">
      <div class="search-wrapper">
        <van-search
          v-model="searchPhone"
          shape="round"
          placeholder="输入电话快速下单"
          background="transparent"
        />
        <van-button
          type="primary"
          size="small"
          round
          class="order-btn"
          @click="handleQuickOrder"
        >
          下单
        </van-button>
      </div>
      <van-badge :content="messageCount" @click="goMessage">
        <van-icon name="bell" size="22" color="#FF3B30" />
      </van-badge>
    </div>

    <!-- 4个主要功能图标 - 白色背景 -->
    <div class="main-functions">
      <div
        v-for="item in mainFunctions"
        :key="item.path"
        class="function-item"
        @click="router.push(item.path)"
      >
        <div class="icon-circle" :style="{ background: item.color }">
          <van-icon :name="item.icon" size="24" color="#fff" />
        </div>
        <span class="function-text">{{ item.text }}</span>
      </div>
    </div>

    <!-- 工单统计区域 - 浅蓝色卡片 -->
    <div class="order-section">
      <div class="section-header">
        <div class="title-row">
          <div class="title-left">
            <span class="title">工单</span>
            <van-icon name="question-o" size="14" color="#999" />
            <span class="delivery-rule">配送规则</span>
          </div>
          <div class="header-actions">
            <div class="action-btn" @click="router.push('/order-feedback')">
              <van-icon name="notes-o" size="16" color="#4E8EF7" />
              <span>工单详情</span>
            </div>
            <div class="action-btn" @click="router.push('/order-appeal')">
              <van-icon name="orders-o" size="16" color="#4E8EF7" />
              <span>申诉列表</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计数据网格 -->
      <div class="order-stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ orderStats.total }}</div>
          <div class="stat-label">今日总量</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ orderStats.pending }}</div>
          <div class="stat-label">待处理</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ orderStats.urgent }}</div>
          <div class="stat-label">平台催单</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ orderStats.penalty }}</div>
          <div class="stat-label">处罚单</div>
        </div>
        <div class="stat-item">
          <div class="stat-value red">{{ orderStats.timeout }}</div>
          <div class="stat-label">已超时</div>
        </div>
      </div>

      <!-- 即将超时提醒 -->
      <div class="timeout-alert" v-if="orderStats.almostTimeout > 0">
        <van-icon name="warning-o" color="#FF8C00" />
        <span>即将超时</span>
        <span class="count">{{ orderStats.almostTimeout }}</span>
        <van-button type="warning" size="small" round @click="handleTimeout">
          去处理 <van-icon name="arrow" />
        </van-button>
      </div>
    </div>

    <!-- 订单状态与收入统计 - 合并的白色卡片 -->
    <div class="order-income-section">
      <!-- 订单状态统计 -->
      <div class="status-row">
        <div class="status-item">
          <div class="value red">{{ orderStats.toDispatch }}</div>
          <div class="label">待派单</div>
        </div>
        <div class="status-item">
          <div class="value blue">{{ orderStats.delivering }}</div>
          <div class="label">配送中</div>
        </div>
      </div>

      <!-- 分割线 -->
      <div class="divider"></div>

      <!-- 收入统计 -->
      <div class="income-section">
        <div class="income-items">
          <div class="income-item">
            <div class="label">今日</div>
            <div class="orders">{{ incomeStats.todayOrders }}单</div>
            <div class="amount">¥{{ incomeStats.today }}</div>
          </div>
          <div class="income-item">
            <div class="label">昨日</div>
            <div class="orders">{{ incomeStats.yesterdayOrders }}单</div>
            <div class="amount">¥{{ incomeStats.yesterday }}</div>
          </div>
          <div class="income-item">
            <div class="label">本月</div>
            <div class="orders">{{ incomeStats.monthOrders }}单</div>
            <div class="amount">¥{{ incomeStats.thisMonth }}</div>
          </div>
        </div>
        <van-button type="primary" size="small" plain @click="refreshOrderStats"
          >刷新</van-button
        >
      </div>
    </div>

    <!-- 快捷操作网格 (3列) -->
    <div class="quick-actions">
      <div
        v-for="action in quickActions"
        :key="action.path"
        class="action-item"
        @click="handleAction(action)"
      >
        <van-icon :name="action.icon" size="28" color="#5B7C99" />
        <span class="action-text">{{ action.text }}</span>
      </div>
    </div>

    <!-- 底部统计Tab -->
    <div class="bottom-stats">
      <van-tabs v-model:active="activeBottomTab" class="bottom-tabs">
        <van-tab title="今日来电" name="calls">
          <div class="tab-content">
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-label">来电总数</div>
                <div class="stat-value">{{ callStats.totalCalls }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">接通数</div>
                <div class="stat-value">{{ callStats.answeredCalls }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">未接数</div>
                <div class="stat-value text-danger">
                  {{ callStats.missedCalls }}
                </div>
              </div>
            </div>
            <div class="stats-detail">
              <div class="detail-row">
                <span class="label">成单数：</span>
                <span class="value">{{ callStats.orderCount }}单</span>
              </div>
              <div class="detail-row">
                <span class="label">转化率：</span>
                <span class="value">{{ callStats.conversionRate }}%</span>
              </div>
            </div>
          </div>
        </van-tab>

        <van-tab title="账户详情" name="account">
          <div class="tab-content">
            <div class="account-info">
              <div class="info-row">
                <span class="label">账户余额：</span>
                <span class="value primary">¥{{ accountInfo.balance }}</span>
              </div>
              <div class="info-row">
                <span class="label">押金余额：</span>
                <span class="value">¥{{ accountInfo.deposit }}</span>
              </div>
              <div class="info-row">
                <span class="label">积分：</span>
                <span class="value">{{ accountInfo.points }}</span>
              </div>
              <div class="info-row">
                <span class="label">空桶数量：</span>
                <span class="value">{{ accountInfo.emptyBarrels }}个</span>
              </div>
            </div>
            <div class="account-actions">
              <van-button type="primary" size="small" plain>充值</van-button>
              <van-button type="primary" size="small" plain>提现</van-button>
            </div>
          </div>
        </van-tab>

        <van-tab title="线上收入" name="online">
          <div class="tab-content">
            <div class="online-income">
              <div class="income-row">
                <div class="income-item">
                  <div class="label">微信支付</div>
                  <div class="amount">¥{{ onlineIncome.wechat }}</div>
                </div>
                <div class="income-item">
                  <div class="label">支付宝</div>
                  <div class="amount">¥{{ onlineIncome.alipay }}</div>
                </div>
              </div>
              <div class="income-row">
                <div class="income-item">
                  <div class="label">线上总计</div>
                  <div class="amount primary">¥{{ onlineIncome.total }}</div>
                </div>
                <div class="income-item">
                  <div class="label">订单数</div>
                  <div class="amount">{{ onlineIncome.orderCount }}单</div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 底部导航 -->
    <tabbar />

    <!-- 快速下单弹窗 -->
    <van-dialog
      v-model:show="showQuickOrderDialog"
      title="快速下单"
      show-cancel-button
      @confirm="handleQuickOrderSubmit"
    >
      <van-form class="quick-order-form">
        <van-field
          v-model="quickOrderForm.phone"
          label="客户电话"
          type="tel"
          placeholder="请输入客户电话"
          readonly
        />
        <van-field
          v-model="quickOrderForm.address"
          label="配送地址"
          placeholder="请输入配送地址"
          required
        />
        <van-field
          v-model="quickOrderForm.product"
          label="商品"
          placeholder="请选择商品"
          readonly
          is-link
          @click="showProductPicker = true"
        />
        <van-field
          v-model="quickOrderForm.quantity"
          label="数量"
          type="digit"
          placeholder="请输入数量"
          required
        />
        <van-field
          v-model="quickOrderForm.remark"
          label="备注"
          type="textarea"
          placeholder="请输入备注信息"
          rows="2"
        />
      </van-form>
    </van-dialog>

    <!-- 商品选择器 -->
    <van-popup v-model:show="showProductPicker" position="bottom">
      <van-picker
        :columns="productList"
        @confirm="onProductConfirm"
        @cancel="showProductPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { showToast, showSuccessToast } from "vant";
import Tabbar from "@/components/Tabbar.vue";

const router = useRouter();

const searchPhone = ref("");
const activeBottomTab = ref("calls");
const messageCount = ref(3);
const showQuickOrderDialog = ref(false);
const showProductPicker = ref(false);

// 快速下单表单
const quickOrderForm = reactive({
  phone: "",
  address: "",
  product: "",
  quantity: "1",
  remark: "",
});

// 商品列表
const productList = [
  "怡宝 饮用纯净水 6L×3桶/箱",
  "农夫山泉 饮用天然水 4L×6桶/箱",
  "景田 百岁山饮用水 5L×4桶/箱",
  "娃哈哈 纯净水 5L×4桶/箱",
];

// 4个主要功能
const mainFunctions = [
  {
    path: "/user-management",
    icon: "friends-o",
    text: "我的用户",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    path: "/ticket-distribute",
    icon: "coupon-o",
    text: "发放水票",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    path: "/delivery-stats",
    icon: "chart-trending-o",
    text: "配送统计",
    color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    path: "/inventory",
    icon: "shopping-cart-o",
    text: "进销存",
    color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
];

// 工单统计数据
const orderStats = ref({
  total: 128,
  pending: 5,
  urgent: 2,
  penalty: 0,
  timeout: 1,
  almostTimeout: 3,
  toDispatch: 0,
  delivering: 0,
});

// 收入统计
const incomeStats = ref({
  today: "0.00",
  todayOrders: 0,
  yesterday: "0.00",
  yesterdayOrders: 0,
  thisMonth: "0.00",
  monthOrders: 0,
});

// 今日来电统计
const callStats = ref({
  totalCalls: 45,
  answeredCalls: 38,
  missedCalls: 7,
  orderCount: 25,
  conversionRate: 65.8,
});

// 账户详情
const accountInfo = ref({
  balance: "2850.50",
  deposit: "500.00",
  points: 1280,
  emptyBarrels: 15,
});

// 线上收入
const onlineIncome = ref({
  wechat: "1850.00",
  alipay: "680.00",
  total: "2530.00",
  orderCount: 18,
});

// 11个快捷操作
const quickActions = [
  {
    path: "/order-stats",
    icon: "bar-chart-o",
    text: "接单库存",
    color: "#4E8EF7",
  },
  {
    path: "/order-stats",
    icon: "orders-o",
    text: "订单统计",
    color: "#4E8EF7",
  },
  {
    path: "/worker-management",
    icon: "manager-o",
    text: "我的工人",
    color: "#4E8EF7",
  },
  { path: "/e-ticket", icon: "coupon-o", text: "电子水票", color: "#4E8EF7" },
  { path: "/qrcode", icon: "qr", text: "二维码", color: "#4E8EF7" },
  {
    path: "/store-settings",
    icon: "setting-o",
    text: "门店设置",
    color: "#4E8EF7",
  },
  {
    path: "/inventory-check",
    icon: "records",
    text: "盘点统计",
    color: "#4E8EF7",
  },
  {
    path: "/barrel-stats",
    icon: "balance-o",
    text: "空桶统计",
    color: "#4E8EF7",
  },
  {
    path: "/verification-stats",
    icon: "pending-payment",
    text: "待核销",
    color: "#4E8EF7",
  },
  {
    path: "/route-plan",
    icon: "location-o",
    text: "线路规划",
    color: "#4E8EF7",
  },
  {
    path: "/my-delivery",
    icon: "logistics",
    text: "我的配送",
    color: "#4E8EF7",
  },
];

// 快速下单
const handleQuickOrder = () => {
  if (!searchPhone.value) {
    showToast("请输入电话号码");
    return;
  }

  // 验证手机号格式
  const phoneReg = /^1[3-9]\d{9}$/;
  if (!phoneReg.test(searchPhone.value)) {
    showToast("请输入正确的手机号");
    return;
  }

  // 填充表单并打开弹窗
  quickOrderForm.phone = searchPhone.value;
  quickOrderForm.address = "";
  quickOrderForm.product = "";
  quickOrderForm.quantity = "1";
  quickOrderForm.remark = "";
  showQuickOrderDialog.value = true;
};

// 商品选择确认
const onProductConfirm = ({ selectedValues }) => {
  quickOrderForm.product = selectedValues[0];
  showProductPicker.value = false;
};

// 提交快速下单
const handleQuickOrderSubmit = () => {
  if (!quickOrderForm.address) {
    showToast("请输入配送地址");
    return false;
  }
  if (!quickOrderForm.product) {
    showToast("请选择商品");
    return false;
  }
  if (!quickOrderForm.quantity || quickOrderForm.quantity < 1) {
    showToast("请输入正确的数量");
    return false;
  }

  // 模拟提交订单
  showSuccessToast("下单成功");
  showQuickOrderDialog.value = false;
  searchPhone.value = "";

  // 可以跳转到订单列表查看
  setTimeout(() => {
    router.push("/order-list");
  }, 1500);
};

// 跳转消息中心
const goMessage = () => {
  router.push("/message");
};

// 处理超时订单
const handleTimeout = () => {
  router.push("/order-timeout");
};

// 处理快捷操作点击
const handleAction = (action) => {
  if (action.path.startsWith("/")) {
    router.push(action.path).catch(() => {
      showToast("该功能正在开发中");
    });
  }
};

// 刷新订单统计
const refreshOrderStats = () => {
  showToast("正在刷新...");
  // 模拟刷新数据
  setTimeout(() => {
    // 这里可以调用API获取最新数据
    showSuccessToast("刷新成功");
  }, 800);
};
</script>

<style lang="scss" scoped>
.home-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 50px;
}

// 顶部搜索栏 - 白色背景
.home-header {
  background: #ffffff;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;

  .search-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f7f8fa;
    border-radius: 24px;
    overflow: hidden;
    padding-right: 8px;

    :deep(.van-search) {
      flex: 1;
      padding: 6px 12px;
    }

    :deep(.van-search__content) {
      background: transparent;
      padding: 0;
    }

    .order-btn {
      flex-shrink: 0;
      min-width: 60px;
      height: 32px;
      font-size: 14px;
    }
  }

  .van-badge {
    cursor: pointer;
  }
}

// 4个主要功能图标 - 白色背景
.main-functions {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20px 16px;
  background: #ffffff;

  .function-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    .icon-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .function-text {
      font-size: 12px;
      color: #333;
    }
  }
}

// 工单统计区域 - 浅蓝色卡片
.order-section {
  margin: 8px 16px;
  background: #e8f4f8;
  border-radius: 12px;
  padding: 16px;
  position: relative;

  .section-header {
    .title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .title-left {
        display: flex;
        align-items: center;
        gap: 6px;

        .title {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }

        .delivery-rule {
          font-size: 13px;
          color: #999;
        }
      }

      .header-actions {
        display: flex;
        gap: 12px;

        .action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.3s;

          &:hover {
            background: rgba(78, 142, 247, 0.1);
          }

          span {
            font-size: 13px;
            color: #4e8ef7;
          }
        }
      }
    }
  }

  .order-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 16px;

    .stat-item {
      text-align: center;

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 4px;

        &.red {
          color: #ff3b30;
        }
      }

      .stat-label {
        font-size: 12px;
        color: #666;
      }
    }
  }

  .timeout-alert {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #fff4e6;
    border-radius: 8px;

    span {
      font-size: 14px;
      color: #333;
    }

    .count {
      font-weight: bold;
      color: #ff8c00;
      margin-right: auto;
    }
  }
}

// 订单状态与收入统计 - 合并的白色卡片
.order-income-section {
  margin: 8px 16px;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .status-row {
    display: flex;
    justify-content: space-around;
    gap: 24px;

    .status-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      .value {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 8px;

        &.red {
          color: #ff3b30;
        }

        &.blue {
          color: #4e8ef7;
        }
      }

      .label {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .divider {
    height: 1px;
    background: #f0f0f0;
    margin: 16px 0;
  }

  .income-section {
    position: relative;
    display: flex;
    justify-content: space-around;

    .income-items {
      flex: 1;
      display: flex;
      justify-content: space-around;

      .income-item {
        text-align: center;

        .label {
          font-size: 13px;
          color: #999;
          margin-bottom: 8px;
        }

        .orders {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .amount {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
      }
    }

    .van-button {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}

// 快捷操作网格 (3列×4行)
.quick-actions {
  margin: 8px 16px;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px 16px;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    .action-text {
      font-size: 12px;
      color: #333;
      text-align: center;
    }
  }
}

// 底部统计Tab
.bottom-stats {
  margin: 8px 16px 16px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .bottom-tabs {
    :deep(.van-tabs__nav) {
      background: white;
    }

    :deep(.van-tab) {
      font-size: 15px;
      color: #666;
    }

    :deep(.van-tab--active) {
      color: #4e8ef7;
      font-weight: 500;
    }

    :deep(.van-tabs__line) {
      background: #4e8ef7;
      width: 30px;
    }

    .tab-content {
      padding: 20px 16px;
      min-height: 180px;

      .stats-row {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;

        .stat-item {
          text-align: center;

          .stat-label {
            font-size: 13px;
            color: #999;
            margin-bottom: 8px;
          }

          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #333;

            &.text-danger {
              color: #ff3b30;
            }
          }
        }
      }

      .stats-detail {
        padding: 16px;
        background: #f7f8fa;
        border-radius: 8px;

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;

          .label {
            color: #666;
          }

          .value {
            color: #333;
            font-weight: 500;
          }
        }
      }

      .account-info {
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #f5f5f5;
          font-size: 15px;

          &:last-child {
            border-bottom: none;
          }

          .label {
            color: #666;
          }

          .value {
            color: #333;
            font-weight: 500;

            &.primary {
              color: #4e8ef7;
              font-size: 18px;
              font-weight: bold;
            }
          }
        }
      }

      .account-actions {
        display: flex;
        gap: 12px;
        margin-top: 20px;

        .van-button {
          flex: 1;
          border-color: #4e8ef7;
          color: #4e8ef7;
        }
      }

      .online-income {
        .income-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;

          &:last-child {
            margin-bottom: 0;
          }

          .income-item {
            flex: 1;
            padding: 16px;
            background: #f7f8fa;
            border-radius: 8px;
            text-align: center;

            .label {
              font-size: 13px;
              color: #999;
              margin-bottom: 12px;
            }

            .amount {
              font-size: 20px;
              font-weight: bold;
              color: #333;

              &.primary {
                color: #4e8ef7;
                font-size: 24px;
              }
            }
          }
        }
      }
    }
  }
}

// 快速下单表单
.quick-order-form {
  padding: 16px;

  :deep(.van-field) {
    margin-bottom: 12px;
  }
}
</style>
