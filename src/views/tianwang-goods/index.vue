<template>
  <div class="tianwang-goods-page page">
    <van-nav-bar title="天网商品库存" left-arrow fixed placeholder @click-left="router.back()" />

    <!-- 搜索栏 -->
    <div class="search-section">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索天网商品"
        @search="handleSearch"
      />
    </div>

    <!-- 商品列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="goods in goodsList"
          :key="goods.id"
          class="goods-card"
        >
          <div class="goods-image">
            <van-image
              width="80"
              height="80"
              fit="cover"
              :src="goods.image"
              radius="8"
            />
            <van-tag v-if="goods.syncStatus === '已同步'" type="success" class="sync-tag">
              已同步
            </van-tag>
            <van-tag v-else type="warning" class="sync-tag">
              待同步
            </van-tag>
          </div>

          <div class="goods-info">
            <div class="goods-name">{{ goods.name }}</div>
            <div class="goods-spec">{{ goods.spec }}</div>
            <div class="goods-meta">
              <span class="goods-code">天网编号：{{ goods.tianwangCode }}</span>
            </div>
            <div class="stock-info">
              <div class="stock-item">
                <span class="label">天网库存：</span>
                <span class="value tianwang">{{ goods.tianwangStock }}</span>
                <span class="unit">{{ goods.unit }}</span>
              </div>
              <div class="stock-item">
                <span class="label">本地库存：</span>
                <span class="value local" :class="{ 'diff': goods.tianwangStock !== goods.localStock }">
                  {{ goods.localStock }}
                </span>
                <span class="unit">{{ goods.unit }}</span>
              </div>
            </div>
            <div class="last-sync" v-if="goods.lastSyncTime">
              <van-icon name="clock-o" size="12" color="#999" />
              <span>最后同步：{{ goods.lastSyncTime }}</span>
            </div>
          </div>

          <div class="goods-actions">
            <van-button
              size="small"
              icon="replay"
              plain
              @click="handleSync(goods)"
            >
              同步
            </van-button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && goodsList.length === 0" class="empty-state">
          <van-empty description="暂无天网商品" />
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 底部操作栏 -->
    <div class="bottom-actions">
      <van-button type="primary" block @click="handleSyncAll">
        批量同步库存
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'

const router = useRouter()

const searchKeyword = ref('')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const goodsList = ref([])

// 模拟天网商品库存数据
const mockGoods = [
  {
    id: '1',
    name: '怡宝 饮用纯净水',
    spec: '6L×3桶/箱',
    tianwangCode: 'TW20260001',
    tianwangStock: 156,
    localStock: 156,
    unit: '箱',
    syncStatus: '已同步',
    lastSyncTime: '2026-03-02 14:30:00',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '2',
    name: '农夫山泉 饮用天然水',
    spec: '4L×6桶/箱',
    tianwangCode: 'TW20260002',
    tianwangStock: 95,
    localStock: 89,
    unit: '箱',
    syncStatus: '待同步',
    lastSyncTime: '2026-03-02 10:20:00',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '3',
    name: '景田 百岁山饮用水',
    spec: '5L×4桶/箱',
    tianwangCode: 'TW20260003',
    tianwangStock: 120,
    localStock: 89,
    unit: '箱',
    syncStatus: '待同步',
    lastSyncTime: '2026-03-01 16:15:00',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '4',
    name: '娃哈哈 纯净水',
    spec: '5L×4桶/箱',
    tianwangCode: 'TW20260004',
    tianwangStock: 68,
    localStock: 68,
    unit: '箱',
    syncStatus: '已同步',
    lastSyncTime: '2026-03-02 09:00:00',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  }
]

const onLoad = () => {
  setTimeout(() => {
    goodsList.value = [...mockGoods]
    loading.value = false
    finished.value = true
  }, 500)
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  goodsList.value = []
  onLoad()
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

const handleSearch = () => {
  if (!searchKeyword.value) {
    showToast('请输入搜索关键词')
    return
  }
  showToast('搜索功能开发中')
}

const handleSync = (goods) => {
  showToast('正在同步...')
  // 模拟同步
  setTimeout(() => {
    goods.localStock = goods.tianwangStock
    goods.syncStatus = '已同步'
    goods.lastSyncTime = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-')
    showSuccessToast('同步成功')
  }, 1000)
}

const handleSyncAll = () => {
  showToast('正在批量同步...')
  // 模拟批量同步
  setTimeout(() => {
    goodsList.value.forEach(goods => {
      goods.localStock = goods.tianwangStock
      goods.syncStatus = '已同步'
      goods.lastSyncTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-')
    })
    showSuccessToast('批量同步成功')
  }, 1500)
}
</script>

<style lang="scss" scoped>
.tianwang-goods-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 60px;

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

.search-section {
  background: white;
  padding: 12px 16px;
}

.goods-card {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .goods-image {
    position: relative;

    .sync-tag {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 10px;
    }
  }

  .goods-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .goods-name {
      font-size: 15px;
      font-weight: 500;
      color: #333;
    }

    .goods-spec {
      font-size: 13px;
      color: #999;
    }

    .goods-meta {
      font-size: 12px;
      color: #999;
    }

    .stock-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 4px;

      .stock-item {
        display: flex;
        align-items: baseline;
        font-size: 13px;

        .label {
          color: #666;
          min-width: 70px;
        }

        .value {
          font-size: 16px;
          font-weight: bold;
          margin: 0 4px;

          &.tianwang {
            color: #4E8EF7;
          }

          &.local {
            color: #09BB07;

            &.diff {
              color: #FF8C00;
            }
          }
        }

        .unit {
          color: #666;
        }
      }
    }

    .last-sync {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }
  }

  .goods-actions {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.empty-state {
  padding: 60px 20px;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}
</style>
