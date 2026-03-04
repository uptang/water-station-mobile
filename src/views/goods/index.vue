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

    <!-- 出入库弹窗 -->
    <van-popup v-model:show="showStockDialog" position="bottom" round>
      <div class="stock-dialog">
        <div class="dialog-header">
          <span class="close-btn" @click="closeStockDialog">取消</span>
          <span class="dialog-title">{{ stockType === 'in' ? '入库' : '出库' }}</span>
          <span class="submit-btn" @click="confirmStock">确认</span>
        </div>

        <div class="dialog-content">
          <div class="goods-summary">
            <van-image
              width="60"
              height="60"
              fit="cover"
              :src="currentGoods?.image"
              radius="8"
            />
            <div class="summary-info">
              <div class="goods-name">{{ currentGoods?.name }}</div>
              <div class="current-stock">
                当前库存：
                <span :class="currentGoods?.stock < 10 ? 'low' : 'normal'">
                  {{ currentGoods?.stock }}
                </span>
                {{ currentGoods?.unit }}
              </div>
            </div>
          </div>

          <van-field
            v-model="stockQuantity"
            type="digit"
            :label="stockType === 'in' ? '入库数量' : '出库数量'"
            placeholder="请输入数量"
            required
          />

          <van-field
            v-model="stockRemark"
            type="textarea"
            label="备注"
            placeholder="请输入备注（选填）"
            rows="3"
            maxlength="100"
            show-word-limit
          />
        </div>
      </div>
    </van-popup>
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
const showStockDialog = ref(false)
const stockType = ref('in') // 'in' 或 'out'
const currentGoods = ref(null)
const stockQuantity = ref('')
const stockRemark = ref('')

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
  currentGoods.value = goods
  stockType.value = 'in'
  stockQuantity.value = ''
  stockRemark.value = ''
  showStockDialog.value = true
}

const handleStockOut = (goods) => {
  currentGoods.value = goods
  stockType.value = 'out'
  stockQuantity.value = ''
  stockRemark.value = ''
  showStockDialog.value = true
}

const closeStockDialog = () => {
  showStockDialog.value = false
  currentGoods.value = null
  stockQuantity.value = ''
  stockRemark.value = ''
}

const confirmStock = () => {
  const quantity = parseInt(stockQuantity.value)

  if (!stockQuantity.value || quantity <= 0) {
    showToast('请输入正确的数量')
    return
  }

  if (stockType.value === 'out' && quantity > currentGoods.value.stock) {
    showToast('出库数量不能大于当前库存')
    return
  }

  // 更新库存
  const goods = goodsList.value.find(g => g.id === currentGoods.value.id)
  if (goods) {
    if (stockType.value === 'in') {
      goods.stock += quantity
      showSuccessToast(`入库成功，当前库存：${goods.stock}${goods.unit}`)
    } else {
      goods.stock -= quantity
      showSuccessToast(`出库成功，当前库存：${goods.stock}${goods.unit}`)
    }
  }

  closeStockDialog()
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

// 出入库弹窗
.stock-dialog {
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    background: white;

    .close-btn,
    .submit-btn {
      font-size: 15px;
      color: #4E8EF7;
      cursor: pointer;
      padding: 4px 8px;
    }

    .dialog-title {
      font-size: 17px;
      font-weight: 500;
      color: #333;
    }
  }

  .dialog-content {
    padding: 16px;

    .goods-summary {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #f7f8fa;
      border-radius: 8px;
      margin-bottom: 16px;

      .summary-info {
        flex: 1;

        .goods-name {
          font-size: 15px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }

        .current-stock {
          font-size: 14px;
          color: #666;

          span.normal {
            color: #09BB07;
            font-weight: bold;
          }

          span.low {
            color: #FF3B30;
            font-weight: bold;
          }
        }
      }
    }

    :deep(.van-field) {
      margin-bottom: 12px;
    }

    :deep(.van-field__label) {
      width: 85px;
      color: #333;
      font-size: 15px;
    }
  }
}
</style>
