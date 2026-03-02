<template>
  <div class="stock-out-page page">
    <van-nav-bar title="出库管理" left-arrow fixed placeholder @click-left="router.back()">
      <template #right>
        <van-icon name="plus" size="20" @click="handleAddStockOut" />
      </template>
    </van-nav-bar>

    <!-- 出库记录列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="record in stockOutList"
          :key="record.id"
          class="stock-out-card"
        >
          <div class="stock-out-header">
            <span class="stock-out-no">出库单号：{{ record.stockOutNo }}</span>
            <van-tag type="danger">{{ record.type }}</van-tag>
          </div>

          <div class="stock-out-info">
            <div class="info-row">
              <span class="label">商品名称：</span>
              <span class="value">{{ record.productName }}</span>
            </div>
            <div class="info-row">
              <span class="label">出库数量：</span>
              <span class="value danger">-{{ record.quantity }} {{ record.unit }}</span>
            </div>
            <div class="info-row">
              <span class="label">出库仓库：</span>
              <span class="value">{{ record.warehouseName }}</span>
            </div>
            <div class="info-row" v-if="record.orderNo">
              <span class="label">关联订单：</span>
              <span class="value">{{ record.orderNo }}</span>
            </div>
            <div class="info-row">
              <span class="label">出库时间：</span>
              <span class="value">{{ record.stockOutTime }}</span>
            </div>
            <div class="info-row" v-if="record.operator">
              <span class="label">操作人员：</span>
              <span class="value">{{ record.operator }}</span>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && stockOutList.length === 0" class="empty-state">
          <van-empty description="暂无出库记录" />
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

const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const stockOutList = ref([])

// 模拟出库记录数据
const mockStockOutList = [
  {
    id: '1',
    stockOutNo: 'OUT20260302001',
    type: '销售出库',
    productName: '怡宝 饮用纯净水6L×3桶/箱',
    quantity: 3,
    unit: '箱',
    warehouseName: '总仓库',
    orderNo: '400447028470919304050',
    stockOutTime: '2026-03-02 10:30:00',
    operator: '张三'
  },
  {
    id: '2',
    stockOutNo: 'OUT20260302002',
    type: '销售出库',
    productName: '农夫山泉 饮用天然水4L×6桶/箱',
    quantity: 2,
    unit: '箱',
    warehouseName: '总仓库',
    orderNo: '400447028470919304051',
    stockOutTime: '2026-03-02 14:20:00',
    operator: '李四'
  },
  {
    id: '3',
    stockOutNo: 'OUT20260301001',
    type: '调拨出库',
    productName: '景田 百岁山饮用水5L×4桶/箱',
    quantity: 20,
    unit: '箱',
    warehouseName: '总仓库',
    orderNo: '',
    stockOutTime: '2026-03-01 16:15:00',
    operator: '王五'
  }
]

const onLoad = () => {
  setTimeout(() => {
    stockOutList.value = [...mockStockOutList]
    loading.value = false
    finished.value = true
  }, 500)
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  stockOutList.value = []
  onLoad()
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

const handleAddStockOut = () => {
  showToast('添加出库单功能开发中')
}
</script>

<style lang="scss" scoped>
.stock-out-page {
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

.stock-out-card {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #FF3B30;

  .stock-out-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 12px;

    .stock-out-no {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }

  .stock-out-info {
    .info-row {
      display: flex;
      padding: 6px 0;
      font-size: 14px;

      .label {
        color: #999;
        min-width: 80px;
      }

      .value {
        color: #333;
        flex: 1;

        &.danger {
          color: #FF3B30;
          font-weight: 500;
        }
      }
    }
  }
}

.empty-state {
  padding: 60px 20px;
}
</style>
