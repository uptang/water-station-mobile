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

    <!-- 快捷功能（4个彩色圆形图标）-->
    <div class="quick-functions">
      <div class="function-item" @click="router.push('/user-management')">
        <div class="icon-circle blue">
          <van-icon name="friends-o" size="24" color="#fff" />
        </div>
        <span>我的用户</span>
      </div>
      <div class="function-item" @click="router.push('/worker-management')">
        <div class="icon-circle pink">
          <van-icon name="manager-o" size="24" color="#fff" />
        </div>
        <span>我的工人</span>
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

    <!-- 退出登录 -->
    <div class="logout-section">
      <div class="logout-btn" @click="handleLogout">退出登录</div>
    </div>

    <!-- 版权信息 -->
    <div class="copyright">
      <p>APP备案编号：渝ICP备20210319号-4A</p>
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
  { icon: "manager-o", text: "我的工人", path: "/worker-management" },
  { icon: "setting-o", text: "门店设置", path: "/store-settings" },
  { icon: "bar-chart-o", text: "订单统计", path: "/order-stats" },
  { icon: "balance-o", text: "空桶统计", path: "/barrel-stats" },
  { icon: "pending-payment", text: "待核销", path: "/verification-stats" },

  { icon: "chart-trending-o", text: "配送统计", path: "/delivery-stats" },
  { icon: "edit", text: "录入订单", path: "/order-manual" },
  { icon: "logistics", text: "我的配送", path: "/my-delivery" },
  { icon: "location-o", text: "线路规划", path: "/route-planning" },
  { icon: "setting-o", text: "平台配置", path: "/platform-config" },
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
