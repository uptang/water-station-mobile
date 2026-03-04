<template>
  <div class="worker-settings-page page">
    <van-nav-bar title="设置" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <van-cell-group>
        <van-cell title="代班设置" is-link @click="router.push(`/worker-substitute/${workerId}`)" />
        <van-cell title="配送设置" is-link @click="router.push(`/worker-delivery-users/${workerId}`)" />
        <van-cell title="账号设置" is-link @click="router.push(`/worker-edit/${workerId}`)" />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 从路由参数获取工人ID
const workerId = computed(() => route.params.id)
</script>

<style lang="scss" scoped>
.worker-settings-page {
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

.container {
  padding: 12px;
}

:deep(.van-cell-group) {
  background: white;
  border-radius: 12px;
  overflow: hidden;

  .van-cell {
    padding: 16px;
    font-size: 15px;

    .van-cell__title {
      color: #333;
    }
  }
}
</style>
