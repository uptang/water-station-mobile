<template>
  <div class="order-manual-page page-with-tabbar">
    <van-nav-bar title="手动录单" left-arrow fixed placeholder @click-left="onClickLeft" />

    <div class="form-content">
      <van-form @submit="onSubmit">
        <van-cell-group title="客户信息" inset>
          <van-field
            v-model="form.customerName"
            label="客户姓名"
            placeholder="请输入客户姓名"
            required
            :rules="[{ required: true, message: '请输入客户姓名' }]"
          />
          <van-field
            v-model="form.customerPhone"
            label="联系电话"
            type="tel"
            placeholder="请输入联系电话"
            required
            :rules="[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]"
          />
          <van-field
            v-model="form.address"
            label="配送地址"
            type="textarea"
            placeholder="请输入配送地址"
            rows="3"
            required
            :rules="[{ required: true, message: '请输入配送地址' }]"
          />
        </van-cell-group>

        <van-cell-group title="商品信息" inset>
          <van-field
            label="选择商品"
            readonly
            clickable
            :value="selectedProduct ? selectedProduct.name : '请选择商品'"
            required
            :rules="[{ required: true, message: '请选择商品' }]"
            @click="showProductPicker = true"
          >
            <template #button>
              <van-button size="small" type="primary" @click.stop="showProductPicker = true">
                选择
              </van-button>
            </template>
          </van-field>

          <van-field
            v-model.number="form.quantity"
            label="数量"
            type="number"
            placeholder="请输入数量"
            required
            :rules="[{ required: true, message: '请输入数量' }]"
          >
            <template #button>
              <van-stepper v-model="form.quantity" min="1" integer />
            </template>
          </van-field>

          <van-field
            v-model.number="form.price"
            label="单价"
            type="digit"
            placeholder="请输入单价"
            required
            :rules="[{ required: true, message: '请输入单价' }]"
          >
            <template #button>
              <span class="price-unit">元</span>
            </template>
          </van-field>

          <van-cell title="商品小计">
            <template #value>
              <span class="total-price">¥ {{ (form.quantity * form.price).toFixed(2) }}</span>
            </template>
          </van-cell>
        </van-cell-group>

        <van-cell-group title="订单信息" inset>
          <van-field
            v-model="form.remark"
            label="订单备注"
            type="textarea"
            placeholder="请输入订单备注（选填）"
            rows="2"
            maxlength="200"
            show-word-limit
          />
          <van-field
            v-model="form.deliveryTime"
            label="期望送达时间"
            readonly
            clickable
            placeholder="请选择期望送达时间"
            @click="showTimePicker = true"
          />
          <van-field
            label="支付方式"
            readonly
            :value="paymentMethod"
            @click="showPaymentPicker = true"
          />
        </van-cell-group>

        <div class="submit-section">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            提交订单
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 商品选择器 -->
    <van-popup v-model:show="showProductPicker" position="bottom" round :style="{ height: '70%' }">
      <div class="product-picker">
        <div class="picker-header">
          <span @click="showProductPicker = false">取消</span>
          <span class="header-title">选择商品</span>
          <span @click="confirmProduct">确定</span>
        </div>
        <van-search v-model="productSearch" placeholder="搜索商品" />
        <div class="product-list">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-item"
            :class="{ active: selectedProduct?.id === product.id }"
            @click="selectProduct(product)"
          >
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-spec">{{ product.spec }}</div>
              <div class="product-meta">
                <span class="stock">库存: {{ product.stock }}</span>
                <span class="price">¥{{ product.price }}</span>
              </div>
            </div>
            <van-icon v-if="selectedProduct?.id === product.id" name="success" color="#4E8EF7" />
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 时间选择器 -->
    <van-popup v-model:show="showTimePicker" position="bottom">
      <van-datetime-picker
        v-model="deliveryTimeDate"
        type="datetime"
        :min-date="minDate"
        @confirm="onTimeConfirm"
        @cancel="showTimePicker = false"
      />
    </van-popup>

    <!-- 支付方式选择器 -->
    <van-popup v-model:show="showPaymentPicker" position="bottom">
      <van-picker
        :columns="paymentMethods"
        @confirm="onPaymentConfirm"
        @cancel="showPaymentPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast, showLoadingToast, closeToast } from 'vant'

