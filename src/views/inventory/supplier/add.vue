<template>
  <div class="supplier-add-page page">
    <van-nav-bar title="添加供货商" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <van-form @submit="handleSubmit">
        <div class="card">
          <van-cell-group :border="false">
            <van-field
              v-model="formData.name"
              label="供货商名称"
              placeholder="请输入供货商名称"
              required
              :rules="[{ required: true, message: '请输入供货商名称' }]"
            />
            <van-field
              v-model="formData.address"
              label="供货商地址"
              placeholder="请输入供货商地址"
              required
              :rules="[{ required: true, message: '请输入供货商地址' }]"
            />
            <van-field
              v-model="formData.phone"
              label="联系电话"
              type="tel"
              placeholder="请输入联系电话"
              required
              :rules="[{ required: true, message: '请输入联系电话' }]"
            />
            <van-field
              v-model="formData.note"
              label="备注"
              type="textarea"
              rows="2"
              placeholder="请输入备注"
            />
            <van-field
              v-model="formData.initialDebt"
              label="初始欠款"
              type="digit"
              placeholder="请输入初始欠款"
            />
          </van-cell-group>
        </div>

        <div class="submit-actions">
          <van-button type="primary" block round native-type="submit">
            保存
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const formData = reactive({
  name: '',
  address: '',
  phone: '',
  note: '',
  initialDebt: ''
})

const handleSubmit = () => {
  showToast('添加成功')
  router.back()
}
</script>

<style lang="scss" scoped>
.supplier-add-page {
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

  :deep(.van-cell-group) {
    background: transparent;
  }
}

.submit-actions {
  margin-top: 24px;
}
</style>
