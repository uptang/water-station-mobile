<template>
  <div class="store-settings-page page">
    <van-nav-bar title="门店设置" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <!-- 门店基本信息 -->
      <div class="section">
        <div class="section-title">基本信息</div>
        <van-cell-group :border="false">
          <van-field
            v-model="storeForm.name"
            label="门店名称"
            placeholder="请输入门店名称"
            required
          />
          <van-field
            v-model="storeForm.phone"
            label="联系电话"
            type="tel"
            placeholder="请输入联系电话"
            required
          />
          <van-field
            v-model="storeForm.address"
            label="门店地址"
            placeholder="请输入门店地址"
            required
            is-link
            @click="selectAddress"
          />
          <van-field
            v-model="storeForm.manager"
            label="负责人"
            placeholder="请输入负责人姓名"
          />
        </van-cell-group>
      </div>

      <!-- 营业时间设置 -->
      <div class="section">
        <div class="section-title">营业时间</div>
        <van-cell-group :border="false">
          <van-field label="营业状态">
            <template #input>
              <van-switch v-model="storeForm.isOpen" size="20px" />
              <span class="status-text">{{ storeForm.isOpen ? '营业中' : '休息中' }}</span>
            </template>
          </van-field>
          <van-field
            v-model="storeForm.openTime"
            label="开始时间"
            placeholder="请选择开始时间"
            is-link
            readonly
            @click="showOpenTimePicker = true"
          />
          <van-field
            v-model="storeForm.closeTime"
            label="结束时间"
            placeholder="请选择结束时间"
            is-link
            readonly
            @click="showCloseTimePicker = true"
          />
        </van-cell-group>
      </div>

      <!-- 配送设置 -->
      <div class="section">
        <div class="section-title">配送设置</div>
        <van-cell-group :border="false">
          <van-field
            v-model="storeForm.deliveryFee"
            label="配送费"
            type="digit"
            placeholder="请输入配送费"
            suffix="元"
          />
          <van-field
            v-model="storeForm.minAmount"
            label="起送价"
            type="digit"
            placeholder="请输入起送价"
            suffix="元"
          />
          <van-field
            v-model="storeForm.deliveryRange"
            label="配送范围"
            type="digit"
            placeholder="请输入配送范围"
            suffix="公里"
          />
          <van-field
            v-model="storeForm.estimateTime"
            label="预计送达时间"
            type="digit"
            placeholder="请输入预计送达时间"
            suffix="分钟"
          />
        </van-cell-group>
      </div>

      <!-- 通知设置 -->
      <div class="section">
        <div class="section-title">通知设置</div>
        <van-cell-group :border="false">
          <van-field label="新订单通知">
            <template #input>
              <van-switch v-model="storeForm.orderNotify" size="20px" />
            </template>
          </van-field>
          <van-field label="库存预警通知">
            <template #input>
              <van-switch v-model="storeForm.stockNotify" size="20px" />
            </template>
          </van-field>
          <van-field
            v-model="storeForm.stockWarningLine"
            label="库存预警值"
            type="digit"
            placeholder="库存低于此值时预警"
            :disabled="!storeForm.stockNotify"
          />
          <van-field label="配送超时提醒">
            <template #input>
              <van-switch v-model="storeForm.timeoutNotify" size="20px" />
            </template>
          </van-field>
        </van-cell-group>
      </div>

      <!-- 其他设置 -->
      <div class="section">
        <div class="section-title">其他设置</div>
        <van-cell-group :border="false">
          <van-field label="自动接单">
            <template #input>
              <van-switch v-model="storeForm.autoAccept" size="20px" />
            </template>
          </van-field>
          <van-field label="自动派单">
            <template #input>
              <van-switch v-model="storeForm.autoDispatch" size="20px" />
            </template>
          </van-field>
        </van-cell-group>
      </div>

      <!-- 保存按钮 -->
      <div class="submit-section">
        <van-button type="primary" block @click="handleSubmit">保存设置</van-button>
      </div>
    </div>

    <!-- 时间选择器 -->
    <van-popup v-model:show="showOpenTimePicker" position="bottom" round>
      <van-time-picker
        v-model="openTimeValue"
        title="选择开始时间"
        @confirm="confirmOpenTime"
        @cancel="showOpenTimePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showCloseTimePicker" position="bottom" round>
      <van-time-picker
        v-model="closeTimeValue"
        title="选择结束时间"
        @confirm="confirmCloseTime"
        @cancel="showCloseTimePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'

const router = useRouter()

const showOpenTimePicker = ref(false)
const showCloseTimePicker = ref(false)
const openTimeValue = ref(['09', '00'])
const closeTimeValue = ref(['22', '00'])

// 门店表单
const storeForm = reactive({
  name: '百一先到',
  phone: '17696837781',
  address: '江苏省扬州市广陵区XX路XX号',
  manager: '宋再洋',
  isOpen: true,
  openTime: '09:00',
  closeTime: '22:00',
  deliveryFee: '5',
  minAmount: '20',
  deliveryRange: '5',
  estimateTime: '60',
  orderNotify: true,
  stockNotify: true,
  stockWarningLine: '10',
  timeoutNotify: true,
  autoAccept: false,
  autoDispatch: false
})

// 选择地址
const selectAddress = () => {
  showToast('地址选择功能开发中')
}

// 确认开始时间
const confirmOpenTime = ({ selectedValues }) => {
  storeForm.openTime = selectedValues.join(':')
  showOpenTimePicker.value = false
}

// 确认结束时间
const confirmCloseTime = ({ selectedValues }) => {
  storeForm.closeTime = selectedValues.join(':')
  showCloseTimePicker.value = false
}

// 提交表单
const handleSubmit = () => {
  // 验证必填字段
  if (!storeForm.name.trim()) {
    showToast('请输入门店名称')
    return
  }
  if (!storeForm.phone.trim()) {
    showToast('请输入联系电话')
    return
  }
  if (!storeForm.address.trim()) {
    showToast('请输入门店地址')
    return
  }

  // 验证手机号格式
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(storeForm.phone)) {
    showToast('请输入正确的手机号')
    return
  }

  // 模拟提交
  showSuccessToast('保存成功')

  // 可以在这里调用API保存数据
  // api.updateStoreSettings(storeForm)
}
</script>

<style lang="scss" scoped>
.store-settings-page {
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

.section {
  background: white;
  margin-bottom: 8px;
  padding: 16px;

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
  }

  :deep(.van-cell-group) {
    background: white;
  }

  :deep(.van-field__label) {
    width: 110px;
    color: #333;
    font-size: 15px;
  }

  :deep(.van-field__control) {
    font-size: 15px;
  }

  .status-text {
    margin-left: 8px;
    font-size: 14px;
    color: #666;
  }
}

.submit-section {
  padding: 20px 16px;
}
</style>
