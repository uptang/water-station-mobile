<template>
  <div class="register-page">
    <div class="header-bg">
      <div class="logo-container">
        <div class="logo-text">吉客道</div>
      </div>
    </div>

    <div class="register-card">
      <div class="back-link" @click="router.back()">
        <van-icon name="arrow-left" /> 返回登录
      </div>

      <h2 class="title">门店注册</h2>

      <van-form @submit="handleRegister">
        <van-cell-group :border="false">
          <van-field
            v-model="formData.storeName"
            label="门店名称"
            placeholder="不超过12个汉字"
            required
            :rules="[{ required: true, message: '请输入门店名称' }]"
          />
          <van-field
            v-model="formData.phone"
            label="登陆账号"
            type="tel"
            placeholder="请输入11位手机号"
            maxlength="11"
            required
            :rules="[{ required: true, message: '请输入手机号' }]"
          />
          <van-field
            v-model="formData.code"
            label="手机验证码"
            placeholder="输入4位验证码"
            maxlength="4"
            required
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                plain
                :disabled="smsCountdown > 0"
                @click="handleGetCode"
              >
                {{ smsCountdown > 0 ? `${smsCountdown}秒后重发` : '获取验证码' }}
              </van-button>
            </template>
          </van-field>
          <van-field
            v-model="formData.password"
            label="登陆密码"
            :type="showPassword ? 'text' : 'password'"
            placeholder="不低于6位"
            required
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <template #right-icon>
              <van-icon
                :name="showPassword ? 'eye-o' : 'closed-eye'"
                @click="showPassword = !showPassword"
              />
            </template>
          </van-field>
          <div v-if="formData.password" class="password-strength-indicator">
            <span class="label">密码强度：</span>
            <div class="strength-bars">
              <div
                v-for="i in 3"
                :key="i"
                class="strength-bar"
                :style="{ background: i <= passwordStrength ? passwordStrengthColor : '#e5e5e5' }"
              ></div>
            </div>
            <span class="strength-text" :style="{ color: passwordStrengthColor }">
              {{ passwordStrengthText }}
            </span>
          </div>
          <van-field
            v-model="formData.confirmPassword"
            label="确认密码"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="不低于6位"
            required
            :rules="[{ required: true, message: '请确认密码' }]"
          >
            <template #right-icon>
              <van-icon
                :name="showConfirmPassword ? 'eye-o' : 'closed-eye'"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </van-field>
          <div v-if="formData.confirmPassword && formData.password !== formData.confirmPassword" class="password-error">
            两次输入的密码不一致
          </div>
          <van-field
            v-model="formData.address"
            label="门店地址"
            readonly
            placeholder="请点击获取地址"
            is-link
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                plain
                @click="handleGetAddress"
              >
                获取门店地址
              </van-button>
            </template>
          </van-field>
          <van-field
            v-if="formData.address"
            v-model="formData.detailAddress"
            label="详细地址"
            placeholder="请输入详细地址（楼栋、门牌号等）"
          />
          <van-field
            v-model="formData.realName"
            label="真实姓名"
            placeholder="请输入姓名"
          />
          <van-field
            v-model="formData.age"
            label="年龄"
            type="digit"
            placeholder="年龄"
          />
          <van-field label="性别">
            <template #input>
              <van-radio-group v-model="formData.gender" direction="horizontal">
                <van-radio name="male">男</van-radio>
                <van-radio name="female">女</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </van-cell-group>

        <div class="agreement">
          <van-checkbox v-model="agreed" icon-size="16px">
            我已阅读并同意
            <span class="agreement-link" @click.stop="showAgreement">《吉客道企业订单管理系统》隐私协议和用户协议</span>
          </van-checkbox>
        </div>

        <van-button
          type="primary"
          block
          round
          native-type="submit"
          :loading="loading"
          class="register-btn"
        >
          立即注册
        </van-button>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast, showDialog } from 'vant'

const router = useRouter()
const loading = ref(false)
const agreed = ref(false)
const showAddressPicker = ref(false)
const smsCountdown = ref(0)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  storeName: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  address: '',
  detailAddress: '',
  realName: '',
  age: '',
  gender: 'male'
})

// 验证手机号
const validatePhone = (phone) => {
  const phoneReg = /^1[3-9]\d{9}$/
  return phoneReg.test(phone)
}

