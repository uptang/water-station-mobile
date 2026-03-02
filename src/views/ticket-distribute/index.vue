<template>
  <div class="ticket-distribute-page page">
    <van-nav-bar
      title="指定用户发"
      left-arrow
      @click-left="router.back()"
    >
      <template #right>
        <van-icon name="bars" size="20" />
      </template>
    </van-nav-bar>

    <div class="container">
      <van-form @submit="handleSubmit">
        <div class="card">
          <van-cell-group :border="false">
            <van-field label="发放类别">
              <template #input>
                <van-radio-group v-model="formData.ticketType" direction="horizontal">
                  <van-radio name="store">本店水票</van-radio>
                  <van-radio name="platform">天网水票</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              label="发放渠道"
              readonly
              :model-value="formData.channel || '请选择发放渠道'"
              is-link
              @click="showChannelPicker = true"
            />
            <van-field
              label="电子水票商品"
              readonly
              :model-value="formData.product || '请选择商品'"
              is-link
              @click="showProductPicker = true"
            />
          </van-cell-group>
        </div>

        <div class="card">
          <van-cell-group :border="false">
            <van-field label="首单限制">
              <template #input>
                <van-radio-group v-model="formData.limitType" direction="horizontal">
                  <van-radio name="unlimited">无限制</van-radio>
                  <van-radio name="firstOnly">仅首单可用</van-radio>
                  <van-radio name="afterFirst">首单后解锁</van-radio>
                </van-radio-group>
              </template>
            </van-field>

            <van-field
              v-model="formData.quantity"
              label="发放张数"
              type="digit"
              placeholder="请输入发放张数"
              suffix="张"
            />

            <van-field label="是否共享">
              <template #input>
                <van-radio-group v-model="formData.isShared" direction="horizontal">
                  <van-radio :name="true">是</van-radio>
                  <van-radio :name="false">否</van-radio>
                </van-radio-group>
              </template>
            </van-field>

            <van-field label="水票是否允许转赠">
              <template #input>
                <van-radio-group v-model="formData.canTransfer" direction="horizontal">
                  <van-radio :name="true">是</van-radio>
                  <van-radio :name="false">否</van-radio>
                </van-radio-group>
              </template>
            </van-field>

            <van-field
              v-model="formData.deliveryFee"
              label="配送费"
              type="digit"
              placeholder="请输入配送费"
              suffix="元"
            />

            <van-field
              label="激活条件"
              readonly
              model-value="免条件激活"
              is-link
            />

            <van-field
              v-model="formData.validDays"
              label="水票有效期"
              type="digit"
              placeholder="请输入有效天数"
              suffix="天"
            />

            <van-field label="生成订单">
              <template #input>
                <van-radio-group v-model="formData.createOrder" direction="horizontal">
                  <van-radio :name="true">是</van-radio>
                  <van-radio :name="false">否</van-radio>
                </van-radio-group>
              </template>
            </van-field>

            <van-field
              v-model="formData.note"
              label="备注"
              type="textarea"
              rows="2"
              placeholder="请输入备注..."
            />
          </van-cell-group>
        </div>

        <div class="card">
          <div class="card-header">
            <span class="card-title">选择用户</span>
            <span class="user-count">已选 {{ selectedUsers.length }} 人</span>
          </div>
          <div class="user-selection">
            <van-button type="primary" icon="plus" size="normal" @click="showUserPicker = true">
              添加用户
            </van-button>
            <van-button plain type="primary" size="normal" :disabled="selectedUsers.length === 0" @click="clearUsers">
              清空
            </van-button>
          </div>
          <div v-if="selectedUsers.length === 0" class="empty-tip">
            <van-icon name="friends-o" size="48" color="#ccc" />
            <p>暂无用户，点击"添加用户"选择</p>
          </div>
          <div v-else class="selected-users">
            <div v-for="user in selectedUsers" :key="user.id" class="user-item">
              <div class="user-info">
                <span class="user-name">{{ user.name }}</span>
                <span class="user-phone">{{ user.phone }}</span>
              </div>
              <van-icon name="cross" size="16" color="#999" @click="removeUser(user.id)" />
            </div>
          </div>
        </div>

        <div class="submit-actions">
          <van-button plain type="primary" block round @click="handleCancel">取消</van-button>
          <van-button type="primary" block round native-type="submit">保存</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const formData = reactive({
  ticketType: 'store',
  channel: '',
  product: '',
  limitType: 'unlimited',
  quantity: '',
  isShared: true,
  canTransfer: false,
  deliveryFee: '',
  validDays: '',
  createOrder: false,
  note: ''
})

const selectedUsers = ref([])
const showChannelPicker = ref(false)
const showProductPicker = ref(false)
const showUserPicker = ref(false)

const handleSubmit = () => {
  // 验证必填字段
  if (!formData.channel) {
    showToast('请选择发放渠道')
    return
  }
  if (!formData.product) {
    showToast('请选择电子水票商品')
    return
  }
  if (!formData.quantity || formData.quantity <= 0) {
    showToast('请输入正确的发放张数')
    return
  }
  if (!formData.validDays || formData.validDays <= 0) {
    showToast('请输入正确的水票有效期')
    return
  }
  if (selectedUsers.value.length === 0) {
    showToast('请至少选择一个用户')
    return
  }

  showToast('发放成功')
  router.back()
}

const handleCancel = () => {
  router.back()
}

const clearUsers = () => {
  selectedUsers.value = []
  showToast('已清空用户')
}

const removeUser = (userId) => {
  selectedUsers.value = selectedUsers.value.filter(u => u.id !== userId)
}
</script>

<style lang="scss" scoped>
.ticket-distribute-page {
  :deep(.van-nav-bar) {
    background: white;
  }

  :deep(.van-cell-group) {
    background: transparent;
  }

  :deep(.van-field__label) {
    width: 140px;
  }

  .card {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .card-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .user-count {
      font-size: 14px;
      color: #4E8EF7;
    }
  }
}

.user-selection {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  .van-button {
    :deep(.van-button__text) {
      font-size: 14px;
    }
  }
}

.empty-tip {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-placeholder);
  font-size: 14px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px dashed #e5e5e5;
  margin-top: 16px;

  p {
    margin-top: 12px;
    line-height: 1.6;
  }
}

.selected-users {
  margin-top: 16px;

  .user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .user-name {
        font-size: 15px;
        color: #333;
        font-weight: 500;
      }

      .user-phone {
        font-size: 13px;
        color: #999;
      }
    }

    .van-icon {
      cursor: pointer;
      padding: 4px;

      &:hover {
        color: #f22121 !important;
      }
    }
  }
}

.submit-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;

  .van-button {
    flex: 1;
    height: 48px;
    font-size: 16px;
    font-weight: 500;

    &[type="primary"]:not([plain]) {
      background: linear-gradient(90deg, #6BA8FF 0%, #4E8EF7 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(78, 142, 247, 0.3);
    }

    &[plain] {
      border-color: #4E8EF7;
      color: #4E8EF7;

      &:hover {
        background: rgba(78, 142, 247, 0.05);
      }
    }
  }
}
</style>
