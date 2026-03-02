<template>
  <div class="promotion-settings-page page">
    <van-nav-bar title="推广设置" left-arrow @click-left="router.back()" fixed placeholder />

    <van-form @submit="handleSubmit">
      <!-- 推广用户返佣 -->
      <div class="section">
        <div class="section-title">推广用户返佣</div>
        <van-field
          v-model="formData.directUserRebate"
          label="推广做信用户返佣："
          type="digit"
          placeholder="0"
          suffix="元"
        />
        <van-field
          v-model="formData.electricUserRebate"
          label="推广电话用户返佣："
          type="digit"
          placeholder="0"
          suffix="元"
        />
        <van-field
          v-model="formData.secondLevelPersonalRebate"
          label="推广二维码个人用户返佣："
          type="digit"
          placeholder="0"
          suffix="元"
        />
        <van-field
          v-model="formData.secondLevelBusinessRebate"
          label="推广二维码商业用户返佣："
          type="digit"
          placeholder="0"
          suffix="元"
        />
      </div>

      <!-- 推广用户首单返佣 -->
      <div class="section">
        <div class="section-title">推广用户首单返佣</div>
        <van-field
          v-model="formData.eTicketFirstOrderRebate"
          label="购买电子水票返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
        <van-field
          v-model="formData.onlineOrderFirstOrderRebate"
          label="线上下单(非电子水票)返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
        <van-field
          v-model="formData.wechatPayFirstOrderRebate"
          label="微信用户线下下单返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
        <van-field
          v-model="formData.nonWechatPayFirstOrderRebate"
          label="非微信用户线下下单返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
        <van-cell title="门店下单返佣价设置：">
          <template #value>
            <van-radio-group v-model="formData.storeOrderRebateType" direction="horizontal">
              <van-radio :name="1">用户在本店下单才能获得返佣</van-radio>
              <van-radio :name="2">用户在任意门店下单都能获得返佣</van-radio>
            </van-radio-group>
          </template>
        </van-cell>
      </div>

      <!-- 推广用户下单返佣 -->
      <div class="section">
        <div class="section-title">推广用户下单返佣</div>
        <van-field
          v-model="formData.eTicketOrderRebate"
          label="购买电子水票返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
        <van-field
          v-model="formData.onlineOrderRebate"
          label="线上下单(非电子水票)返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
        <van-field
          v-model="formData.wechatPayOrderRebate"
          label="微信用户线下下单返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
        <van-field
          v-model="formData.nonWechatPayOrderRebate"
          label="非微信用户线下下单返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
        <van-field
          v-model="formData.returnValidDays"
          label="返佣有效时长："
          type="digit"
          placeholder="0"
          suffix="天"
        />
        <van-field
          v-model="formData.returnThreshold"
          label="返佣订单数上限："
          type="digit"
          placeholder="0"
          suffix="天"
        />
        <van-cell title="门店下单返佣价设置：">
          <template #value>
            <van-radio-group v-model="formData.storeOrderRebateType2" direction="horizontal">
              <van-radio :name="1">用户在本店下单才能获得返佣</van-radio>
              <van-radio :name="2">用户在任意门店下单都能获得返佣</van-radio>
            </van-radio-group>
          </template>
        </van-cell>
      </div>

      <!-- 推广商品返佣 -->
      <div class="section">
        <div class="section-title">推广商品返佣</div>
        <van-cell title="返佣对象设置：">
          <template #value>
            <van-radio-group v-model="formData.rebateTarget" direction="horizontal">
              <van-radio :name="1">商品推广者返佣</van-radio>
              <van-radio :name="2">用户推广者返佣</van-radio>
              <van-radio :name="3">商者都返佣</van-radio>
            </van-radio-group>
          </template>
        </van-cell>
        <van-field
          v-model="formData.onlineProductRebate"
          label="线上下单商品推广返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
        <van-field
          v-model="formData.offlineProductRebate"
          label="线下下单商品推广返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
      </div>

      <!-- 实体卡返佣 -->
      <div class="section">
        <div class="section-title">实体卡返佣</div>
        <van-field
          v-model="formData.physicalCardWaterRebate"
          label="购买水票实体卡返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
        <van-field
          v-model="formData.physicalCardSalesRebate"
          label="购买吉贝实体卡返佣："
          type="digit"
          placeholder="0"
          suffix="%"
        />
      </div>

      <!-- 确认按钮 -->
      <div class="submit-section">
        <van-button type="primary" block round native-type="submit" :loading="loading">
          确认
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const loading = ref(false)

const formData = reactive({
  directUserRebate: 0,
  electricUserRebate: 0,
  secondLevelPersonalRebate: 0,
  secondLevelBusinessRebate: 0,
  eTicketFirstOrderRebate: 0,
  onlineOrderFirstOrderRebate: 0,
  wechatPayFirstOrderRebate: 0,
  nonWechatPayFirstOrderRebate: 0,
  storeOrderRebateType: 1,
  eTicketOrderRebate: 0,
  onlineOrderRebate: 0,
  wechatPayOrderRebate: 0,
  nonWechatPayOrderRebate: 0,
  returnValidDays: 0,
  returnThreshold: 0,
  storeOrderRebateType2: 1,
  rebateTarget: 1,
  onlineProductRebate: 0,
  offlineProductRebate: 0,
  physicalCardWaterRebate: 0,
  physicalCardSalesRebate: 0
})

const handleSubmit = () => {
  loading.value = true
  setTimeout(() => {
    showToast('保存成功')
    loading.value = false
  }, 1000)
}
</script>

<style lang="scss" scoped>
.promotion-settings-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 80px;

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

.section {
  background: white;
  margin-bottom: 8px;
  padding: 0 16px;

  .section-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    padding: 16px 0 8px;
  }

  :deep(.van-cell) {
    padding: 12px 0;
  }

  :deep(.van-field__label) {
    width: auto;
  }

  :deep(.van-radio-group) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: white;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.05);

  .van-button {
    height: 48px;
    font-size: 16px;
    background: linear-gradient(90deg, #6BA8FF 0%, #4E8EF7 100%);
    border: none;
  }
}
</style>
