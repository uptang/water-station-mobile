<template>
  <div class="supplier-page page">
    <van-nav-bar title="供货商管理" left-arrow fixed placeholder @click-left="router.back()">
      <template #right>
        <van-icon name="plus" size="20" @click="router.push('/supplier/add')" />
      </template>
    </van-nav-bar>

    <div class="container">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="supplier in supplierList"
            :key="supplier.id"
            class="supplier-item card"
          >
            <div class="supplier-header">
              <h4>{{ supplier.name }}</h4>
              <div class="debt-info">
                <span>欠桶：<span class="value">{{ supplier.debtBarrel }}</span></span>
                <span>欠款：<span class="value text-danger">¥{{ supplier.debtMoney }}</span></span>
              </div>
            </div>

            <van-cell-group :border="false">
              <van-cell title="test" />
              <van-cell :title="supplier.address" />
            </van-cell-group>

            <div class="divider"></div>

            <div class="actions">
              <van-button size="small" @click="router.push(`/supplier/edit/${supplier.id}`)">
                修改
              </van-button>
              <van-button size="small" type="danger" @click="handleDelete(supplier.id)">
                删除
              </van-button>
            </div>
          </div>

          <div v-if="supplierList.length === 0" class="empty-state">
            <div class="empty-icon">📦</div>
            <p>没有更多了</p>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'

const router = useRouter()
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const supplierList = ref([
  {
    id: 1,
    name: '百一先到',
    debtBarrel: 0,
    debtMoney: 10.00,
    address: '111'
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

const handleDelete = (id) => {
  showConfirmDialog({
    title: '提示',
    message: '确定要删除该供货商吗？'
  }).then(() => {
    showToast('删除成功')
  })
}
</script>

<style lang="scss" scoped>
.supplier-page {
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

.supplier-item {
  margin-bottom: 12px;

  .supplier-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h4 {
      font-size: 16px;
    }

    .debt-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      font-size: 14px;

      .value {
        font-weight: bold;
        color: var(--primary-color);
      }
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

  .divider {
    height: 1px;
    background: #F0F0F0;
    margin: 12px 0;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>
