<template>
  <div class="message-page page">
    <van-nav-bar title="消息中心" left-arrow fixed placeholder @click-left="router.back()">
      <template #right>
        <van-icon name="delete-o" size="20" />
      </template>
    </van-nav-bar>

    <!-- 消息分类标签 -->
    <van-tabs v-model:active="activeTab">
      <van-tab title="全部" name="all" />
      <van-tab title="未读" name="unread" />
      <van-tab title="已读" name="read" />
    </van-tabs>

    <!-- 消息列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="暂无更多"
        @load="onLoad"
      >
        <div v-for="message in messageList" :key="message.id" class="message-item card">
          <div class="message-header">
            <h4>{{ message.title }}</h4>
            <span class="time">{{ message.time }}</span>
          </div>
          <p class="message-content">{{ message.content }}</p>
          <van-tag v-if="!message.isRead" type="danger" size="mini">未读</van-tag>
        </div>

        <div v-if="messageList.length === 0" class="empty-state">
          <div class="empty-icon">✉️</div>
          <p>暂无更多</p>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('all')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(true)
const messageList = ref([])

const onLoad = () => {
  loading.value = false
}

const onRefresh = () => {
  setTimeout(() => {
    refreshing.value = false
  }, 1000)
}
</script>

<style lang="scss" scoped>
.message-page {
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

.message-item {
  margin: 12px 16px;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.98);
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    h4 {
      font-size: 16px;
    }

    .time {
      font-size: 12px;
      color: var(--text-secondary);
    }
  }

  .message-content {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 8px;
  }
}
</style>
