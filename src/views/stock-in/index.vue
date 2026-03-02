<template>
  <div class="stock-in-page page">
    <van-nav-bar title="入库管理" left-arrow fixed placeholder @click-left="router.back()">
      <template #right>
        <van-icon name="plus" size="20" @click="handleAddStockIn" />
      </template>
    </van-nav-bar>

    <!-- 入库记录列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="record in stockInList"
          :key="record.id"
          class="stock-in-card"
        >
          <div class="stock-in-header">
            <span class="stock-in-no">入库单号：{{ record.stockInNo }}</span>
            <van-tag type="success">{{ record.type }}</van-tag>
          </div>

          <div class="stock-in-info">
            <div class="info-row">
              <span class="label">商品名称：</span>
              <span class="value">{{ record.productName }}</span>
            </div>
            <div class="info-row">
              <span class="label">入库数量：</span>
              <span class="value primary">+{{ record.quantity }} {{ record.unit }}</span>
            </div>
            <div class="info-row">
              <span class="label">入库仓库：</span>
              <span class="value">{{ record.warehouseName }}</span>
            </div>
            <div class="info-row">
              <span class="label">入库时间：</span>
              <span class="value">{{ record.stockInTime }}</span>
            </div>
            <div class="info-row" v-if="record.operator">
              <span class="label">操作人员：</span>
              <span class="value">{{ record.operator }}</span>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && stockInList.length === 0" class="empty-state">
          <van-empty description="暂无入库记录" />
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
const stockInList = ref([])

// 模拟入库记录数据
const mockStockInList = [
  {
    id: '1',
    stockInNo: 'IN20260302001',
    type: '采购入库',
    productName: '怡宝 饮用纯净水6L×3桶/箱',
    quantity: 50,
    unit: '箱',
    warehouseName: '总仓库',
    stockInTime: '2026-03-02 14:30:00',
    operator: '张三'
  },
  {
    id: '2',
    stockInNo: 'IN20260302002',
    type: '退货入库',
    productName: '农夫山泉 饮用天然水4L×6桶/箱',
    quantity: 5,
    unit: '箱',
    warehouseName: '总仓库',
    stockInTime: '2026-03-02 16:20:00',
    operator: '李四'
  },
  {
    id: '3',
    stockInNo: 'IN20260301001',
    type: '采购入库',
    productName: '景田 百岁山饮用水5L×4桶/箱',
    quantity: 80,
    unit: '箱',
    warehouseName: '分仓库-邗江',
    stockInTime: '2026-03-01 10:15:00',
    operator: '王五'
  }
]

const onLoad = () => {
  setTimeout(() => {
    stockInList.value = [...mockStockInList]
    loading.value = false
    finished.value = true
  }, 500)
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  stockInList.value = []
  onLoad()
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

const handleAddStockIn = () => {
  showToast('添加入库单功能开发中')
}
</script>

<style lang="scss" scoped>
.stock-in-page {
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

.stock-in-card {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #09BB07;

  .stock-in-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 12px;

    .stock-in-no {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }

  .stock-in-info {
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

        &.primary {
          color: #09BB07;
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
