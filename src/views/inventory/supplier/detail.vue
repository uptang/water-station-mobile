<template>
  <div class="supplier-detail-page page">
    <van-nav-bar title="供货商欠桶详情" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="item in detailList" :key="item.id" class="detail-item card">
            <div class="detail-header">
              <span class="date">{{ item.date }}</span>
              <span>欠桶：<span class="value">{{ item.debtBarrel }}</span></span>
            </div>
            <van-cell-group :border="false">
              <van-cell title="手动记账" />
              <van-cell title="备注：" :value="item.note" />
            </van-cell-group>
          </div>

          <div v-if="detailList.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <p>没有更多了</p>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const detailList = ref([
  {
    id: 1,
    date: '2026-02-28 18:32:01',
    debtBarrel: 0,
    changeValue: 0,
    note: '666'
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
</script>

<style lang="scss" scoped>
.supplier-detail-page {
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

.detail-item {
  margin-bottom: 12px;

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);

    .date {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .value {
      font-weight: bold;
      color: var(--primary-color);
    }
  }

  :deep(.van-cell-group) {
    background: transparent;
  }

  :deep(.van-cell) {
    padding: 6px 0;

    &::after {
      border-bottom: none;
    }
  }
}
</style>
