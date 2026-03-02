<template>
  <div class="more-page page-with-tabbar">
    <!-- 用户信息卡片 -->
    <div class="user-header">
      <div class="user-left">
        <div class="user-avatar">
          <div class="avatar-circle">JD</div>
        </div>
        <div class="user-info">
          <div class="store-name">百一先到</div>
          <div class="status">未设置</div>
          <div class="user-detail">宋再洋 老板 17696837781</div>
        </div>
      </div>
      <div class="message-icon" @click="router.push('/message')">
        <van-badge :content="messageCount">
          <van-icon name="chat-o" size="24" color="#333" />
        </van-badge>
      </div>
    </div>

    <!-- 天网接单横幅 -->
    <div class="tianwang-banner">
      <div class="banner-icon">
        <van-icon name="bar-chart-o" size="32" />
      </div>
      <span class="banner-text">天网接单</span>
      <van-button size="small" class="apply-btn">立即申请</van-button>
    </div>

    <!-- 快捷功能（4个彩色圆形图标）-->
    <div class="quick-functions">
      <div class="function-item" @click="router.push('/user-management')">
        <div class="icon-circle blue">
          <van-icon name="friends-o" size="24" color="#fff" />
        </div>
        <span>我的用户</span>
      </div>
      <div class="function-item" @click="router.push('/ticket-distribute')">
        <div class="icon-circle pink">
          <van-icon name="coupon-o" size="24" color="#fff" />
        </div>
        <span>发放水票</span>
      </div>
      <div class="function-item" @click="router.push('/delivery-stats')">
        <div class="icon-circle green">
          <van-icon name="chart-trending-o" size="24" color="#fff" />
        </div>
        <span>配送统计</span>
      </div>
      <div class="function-item" @click="router.push('/inventory')">
        <div class="icon-circle orange">
          <van-icon name="shopping-cart-o" size="24" color="#fff" />
        </div>
        <span>进销存</span>
      </div>
    </div>

    <!-- 功能网格（5列布局）-->
    <div class="function-grid">
      <div
        v-for="item in functionItems"
        :key="item.text"
        class="grid-item"
        @click="handleItemClick(item)"
      >
        <van-icon :name="item.icon" size="28" color="#5B7C99" />
        <span>{{ item.text }}</span>
      </div>
    </div>

    <!-- 设置菜单列表 -->
    <div class="settings-list">
      <van-cell-group :border="false">
        <van-cell title="绑定微信" is-link @click="showToast('绑定微信')" />
        <van-cell
          title="字体大小设置"
          is-link
          @click="showToast('字体大小设置')"
        />
        <van-cell title="关于我们" is-link @click="showToast('关于我们')" />
        <van-cell title="教学视频" is-link @click="showToast('教学视频')" />
        <van-cell title="操作手册" is-link @click="showToast('操作手册')" />
        <van-cell title="隐私政策" is-link @click="showToast('隐私政策')" />
        <van-cell title="推荐有礼" is-link @click="showToast('推荐有礼')" />
        <van-cell
          title="在线软件服务说明"
          is-link
          @click="showToast('在线软件服务说明')"
        />
        <van-cell title="实名认证" is-link @click="showToast('实名认证')" />
        <van-cell title="上传日志" is-link @click="showToast('上传日志')" />
        <van-cell title="投诉电话" value="17380124285" />
      </van-cell-group>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <div class="logout-btn" @click="handleLogout">退出登录</div>
    </div>

    <!-- 版权信息 -->
    <div class="copyright">
      <p>APP备案编号：渝ICP备20210319号-4A</p>
      <p>官网链接：https://beian.miit.gov.cn</p>
    </div>

    <tabbar />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { showToast, showConfirmDialog } from "vant";
import Tabbar from "@/components/Tabbar.vue";

const router = useRouter();
const messageCount = ref(0);

