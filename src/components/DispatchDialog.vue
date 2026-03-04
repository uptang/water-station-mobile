<template>
  <van-popup v-model:show="visible" position="bottom" round>
    <div class="dispatch-popup">
      <div class="popup-header">
        <span class="title">选择配送员</span>
        <van-icon name="cross" @click="handleClose" />
      </div>
      <van-search v-model="workerSearch" placeholder="搜索配送员" />
      <div class="worker-list">
        <div
          v-for="worker in filteredWorkers"
          :key="worker.id"
          class="worker-item"
          :class="{ selected: selectedWorker?.id === worker.id }"
          @click="selectedWorker = worker"
        >
          <div class="worker-info">
            <div class="worker-name">{{ worker.name }}</div>
            <div class="worker-stats">
              <span>今日订单：{{ worker.todayOrders }}</span>
              <span>距离：{{ worker.distance }}</span>
            </div>
          </div>
          <van-icon
            v-if="selectedWorker?.id === worker.id"
            name="success"
            color="#4E8EF7"
            size="20"
          />
        </div>
      </div>
      <div class="popup-footer">
        <van-button block type="primary" @click="handleConfirm">
          确认派单
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  workerList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:show', 'confirm'])

const visible = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

const workerSearch = ref('')
const selectedWorker = ref(null)

// 过滤后的配送员列表
const filteredWorkers = computed(() => {
  if (!workerSearch.value) {
    return props.workerList
  }
  return props.workerList.filter(worker =>
    worker.name.includes(workerSearch.value)
  )
})

// 监听弹窗关闭，重置选择
watch(visible, (newVal) => {
  if (!newVal) {
    selectedWorker.value = null
    workerSearch.value = ''
  }
})

const handleClose = () => {
  visible.value = false
}

const handleConfirm = () => {
  emit('confirm', selectedWorker.value)
}
</script>

<style lang="scss" scoped>
.dispatch-popup {
  padding: 0;
  max-height: 70vh;
  display: flex;
  flex-direction: column;

  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f5f5f5;

    .title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .van-icon {
      font-size: 20px;
      color: #999;
      cursor: pointer;
    }
  }

  .van-search {
    background: white;
  }

  .worker-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 16px;

    .worker-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      margin-bottom: 8px;
      background: #f7f8fa;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;

      &.selected {
        background: #e8f4f8;
        border: 1px solid #4e8ef7;
      }

      .worker-info {
        flex: 1;

        .worker-name {
          font-size: 15px;
          font-weight: 500;
          color: #333;
          margin-bottom: 6px;
        }

        .worker-stats {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: #666;
        }
      }
    }
  }

  .popup-footer {
    padding: 12px 16px;
    border-top: 1px solid #f5f5f5;
    background: white;
  }
}
</style>
