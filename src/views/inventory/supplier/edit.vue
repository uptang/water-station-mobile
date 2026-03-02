<template>
  <div class="supplier-edit-page page">
    <van-nav-bar title="修改供货商资料" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <van-form @submit="handleSubmit">
        <div class="card">
          <van-cell-group :border="false">
            <van-field
              v-model="formData.name"
              label="供货商名称"
              placeholder="请输入供货商名称"
              required
            />
            <van-field
              v-model="formData.address"
              label="供货商地址"
              placeholder="请输入供货商地址"
              required
            />
            <van-field
              v-model="formData.phone"
              label="联系电话"
              type="tel"
              placeholder="请输入联系电话"
              required
            />
            <van-field
              v-model="formData.note"
              label="备注"
              type="textarea"
              rows="2"
              placeholder="请输入备注"
            />
          </van-cell-group>
        </div>

        <div class="submit-actions">
          <van-button type="primary" block round native-type="submit">
            保存
          </van-button>
        </div>
      </van-form>

      <!-- 欠桶欠款信息 -->
      <div class="debt-card card">
        <div class="debt-row">
          <span>欠桶：<span class="value">{{ debtInfo.barrel }}</span></span>
          <div class="debt-actions">
            <van-button size="small" @click="showDebtDetail('barrel')">详情</van-button>
            <van-button size="small" type="primary">记账</van-button>
          </div>
        </div>
        <div class="debt-row">
          <span>欠款：<span class="value text-danger">¥{{ debtInfo.money }}</span></span>
          <div class="debt-actions">
            <van-button size="small" @click="showDebtDetail('money')">详情</van-button>
            <van-button size="small" type="primary">记账</van-button>
          </div>
        </div>
        <p class="debt-note">注：欠桶欠款为正代表水站欠供货商，为负代表供货商欠水站</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()

const formData = reactive({
  name: 'test',
  address: '111',
  phone: '13249192453',
  note: ''
})

const debtInfo = ref({
  barrel: 0,
  money: 10.00
})

const handleSubmit = () => {
  showToast('修改成功')
  router.back()
}

const showDebtDetail = (type) => {
  router.push(`/supplier/detail/${route.params.id}?type=${type}`)
}
</script>

<style lang="scss" scoped>
.supplier-edit-page {
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
  margin-bottom: 16px;
}

.debt-card {
  .debt-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);

    &:last-of-type {
      border-bottom: none;
    }

    .value {
      font-weight: bold;
      color: var(--primary-color);
    }

    .debt-actions {
      display: flex;
      gap: 8px;
    }
  }

  .debt-note {
    margin-top: 12px;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.6;
  }
}
</style>
