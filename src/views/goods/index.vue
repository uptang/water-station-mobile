<template>
  <div class="goods-page page">
    <van-nav-bar title="商品库存" left-arrow fixed placeholder @click-left="router.back()" />

    <!-- 搜索栏 -->
    <div class="search-section">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索商品名称或编号"
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
            <van-tag v-if="goods.stock < 10" type="danger" class="stock-tag">
              库存不足
            </van-tag>
          </div>

          <div class="goods-info">
            <div class="goods-name">{{ goods.name }}</div>
            <div class="goods-spec">{{ goods.spec }}</div>
            <div class="goods-meta">
              <span class="goods-code">编号：{{ goods.code }}</span>
            </div>
            <div class="stock-info">
              <span class="stock-label">库存：</span>
              <span class="stock-value" :class="{ 'low-stock': goods.stock < 10 }">
                {{ goods.stock }}
              </span>
              <span class="unit">{{ goods.unit }}</span>
            </div>
          </div>

          <div class="goods-actions">
            <van-button
              size="small"
              icon="plus"
              plain
              @click="handleStockIn(goods)"
            >
              入库
            </van-button>
            <van-button
              size="small"
              icon="minus"
              plain
              @click="handleStockOut(goods)"
            >
              出库
            </van-button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && goodsList.length === 0" class="empty-state">
          <van-empty description="暂无商品库存" />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const searchKeyword = ref('')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const goodsList = ref([])

// 模拟商品库存数据
const mockGoods = [
  {
    id: '1',
    name: '怡宝 饮用纯净水',
    spec: '6L×3桶/箱',
    code: 'GD20260001',
    stock: 156,
    unit: '箱',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '2',
    name: '农夫山泉 饮用天然水',
    spec: '4L×6桶/箱',
    code: 'GD20260002',
    stock: 8,
    unit: '箱',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '3',
    name: '景田 百岁山饮用水',
    spec: '5L×4桶/箱',
    code: 'GD20260003',
    stock: 89,
    unit: '箱',
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

const handleStockIn = (goods) => {
  showToast('入库功能开发中')
}

const handleStockOut = (goods) => {
  showToast('出库功能开发中')
}
</script>

<style lang="scss" scoped>
.goods-page {
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

    .stock-tag {
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
      align-items: baseline;
      font-size: 14px;

      .stock-label {
        color: #666;
      }

      .stock-value {
        font-size: 20px;
        font-weight: bold;
        color: #09BB07;
        margin: 0 4px;

        &.low-stock {
          color: #FF3B30;
        }
      }

      .unit {
        color: #666;
      }
    }
  }

  .goods-actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }
}

.empty-state {
  padding: 60px 20px;
}
</style>
