<template>
  <div class="worker-edit-page page">
    <van-nav-bar title="账号设置" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="formData.name"
            name="name"
            label="姓名"
            placeholder="请输入员工姓名"
            required
            :rules="[{ required: true, message: '请输入员工姓名' }]"
          >
            <template #label>
              <span class="required-mark">*</span>姓名
            </template>
          </van-field>

          <van-field
            v-model="formData.account"
            name="account"
            label="账号"
            placeholder="请输入员工联系电话"
            required
            :rules="[
              { required: true, message: '请输入员工联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]"
          >
            <template #label>
              <span class="required-mark">*</span>账号
            </template>
          </van-field>

          <van-field
            v-model="formData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="不修改请留空"
          >
            <template #label>
              密码
            </template>
          </van-field>

          <van-field
            v-model="formData.age"
            name="age"
            label="年龄"
            type="digit"
            placeholder="请输入员工年龄"
          />

          <van-field name="gender" label="性别">
            <template #input>
              <van-radio-group v-model="formData.gender" direction="horizontal">
                <van-radio name="secret">保密</van-radio>
                <van-radio name="male">男</van-radio>
                <van-radio name="female">女</van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field
            v-model="formData.role"
            name="role"
            label="身份"
            placeholder="请选择身份"
            readonly
            is-link
            @click="showRolePicker = true"
          />
        </van-cell-group>

        <!-- 底部按钮 -->
        <div class="form-buttons">
          <van-button round block plain type="primary" @click="router.back()">
            取消
          </van-button>
          <van-button round block type="primary" native-type="submit">
            保存
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 身份选择器 -->
    <van-popup v-model:show="showRolePicker" position="bottom" round>
      <van-picker
        :columns="roleOptions"
        @confirm="onRoleConfirm"
        @cancel="showRolePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showSuccessToast, showLoadingToast, closeToast } from 'vant'

const router = useRouter()
const route = useRoute()

// 工人ID
const workerId = computed(() => route.params.id)

// 表单数据
const formData = reactive({
  name: '',
  account: '',
  password: '',
  age: '',
  gender: 'secret',
  role: '财务管理'
})

// 身份选择器
const showRolePicker = ref(false)
const roleOptions = ['老板', '财务管理', '配送员', '客服']

// 加载工人数据
const loadWorkerData = async () => {
  try {
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })

    // TODO: 替换为实际的 API 调用
    // const response = await fetch('/api/worker/' + workerId.value)
    // const data = await response.json()

    // 模拟数据
    setTimeout(() => {
      Object.assign(formData, {
        name: '宋再洋',
        account: '17696837781',
        password: '',
        age: '35',
        gender: 'male',
        role: '老板'
      })
      closeToast()
    }, 500)

  } catch (error) {
    console.error('加载失败:', error)
    closeToast()
  }
}

// 身份选择确认
const onRoleConfirm = ({ selectedValues }) => {
  formData.role = selectedValues[0]
  showRolePicker.value = false
}

// 提交表单
const onSubmit = () => {
  console.log('提交表单', formData)

  // TODO: 替换为实际的 API 调用
  showSuccessToast('修改成功')
  setTimeout(() => {
    router.back()
  }, 1500)
}

onMounted(() => {
  loadWorkerData()
})
</script>

<style lang="scss" scoped>
.worker-edit-page {
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

    .required-mark {
      color: #FF3B30;
      margin-right: 4px;
    }

    .van-field__label {
      width: 80px;
      color: #333;
    }

    .van-field__control {
      color: #333;
    }

    .van-field__control::placeholder {
      color: #ddd;
    }
  }

  .van-radio-group {
    display: flex;
    gap: 24px;

    .van-radio {
      :deep(.van-radio__label) {
        margin-left: 8px;
      }
    }
  }
}

// 底部按钮
.form-buttons {
  display: flex;
  gap: 12px;
  padding: 20px 16px;

  .van-button {
    flex: 1;
    height: 50px;
    font-size: 16px;
  }
}
</style>
