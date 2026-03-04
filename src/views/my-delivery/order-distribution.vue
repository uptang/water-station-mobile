<template>
  <div class="order-distribution-page page">
    <van-nav-bar title="订单分布" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="map-container">
      <div class="map-placeholder">
        <div class="map-hint">地图加载中...</div>
        <!-- 这里可以集成第三方地图API，如高德地图、百度地图等 -->
      </div>

      <!-- 客服悬浮按钮 -->
      <div class="customer-service-btn">
        <van-icon name="service-o" size="24" color="#fff" />
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="bottom-status">
      <div class="status-item warning" @click="filterByStatus('warning')">
        <van-icon name="warning" size="20" color="#FF3B30" />
        <span>警告中</span>
      </div>
      <div class="divider"></div>
      <div class="status-item waiting" @click="filterByStatus('waiting')">
        <van-icon name="location" size="20" color="#4E8EF7" />
        <span>待配送</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 筛选订单状态
const filterByStatus = (status) => {
  if (status === 'warning') {
    showToast('显示警告订单')
  } else if (status === 'waiting') {
    showToast('显示待配送订单')
  }
  // 这里可以根据状态筛选地图上的订单标记
}

// 这里可以添加地图初始化逻辑
// 例如：
// - 加载地图API
// - 标记订单位置
// - 添加点击事件等
</script>

<style lang="scss" scoped>
.order-distribution-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

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

.map-container {
  flex: 1;
  position: relative;
  overflow: hidden;

  .map-placeholder {
    width: 100%;
    height: 100%;
    background: #e5e5e5;
    display: flex;
    align-items: center;
    justify-content: center;

    .map-hint {
      font-size: 14px;
      color: #999;
    }
  }

  // 客服悬浮按钮
  .customer-service-btn {
    position: absolute;
    right: 16px;
    bottom: 80px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s;

    &:active {
      transform: scale(0.95);
    }
  }
}

// 底部状态栏
.bottom-status {
  display: flex;
  align-items: center;
  background: white;
  padding: 12px 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);

  .status-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px 0;
    transition: background 0.3s;

    &:active {
      background: #f5f5f5;
    }

    span {
      font-size: 15px;
      color: #333;
      font-weight: 500;
    }

    &.warning {
      span {
        color: #FF3B30;
      }
    }

    &.waiting {
      span {
        color: #4E8EF7;
      }
    }
  }

  .divider {
    width: 1px;
    height: 30px;
    background: #e5e5e5;
  }
}
</style>
