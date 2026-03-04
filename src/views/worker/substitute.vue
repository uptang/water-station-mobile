<template>
  <div class="substitute-page page">
    <van-nav-bar title="代班设置" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="formData.workerName"
            name="worker"
            label="代班工人："
            placeholder="请选择代班工人"
            readonly
            is-link
            @click="showWorkerPicker = true"
          >
            <template #button>
              <span v-if="formData.workerName" class="clear-btn" @click.stop="handleClear">
                清空
              </span>
            </template>
          </van-field>

          <van-field
            v-model="formData.startDate"
            name="startDate"
            label="开始时间："
            placeholder="选择日期"
            readonly
            @click="showStartDatePicker = true"
          >
            <template #button>
              <van-icon name="calendar-o" />
            </template>
          </van-field>

          <van-field
            v-model="formData.endDate"
            name="endDate"
            label="结束时间："
            placeholder="选择日期"
            readonly
            @click="showEndDatePicker = true"
          >
            <template #button>
              <van-icon name="calendar-o" />
            </template>
          </van-field>
        </van-cell-group>

        <!-- 确认按钮 -->
        <div class="form-buttons">
          <van-button round block type="primary" native-type="submit">
            确认
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 代班工人选择器 -->
    <van-popup v-model:show="showWorkerPicker" position="bottom" round>
      <van-picker
        :columns="workerOptions"
        @confirm="onWorkerConfirm"
        @cancel="showWorkerPicker = false"
      />
    </van-popup>

    <!-- 开始日期选择器 -->
    <van-popup v-model:show="showStartDatePicker" position="bottom" round>
      <van-date-picker
        v-model="startDate"
        title="选择开始日期"
        :min-date="minDate"
        @confirm="onStartDateConfirm"
        @cancel="showStartDatePicker = false"
      />
    </van-popup>

    <!-- 结束日期选择器 -->
    <van-popup v-model:show="showEndDatePicker" position="bottom" round>
      <van-date-picker
        v-model="endDate"
        title="选择结束日期"
        :min-date="minDate"
        @confirm="onEndDateConfirm"
        @cancel="showEndDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showSuccessToast } from 'vant'

const router = useRouter()
const route = useRoute()

// 从路由参数获取工人ID
const workerId = computed(() => route.params.id)

// 表单数据
const formData = reactive({
  workerName: '宋再洋',
  workerId: '',
  startDate: '',
  endDate: ''
})

// 日期
const minDate = new Date()
const startDate = ref(['2026', '01', '01'])
const endDate = ref(['2026', '12', '31'])

// 代班工人选择器
const showWorkerPicker = ref(false)
const workerOptions = ['宋再洋', '李明', '王强']

// 日期选择器
const showStartDatePicker = ref(false)
const showEndDatePicker = ref(false)

// 代班工人选择确认
const onWorkerConfirm = ({ selectedValues }) => {
  formData.workerName = selectedValues[0]
  showWorkerPicker.value = false
}

// 清空代班工人
const handleClear = () => {
  formData.workerName = ''
  formData.workerId = ''
}

// 开始日期确认
const onStartDateConfirm = () => {
  formData.startDate = `${startDate.value[0]}-${startDate.value[1]}-${startDate.value[2]}`
  showStartDatePicker.value = false
}

// 结束日期确认
const onEndDateConfirm = () => {
  formData.endDate = `${endDate.value[0]}-${endDate.value[1]}-${endDate.value[2]}`
  showEndDatePicker.value = false
}

// 提交表单
const onSubmit = () => {
  console.log('提交代班设置', formData)
  showSuccessToast('设置成功')
  setTimeout(() => {
    router.back()
  }, 1500)
}
</script>

<style lang="scss" scoped>
.substitute-page {
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
  padding: 12px;
}

:deep(.van-cell-group) {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;

  .van-cell {
    padding: 16px;
    font-size: 15px;

    .van-field__label {
      width: 100px;
      color: #333;
    }

    .van-field__control {
      color: #333;
    }

    .van-field__control::placeholder {
      color: #ddd;
    }

    .van-field__button {
      .clear-btn {
        color: #4E8EF7;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}

// 确认按钮
.form-buttons {
  padding: 20px 16px;

  .van-button {
    height: 50px;
    font-size: 16px;
  }
}
</style>