// 密码强度计算
const passwordStrength = computed(() => {
  const pwd = formData.password
  if (!pwd) return 0

  let strength = 0
  if (pwd.length >= 6) strength++
  if (/\d/.test(pwd) && /[a-zA-Z]/.test(pwd)) strength++
  if (/[A-Z]/.test(pwd) || /[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++

  return strength
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 1: return '弱'
    case 2: return '中'
    case 3: return '强'
    default: return ''
  }
})

const passwordStrengthColor = computed(() => {
  switch (passwordStrength.value) {
    case 1: return '#FF3B30'
    case 2: return '#FF8C00'
    case 3: return '#09BB07'
    default: return '#e5e5e5'
  }
})

// 获取验证码
const handleGetCode = () => {
  if (!formData.phone) {
    showToast('请输入手机号')
    return
  }
  if (!validatePhone(formData.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  if (smsCountdown.value > 0) {
    return
  }

  // 模拟发送验证码
  showSuccessToast('验证码已发送')
  startSmsCountdown()
}

// 开始倒计时
const startSmsCountdown = () => {
  smsCountdown.value = 60
  const timer = setInterval(() => {
    smsCountdown.value--
    if (smsCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 获取门店地址（模拟定位）
const handleGetAddress = () => {
  showSuccessToast('正在获取位置...')
  setTimeout(() => {
    formData.address = '江苏省扬州市广陵区'
    showToast('位置获取成功，请补充详细地址')
  }, 1000)
}

// 显示协议
const showAgreement = () => {
  showDialog({
    title: '用户协议',
    message: '《吉客道企业订单管理系统》隐私协议和用户协议的详细内容...',
    confirmButtonText: '我已阅读'
  })
}

// 表单验证
const validateForm = () => {
  if (!formData.storeName) {
    showToast('请输入门店名称')
    return false
  }
  if (formData.storeName.length > 12) {
    showToast('门店名称不能超过12个汉字')
    return false
  }
  if (!formData.phone) {
    showToast('请输入手机号')
    return false
  }
  if (!validatePhone(formData.phone)) {
    showToast('请输入正确的手机号')
    return false
  }
  if (!formData.code) {
    showToast('请输入验证码')
    return false
  }
  if (formData.code.length !== 4) {
    showToast('请输入4位验证码')
    return false
  }
  if (!formData.password) {
    showToast('请输入密码')
    return false
  }
  if (formData.password.length < 6) {
    showToast('密码不能少于6位')
    return false
  }
  if (!formData.confirmPassword) {
    showToast('请确认密码')
    return false
  }
  if (formData.password !== formData.confirmPassword) {
    showToast('两次输入的密码不一致')
    return false
  }
  if (!formData.address) {
    showToast('请选择门店地址')
    return false
  }
  if (!agreed.value) {
    showToast('请阅读并同意协议')
    return false
  }
  return true
}

// 注册
const handleRegister = () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  // 模拟注册API调用
  setTimeout(() => {
    loading.value = false
    showSuccessToast('注册成功')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }, 1500)
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header-bg {
  height: 300px;
  background: linear-gradient(180deg, #6BA8FF 0%, #4E8EF7 100%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    opacity: 0.5;
  }

  .logo-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .logo-text {
      font-size: 48px;
      font-weight: bold;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      letter-spacing: 4px;
    }
  }
}

.register-card {
  position: relative;
  margin: -80px 20px 20px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);

  .back-link {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #4E8EF7;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 24px;
  }

  .agreement {
    margin: 16px 0;

    :deep(.van-checkbox__label) {
      color: #666;
      font-size: 13px;
      line-height: 1.6;
    }

    .agreement-link {
      color: #4E8EF7;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .password-strength-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px 12px;
    font-size: 12px;

    .label {
      color: #666;
    }

    .strength-bars {
      display: flex;
      gap: 4px;
      flex: 1;

      .strength-bar {
        height: 4px;
        flex: 1;
        border-radius: 2px;
        transition: background 0.3s;
      }
    }

    .strength-text {
      min-width: 20px;
      font-weight: 500;
    }
  }

  .password-error {
    padding: 4px 16px 8px;
    font-size: 12px;
    color: #FF3B30;
  }

  .register-btn {
    height: 48px;
    font-size: 16px;
    background: linear-gradient(90deg, #6BA8FF 0%, #4E8EF7 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(78, 142, 247, 0.3);
  }
}
</style>
