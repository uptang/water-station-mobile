<template>
  <div class="worker-delivery-users-page page">
    <van-nav-bar title="配送用户" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <!-- 搜索区域 -->
      <div class="search-section">
        <van-search
          v-model="searchKeyword"
          placeholder="输入名称\电话\地址进行搜索"
          shape="round"
        >
          <template #action>
            <div class="search-button" @click="onSearch">查找</div>
          </template>
        </van-search>
      </div>

      <!-- 标签页 -->
      <div class="tabs-section">
        <van-tabs v-model:active="activeTab" @change="onTabChange">
          <van-tab title="全部用户" name="all" />
          <van-tab title="固定用户" name="fixed" />
          <van-tab title="临时用户" name="temporary" />
        </van-tabs>

        <div class="filter-button" @click="showFilterPopup = true">
          <span>筛选</span>
          <van-icon name="filter-o" />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button
          round
          block
          color="#FF8C00"
          @click="onRestoreBinding"
        >
          恢复绑定
        </van-button>
        <van-button
          round
          block
          color="#4E8EF7"
          @click="onAddBinding"
        >
          添加绑定
        </van-button>
      </div>

      <!-- 用户列表 -->
      <div class="user-list">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div
            v-for="(user, index) in userList"
            :key="index"
            class="user-item"
          >
            <van-checkbox v-model="user.checked" icon-size="20px">
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-address">{{ user.address }}</div>
                <div class="user-phone">{{ user.phone }}</div>
              </div>
            </van-checkbox>
          </div>
        </van-list>
      </div>
    </div>

    <!-- 筛选弹窗 -->
    <van-popup v-model:show="showFilterPopup" position="bottom" round>
      <div class="filter-popup">
        <div class="filter-header">
          <span @click="showFilterPopup = false">取消</span>
          <span class="filter-title">筛选</span>
          <span class="filter-confirm" @click="onFilterConfirm">确定</span>
        </div>
        <div class="filter-content">
          <!-- 这里可以添加筛选选项 -->
          <van-cell-group>
            <van-cell title="按时间筛选" is-link @click="showTimePicker = true" />
            <van-cell title="按区域筛选" is-link />
          </van-cell-group>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()

// 工人ID
const workerId = computed(() => route.params.id)

// 搜索关键词
const searchKeyword = ref('')

// 当前激活的标签页
const activeTab = ref('all')

// 筛选弹窗
const showFilterPopup = ref(false)

// 用户列表
const userList = ref([])
const loading = ref(false)
const finished = ref(false)

// 搜索
const onSearch = () => {
  console.log('搜索:', searchKeyword.value)
  showToast('搜索功能开发中')
  // TODO: 实现搜索功能
}

// 切换标签页
const onTabChange = (name) => {
  console.log('切换到:', name)
  userList.value = []
  finished.value = false
  onLoad()
}

// 加载数据
const onLoad = () => {
  loading.value = true

  // TODO: 替换为实际的 API 调用
  // 模拟加载数据
  setTimeout(() => {
    // 这里暂时返回空数据，显示"没有更多了"
    loading.value = false
    finished.value = true
  }, 500)
}

// 恢复绑定
const onRestoreBinding = () => {
  const selectedUsers = userList.value.filter(u => u.checked)
  if (selectedUsers.length === 0) {
    showToast('请选择要恢复绑定的用户')
    return
  }
  console.log('恢复绑定:', selectedUsers)
  showToast('恢复绑定功能开发中')
  // TODO: 实现恢复绑定功能
}

// 添加绑定
const onAddBinding = () => {
  const selectedUsers = userList.value.filter(u => u.checked)
  if (selectedUsers.length === 0) {
    showToast('请选择要添加绑定的用户')
    return
  }
  console.log('添加绑定:', selectedUsers)
  showToast('添加绑定功能开发中')
  // TODO: 实现添加绑定功能
}

// 筛选确认
const onFilterConfirm = () => {
  showFilterPopup.value = false
  showToast('应用筛选条件')
  // TODO: 实现筛选功能
}
</script>

<style lang="scss" scoped>
.worker-delivery-users-page {
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

.container {
  padding-bottom: 20px;
}

// 搜索区域
.search-section {
  background: white;
  padding: 8px 12px;

  :deep(.van-search) {
    padding: 0;

    .van-search__content {
      background: #f5f5f5;
    }
  }

  .search-button {
    color: #4E8EF7;
    font-size: 15px;
    padding: 0 12px;
    cursor: pointer;
  }
}

// 标签页区域
.tabs-section {
  position: relative;
  background: white;

  :deep(.van-tabs) {
    .van-tabs__nav {
      background: white;
    }

    .van-tab {
      font-size: 15px;
      color: #666;

      &--active {
        color: #333;
        font-weight: 500;
      }
    }

    .van-tabs__line {
      background: #4E8EF7;
      width: 40px;
    }
  }

  .filter-button {
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #666;
    cursor: pointer;

    .van-icon {
      font-size: 16px;
    }
  }
}

// 操作按钮
.action-buttons {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  margin-top: 10px;

  .van-button {
    flex: 1;
    height: 44px;
    font-size: 15px;
    border: none;
  }
}

// 用户列表
.user-list {
  margin-top: 10px;
  background: white;
  min-height: 200px;

  :deep(.van-list) {
    padding: 12px 16px;
  }

  :deep(.van-list__finished-text) {
    color: #999;
    font-size: 14px;
    padding: 20px 0;
  }

  .user-item {
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    :deep(.van-checkbox) {
      width: 100%;

      .van-checkbox__label {
        flex: 1;
        margin-left: 12px;
      }
    }

    .user-info {
      .user-name {
        font-size: 15px;
        color: #333;
        font-weight: 500;
        margin-bottom: 6px;
      }

      .user-address {
        font-size: 13px;
        color: #666;
        margin-bottom: 4px;
      }

      .user-phone {
        font-size: 13px;
        color: #999;
      }
    }
  }
}

// 筛选弹窗
.filter-popup {
  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;

    span {
      font-size: 15px;
      color: #666;
      cursor: pointer;
    }

    .filter-title {
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }

    .filter-confirm {
      color: #4E8EF7;
    }
  }

  .filter-content {
    padding: 12px 0;
  }
}
</style>