const router = useRouter()

const form = reactive({
  customerName: '',
  customerPhone: '',
  address: '',
  productId: '',
  quantity: 1,
  price: 0,
  remark: '',
  deliveryTime: '',
  paymentMethod: 'cash'
})

const showProductPicker = ref(false)
const showTimePicker = ref(false)
const showPaymentPicker = ref(false)
const submitting = ref(false)

const selectedProduct = ref(null)
const productSearch = ref('')
const deliveryTimeDate = ref(new Date())
const minDate = ref(new Date())

const paymentMethod = ref('货到付款')

const paymentMethods = [
  { text: '货到付款', value: 'cash' },
  { text: '微信支付', value: 'wechat' },
  { text: '支付宝', value: 'alipay' },
  { text: '银行转账', value: 'bank' }
]

const mockProducts = [
  { id: '1', name: '怡宝 饮用纯净水', spec: '6L×3桶/箱', stock: 156, price: 36.00 },
  { id: '2', name: '农夫山泉 饮用天然水', spec: '4L×6桶/箱', stock: 8, price: 48.00 },
  { id: '3', name: '景田 百岁山饮用水', spec: '5L×4桶/箱', stock: 89, price: 52.00 },
  { id: '4', name: '娃哈哈 纯净水', spec: '5L×4桶/箱', stock: 120, price: 32.00 }
]

const productList = ref(mockProducts)

const filteredProducts = computed(() => {
  if (!productSearch.value) return productList.value
  return productList.value.filter(p =>
    p.name.includes(productSearch.value) ||
    p.spec.includes(productSearch.value)
  )
})

const onClickLeft = () => {
  router.back()
}

const selectProduct = (product) => {
  selectedProduct.value = product
  form.productId = product.id
  form.price = product.price
}

const confirmProduct = () => {
  if (!selectedProduct.value) {
    showToast('请选择商品')
    return
  }
  showProductPicker.value = false
}

const onTimeConfirm = () => {
  form.deliveryTime = deliveryTimeDate.value.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
  showTimePicker.value = false
}

const onPaymentConfirm = ({ selectedOptions }) => {
  form.paymentMethod = selectedOptions[0].value
  paymentMethod.value = selectedOptions[0].text
  showPaymentPicker.value = false
}

const onSubmit = async () => {
  try {
    submitting.value = true
    showLoadingToast({ message: '提交中...', forbidClick: true })

    setTimeout(() => {
      closeToast()
      showSuccessToast('订单创建成功')
      router.back()
    }, 1000)
  } catch (error) {
    closeToast()
    showToast('提交失败: ' + error.message)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  // TODO: 从API加载商品列表
})
</script>

<style lang="scss" scoped>
.order-manual-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 80px;
}

.form-content {
  padding: 16px;
}

.total-price {
  font-size: 18px;
  font-weight: bold;
  color: #FF3B30;
}

.price-unit {
  color: #999;
  font-size: 14px;
}

.submit-section {
  margin-top: 24px;
}

.product-picker {
  height: 100%;
  display: flex;
  flex-direction: column;

  .picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 15px;

    span {
      color: #4E8EF7;
      cursor: pointer;
    }

    .header-title {
      color: #333;
      font-weight: 500;
    }
  }
}

.product-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.product-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;

  &.active {
    background: #F0F7FF;
  }

  .product-info {
    flex: 1;

    .product-name {
      font-size: 15px;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .product-spec {
      font-size: 13px;
      color: #999;
      margin-bottom: 8px;
    }

    .product-meta {
      display: flex;
      gap: 16px;
      font-size: 13px;

      .stock {
        color: #999;
      }

      .price {
        color: #FF3B30;
        font-weight: 500;
      }
    }
  }
}
</style>
