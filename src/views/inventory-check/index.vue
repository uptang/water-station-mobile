<template>
  <div class="inventory-check-page page">
    <van-nav-bar title="盘点管理" left-arrow fixed placeholder @click-left="router.back()">
      <template #right>
        <van-icon name="plus" size="20" @click="handleNewCheck" />
      </template>
    </van-nav-bar>

    <!-- 盘点记录列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="record in checkList"
          :key="record.id"
          class="check-card"
        >
          <div class="check-header">
            <span class="check-no">盘点单号：{{ record.checkNo }}</span>
            <van-tag :type="getStatusType(record.status)">{{ record.status }}</van-tag>
          </div>

          <div class="check-info">
            <div class="info-row">
              <span class="label">盘点仓库：</span>
              <span class="value">{{ record.warehouseName }}</span>
            </div>
            <div class="info-row">
              <span class="label">盘点时间：</span>
              <span class="value">{{ record.checkTime }}</span>
            </div>
            <div class="info-row">
              <span class="label">盘点人员：</span>
              <span class="value">{{ record.operator }}</span>
            </div>
            <div class="info-row">
              <span class="label">盘点商品：</span>
              <span class="value">{{ record.productCount }}种</span>
            </div>
            <div class="info-row" v-if="record.status === '已完成'">
              <span class="label">差异情况：</span>
              <span class="value" :class="getDifferenceClass(record)">
                盈：{{ record.surplus }}件 / 亏：{{ record.loss }}件
              </span>
            </div>
          </div>

          <div class="check-actions" v-if="record.status !== '已完成'">
            <van-button size="small" plain @click="viewDetail(record)">
              查看详情
            </van-button>
            <van-button
              size="small"
              type="primary"
              plain
              @click="continueCheck(record)"
              v-if="record.status === '盘点中'"
            >
              继续盘点
            </van-button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && checkList.length === 0" class="empty-state">
          <van-empty description="暂无盘点记录" />
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
const checkList = ref([])

// 模拟盘点记录数据
const mockCheckList = [
  {
    id: '1',
    checkNo: 'CHK20260302001',
    status: '已完成',
    warehouseName: '总仓库',
    checkTime: '2026-03-02 09:00:00',
    operator: '张三',
    productCount: 25,
    surplus: 5,
    loss: 2
  },
  {
    id: '2',
    checkNo: 'CHK20260301001',
    status: '盘点中',
    warehouseName: '分仓库-邗江',
    checkTime: '2026-03-01 14:30:00',
    operator: '李四',
    productCount: 15,
    surplus: 0,
    loss: 0
  },
  {
    id: '3',
    checkNo: 'CHK20260228001',
    status: '已完成',
    warehouseName: '总仓库',
    checkTime: '2026-02-28 10:00:00',
    operator: '王五',
    productCount: 25,
    surplus: 3,
    loss: 8
  }
]

const onLoad = () => {
  setTimeout(() => {
    checkList.value = [...mockCheckList]
    loading.value = false
    finished.value = true
  }, 500)
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  checkList.value = []
  onLoad()
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

const getStatusType = (status) => {
  const statusMap = {
    '已完成': 'success',
    '盘点中': 'warning',
    '已取消': 'default'
  }
  return statusMap[status] || 'default'
}

const getDifferenceClass = (record) => {
  if (record.surplus > record.loss) return 'surplus'
  if (record.loss > record.surplus) return 'loss'
  return ''
}

const handleNewCheck = () => {
  showToast('新建盘点功能开发中')
}

const viewDetail = (record) => {
  showToast('查看详情功能开发中')
}

const continueCheck = (record) => {
  showToast('继续盘点功能开发中')
}
</script>

<style lang="scss" scoped>
.inventory-check-page {
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

.check-card {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #FF8C00;

  .check-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 12px;

    .check-no {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }
  }

  .check-info {
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

        &.surplus {
          color: #09BB07;
          font-weight: 500;
        }

        &.loss {
          color: #FF3B30;
          font-weight: 500;
        }
      }
    }
  }

  .check-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f5f5f5;
  }
}

.empty-state {
  padding: 60px 20px;
}
</style>
