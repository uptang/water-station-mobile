<template>
  <div class="worker-page page">
    <van-nav-bar title="工人列表" left-arrow fixed placeholder @click-left="router.back()">
      <template #right>
        <span class="add-account-btn" @click="handleAddWorker">添加账号</span>
      </template>
    </van-nav-bar>

    <div class="container">
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stats-card" @click="showToast('配送统计')">
          <van-icon name="orders-o" size="32" color="#4E8EF7" />
          <span class="card-text">配送统计</span>
        </div>
      </div>

      <!-- 工人列表表格 -->
      <div class="worker-table">
        <!-- 表头 -->
        <div class="table-header">
          <div class="header-cell name">姓名</div>
          <div class="header-cell role">身份</div>
          <div class="header-cell phone">电话</div>
          <div class="header-cell action">操作</div>
        </div>

        <!-- 表格内容 -->
        <div class="table-body">
          <div v-for="worker in workerList" :key="worker.id" class="table-row">
            <div class="body-cell name">{{ worker.name }}</div>
            <div class="body-cell role">{{ worker.role }}</div>
            <div class="body-cell phone">{{ worker.phone }}</div>
            <div class="body-cell action">
              <span class="action-link" @click="handleSettings(worker)">设置</span>
              <span class="action-divider">|</span>
              <span class="action-link" @click="handleResetPassword(worker)">重置密码</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()

// 工人列表
const workerList = ref([
  {
    id: 1,
    name: '宋再洋',
    role: '老板',
    phone: '17696837781'
  }
])

// 添加工人
const handleAddWorker = () => {
  router.push('/worker-add')
}

// 设置
const handleSettings = (worker) => {
  router.push(`/worker-settings/${worker.id}`)
}

// 重置密码
const handleResetPassword = (worker) => {
  showConfirmDialog({
    title: '重置密码',
    message: `确定要重置 ${worker.name} 的密码吗？`,
  })
    .then(() => {
      showToast('密码重置成功')
    })
    .catch(() => {
      // 取消
    })
}
</script>

<style lang="scss" scoped>
.worker-page {
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

    .add-account-btn {
      font-size: 14px;
      color: #4E8EF7;
      cursor: pointer;
    }
  }
}

.container {
  padding: 0 12px 20px;
}

// 统计卡片
.stats-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  .stats-card {
    flex: 1;
    background: white;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s;

    &:active {
      opacity: 0.8;
    }

    .card-text {
      font-size: 14px;
      color: #333;
    }
  }
}

// 工人列表表格
.worker-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;

  .table-header {
    display: flex;
    background: #f8f8f8;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #666;

    .header-cell {
      &.name {
        flex: 0 0 80px;
      }

      &.role {
        flex: 0 0 80px;
      }

      &.phone {
        flex: 1;
      }

      &.action {
        flex: 0 0 120px;
        text-align: right;
      }
    }
  }

  .table-body {
    .table-row {
      display: flex;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;

      &:last-child {
        border-bottom: none;
      }

      .body-cell {
        display: flex;
        align-items: center;
        color: #333;

        &.name {
          flex: 0 0 80px;
        }

        &.role {
          flex: 0 0 80px;
        }

        &.phone {
          flex: 1;
        }

        &.action {
          flex: 0 0 120px;
          justify-content: flex-end;

          .action-link {
            color: #4E8EF7;
            cursor: pointer;

            &:active {
              opacity: 0.6;
            }
          }

          .action-divider {
            color: #ddd;
            margin: 0 8px;
          }
        }
      }
    }
  }
}
</style>
