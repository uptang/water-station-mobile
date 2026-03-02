<template>
  <div class="purchase-page page">
    <van-nav-bar title="进货管理" left-arrow fixed placeholder @click-left="router.back()">
      <template #right>
        <van-icon name="plus" size="20" @click="handleAddPurchase" />
      </template>
    </van-nav-bar>

    <!-- 筛选标签 -->
    <van-tabs v-model:active="activeStatus" @change="handleStatusChange">
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="待入库" name="pending"></van-tab>
      <van-tab title="已入库" name="completed"></van-tab>
      <van-tab title="已取消" name="cancelled"></van-tab>
    </van-tabs>

    <!-- 进货列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="purchase in purchaseList"
          :key="purchase.id"
          class="purchase-card"
          @click="goDetail(purchase.id)"
        >
          <div class="purchase-header">
            <span class="purchase-no">进货单号：{{ purchase.purchaseNo }}</span>
            <van-tag :type="getStatusType(purchase.status)">{{ purchase.statusText }}</van-tag>
          </div>

          <div class="purchase-info">
            <div class="info-row">
              <span class="label">供货商：</span>
              <span class="value">{{ purchase.supplierName }}</span>
            </div>
            <div class="info-row">
              <span class="label">进货时间：</span>
              <span class="value">{{ purchase.purchaseTime }}</span>
            </div>
            <div class="info-row">
              <span class="label">商品数量：</span>
              <span class="value">{{ purchase.productCount }}种商品</span>
            </div>
          </div>

          <div class="purchase-footer">
            <div class="purchase-amount">
              <span class="label">总金额：</span>
              <span class="amount">¥{{ purchase.totalAmount }}</span>
            </div>
            <div class="purchase-actions">
              <van-button
                v-if="purchase.status === 'pending'"
                size="small"
                type="primary"
                @click.stop="handleStockIn(purchase)"
              >
                入库
              </van-button>
              <van-button size="small" plain @click.stop="goDetail(purchase.id)">
                查看详情
              </van-button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && purchaseList.length === 0" class="empty-state">
          <van-empty description="暂无进货记录" />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'

const router = useRouter()

const activeStatus = ref('all')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const purchaseList = ref([])

// 模拟进货数据
const mockPurchases = [
  {
    id: '1',
    purchaseNo: 'PUR20260301001',
    supplierName: '百一先到',
    purchaseTime: '2026-03-01 10:30:00',
    productCount: 3,
    totalAmount: '1280.00',
    status: 'completed',
    statusText: '已入库'
  },
  {
    id: '2',
    purchaseNo: 'PUR20260302001',
    supplierName: '怡宝供应商',
    purchaseTime: '2026-03-02 14:20:00',
    productCount: 5,
    totalAmount: '3560.00',
    status: 'pending',
    statusText: '待入库'
  }
]

const onLoad = () => {
  setTimeout(() => {
    purchaseList.value = [...mockPurchases]
    loading.value = false
    finished.value = true
  }, 500)
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  purchaseList.value = []
  onLoad()
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

const handleStatusChange = () => {
  purchaseList.value = []
  finished.value = false
  onLoad()
}

const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    completed: 'success',
    cancelled: 'default'
  }
  return typeMap[status] || 'default'
}

const handleAddPurchase = () => {
  showToast('添加进货单功能开发中')
}

const handleStockIn = (purchase) => {
  showSuccessToast('入库成功')
  purchase.status = 'completed'
  purchase.statusText = '已入库'
}

const goDetail = (id) => {
  showToast('进货详情功能开发中')
}
</script>

<style lang="scss" scoped>
.purchase-page {
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

.purchase-card {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .purchase-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 12px;

    .purchase-no {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }

  .purchase-info {
    margin-bottom: 12px;

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
      }
    }
  }

  .purchase-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid #f5f5f5;

    .purchase-amount {
      .label {
        font-size: 13px;
        color: #666;
      }

      .amount {
        font-size: 18px;
        font-weight: bold;
        color: #FF3B30;
        margin-left: 4px;
      }
    }

    .purchase-actions {
      display: flex;
      gap: 8px;
    }
  }
}

.empty-state {
  padding: 60px 20px;
}
</style>
