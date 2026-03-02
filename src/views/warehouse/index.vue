<template>
  <div class="warehouse-page page">
    <van-nav-bar title="仓库管理" left-arrow fixed placeholder @click-left="router.back()">
      <template #right>
        <van-icon name="plus" size="20" @click="handleAddWarehouse" />
      </template>
    </van-nav-bar>

    <!-- 仓库列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="warehouse in warehouseList"
          :key="warehouse.id"
          class="warehouse-card"
        >
          <div class="warehouse-header">
            <div class="warehouse-name">
              <van-icon name="shop-o" size="20" color="#4E8EF7" />
              <span>{{ warehouse.name }}</span>
            </div>
            <van-tag :type="warehouse.isDefault ? 'primary' : 'default'">
              {{ warehouse.isDefault ? '默认仓库' : '普通仓库' }}
            </van-tag>
          </div>

          <div class="warehouse-info">
            <div class="info-row">
              <van-icon name="location-o" />
              <span>{{ warehouse.address }}</span>
            </div>
            <div class="info-row">
              <van-icon name="manager-o" />
              <span>负责人：{{ warehouse.manager }}</span>
            </div>
            <div class="info-row">
              <van-icon name="phone-o" />
              <span>{{ warehouse.phone }}</span>
            </div>
          </div>

          <div class="warehouse-stats">
            <div class="stat-item">
              <div class="stat-label">商品种类</div>
              <div class="stat-value">{{ warehouse.productTypes }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">总库存量</div>
              <div class="stat-value">{{ warehouse.totalStock }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">库存金额</div>
              <div class="stat-value">¥{{ warehouse.stockValue }}</div>
            </div>
          </div>

          <div class="warehouse-actions">
            <van-button size="small" plain @click="viewStock(warehouse)">
              查看库存
            </van-button>
            <van-button size="small" plain @click="editWarehouse(warehouse)">
              编辑
            </van-button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && warehouseList.length === 0" class="empty-state">
          <van-empty description="暂无仓库" />
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
const warehouseList = ref([])

// 模拟仓库数据
const mockWarehouses = [
  {
    id: '1',
    name: '总仓库',
    address: '江苏省扬州市广陵区某某工业园区A栋',
    manager: '张三',
    phone: '13800138000',
    isDefault: true,
    productTypes: 25,
    totalStock: 1580,
    stockValue: '58900.00'
  },
  {
    id: '2',
    name: '分仓库-邗江',
    address: '江苏省扬州市邗江区某某街道123号',
    manager: '李四',
    phone: '13900139000',
    isDefault: false,
    productTypes: 15,
    totalStock: 680,
    stockValue: '25600.00'
  }
]

const onLoad = () => {
  setTimeout(() => {
    warehouseList.value = [...mockWarehouses]
    loading.value = false
    finished.value = true
  }, 500)
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  warehouseList.value = []
  onLoad()
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

const handleAddWarehouse = () => {
  showToast('添加仓库功能开发中')
}

const viewStock = (warehouse) => {
  router.push('/goods')
}

const editWarehouse = (warehouse) => {
  showToast('编辑仓库功能开发中')
}
</script>

<style lang="scss" scoped>
.warehouse-page {
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

.warehouse-card {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .warehouse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f5f5f5;

    .warehouse-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }

  .warehouse-info {
    margin-bottom: 16px;

    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 0;
      font-size: 14px;
      color: #666;

      .van-icon {
        color: #999;
        font-size: 16px;
      }
    }
  }

  .warehouse-stats {
    display: flex;
    justify-content: space-around;
    padding: 16px 0;
    margin-bottom: 16px;
    background: #F7F8FA;
    border-radius: 8px;

    .stat-item {
      text-align: center;

      .stat-label {
        font-size: 13px;
        color: #999;
        margin-bottom: 8px;
      }

      .stat-value {
        font-size: 18px;
        font-weight: bold;
        color: #333;
      }
    }
  }

  .warehouse-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

.empty-state {
  padding: 60px 20px;
}
</style>