// 功能网格项目（5列布局）
const functionItems = [
  { icon: "records", text: "接单库存", path: "/order-stats" },
  { icon: "gold-coin-o", text: "现金账户", path: null },
  { icon: "gold-coin-o", text: "现金账户", path: null },
  { icon: "manager-o", text: "我的工人", path: null },
  { icon: "coupon-o", text: "电子水票", path: null },

  { icon: "qr", text: "二维码", path: null },
  { icon: "setting-o", text: "门店设置", path: null },
  { icon: "bar-chart-o", text: "订单统计", path: "/order-stats" },
  { icon: "balance-o", text: "空桶统计", path: null },
  { icon: "pending-payment", text: "待核销", path: null },
  { icon: "chart-trending-o", text: "配送统计", path: "/delivery-stats" },
  { icon: "credit-pay", text: "实体卡", path: null },
  { icon: "gold-coin-o", text: "软件续费", path: null },
  { icon: "shop-o", text: "订货商城", path: null },
  { icon: "balance-list-o", text: "盘点统计", path: null },

  { icon: "chart-trending-o", text: "推广统计", path: null },
  { icon: "qr", text: "订水二维码", path: null },
  { icon: "records", text: "商品盘点", path: null },
  { icon: "records", text: "空桶盘点", path: null },

  { icon: "edit", text: "录入订单", path: null },
  { icon: "logistics", text: "我的配送", path: null },
  { icon: "location-o", text: "线路规划", path: null },
  { icon: "coupon-o", text: "优惠券管理", path: null },
  { icon: "clock-o", text: "周期订水", path: null },

  { icon: "balance-list-o", text: "财务中心", path: "/financial" },
  { icon: "shopping-cart-o", text: "订货商城(新)", path: null },
  { icon: "service-o", text: "代运营服务", path: null },
  { icon: "user-circle-o", text: "会员管理", path: null },
  { icon: "shop-collect-o", text: "天网中心", path: null },
];

const handleItemClick = (item) => {
  if (item.path) {
    router.push(item.path).catch(() => {
      showToast("该功能正在开发中");
    });
  } else {
    showToast("该功能正在开发中");
  }
};

// 退出登录
const handleLogout = () => {
  showConfirmDialog({
    title: "提示",
    message: "确定要退出登录吗？",
  })
    .then(() => {
      localStorage.removeItem("token");
      showToast("已退出登录");
      router.replace("/login");
    })
    .catch(() => {
      // 取消
    });
};
</script>

<style lang="scss" scoped>
.more-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 50px;
}

// 用户信息头部
.user-header {
  background: linear-gradient(135deg, #e8f4f8 0%, #d1e9f3 100%);
  padding: 20px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .user-avatar {
    .avatar-circle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #4e8ef7;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .user-info {
    flex: 1;

    .store-name {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 4px;
    }

    .status {
      font-size: 13px;
      color: #999;
      margin-bottom: 4px;
    }

    .user-detail {
      font-size: 12px;
      color: #666;
    }
  }

  .message-icon {
    cursor: pointer;
  }
}

// 天网接单横幅
.tianwang-banner {
  margin: 12px 16px;
  background: linear-gradient(135deg, #fff4e6 0%, #ffe8cc 100%);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;

  .banner-icon {
    color: #ff8c00;
  }

  .banner-text {
    flex: 1;
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }

  .apply-btn {
    background: white;
    color: #ff8c00;
    border: 1px solid #ff8c00;
    padding: 6px 16px;
    border-radius: 16px;
    font-size: 13px;
  }
}

// 快捷功能
.quick-functions {
  display: flex;
  justify-content: space-around;
  padding: 20px 16px;
  background: white;
  margin-bottom: 8px;

  .function-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    .icon-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      &.blue {
        background: linear-gradient(135deg, #4e8ef7 0%, #3b7cd9 100%);
      }

      &.pink {
        background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
      }

      &.green {
        background: linear-gradient(135deg, #00c9a7 0%, #00a389 100%);
      }

      &.orange {
        background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      }

      &.purple {
        background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
      }
    }

    span {
      font-size: 12px;
      color: #333;
    }
  }
}

// 功能网格（5列）
.function-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px 8px;
  padding: 20px 16px;
  background: white;
  margin-bottom: 8px;

  .grid-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    span {
      font-size: 11px;
      color: #333;
      text-align: center;
      line-height: 1.3;
    }

    &:active {
      opacity: 0.6;
    }
  }
}

// 设置列表
.settings-list {
  background: white;
  margin-bottom: 8px;

  :deep(.van-cell) {
    font-size: 15px;
    padding: 14px 16px;

    .van-cell__title {
      color: #333;
    }

    .van-cell__value {
      color: #4e8ef7;
    }
  }
}

// 退出登录
.logout-section {
  padding: 20px 16px;
  background: white;
  margin-bottom: 8px;

  .logout-btn {
    text-align: center;
    color: #4e8ef7;
    font-size: 15px;
    cursor: pointer;

    &:active {
      opacity: 0.6;
    }
  }
}

// 版权信息
.copyright {
  text-align: center;
  padding: 16px;
  font-size: 11px;
  color: #999;
  line-height: 1.8;

  p {
    margin: 0;
  }
}
</style>
