<template>
  <div class="forget-password-page">
    <div class="header-bg">
      <div class="logo-container">
        <div class="logo-text">吉客道</div>
      </div>
    </div>

    <div class="forget-card">
      <div class="back-link" @click="router.back()">
        返回登录
      </div>

      <h2 class="title">修改密码</h2>

      <!-- 步骤1: 图形验证码 -->
      <van-form v-if="currentStep === 1" @submit="handleGetSmsCode">
        <div class="form-content">
          <div class="input-label">登陆账号</div>
          <div class="phone-display">{{ formData.phone }}</div>

          <div class="input-label" style="margin-top: 24px">请输入图形验证码</div>
          <div class="captcha-row">
            <input
              v-model="formData.captcha"
              type="text"
              placeholder="请输入图形验证码"
              class="captcha-input"
              maxlength="4"
            />
            <div class="captcha-image" @click="refreshCaptcha">
              <canvas ref="captchaCanvas" width="100" height="36"></canvas>
            </div>
          </div>
          <div class="captcha-tip" @click="refreshCaptcha">看不清，换一张</div>

          <van-button
            type="primary"
            block
            round
            :loading="loading"
            native-type="submit"
            class="submit-btn"
          >
            获取短信验证码
          </van-button>
        </div>
      </van-form>

      <!-- 步骤2: 短信验证码 -->
      <van-form v-if="currentStep === 2" @submit="handleVerifySmsCode">
        <div class="form-content">
          <div class="input-label">登陆账号</div>
          <div class="phone-display">{{ formData.phone }}</div>

          <div class="input-label" style="margin-top: 24px">短信验证码</div>
          <div class="sms-row">
            <input
              v-model="formData.smsCode"
              type="text"
              placeholder="请输入短信验证码"
              class="sms-input"
              maxlength="6"
            />
            <van-button
              size="small"
              type="primary"
              plain
              :disabled="countdown > 0"
              @click="handleResendSms"
            >
              {{ countdown > 0 ? `${countdown}秒后重发` : '重新发送' }}
            </van-button>
          </div>
          <div class="sms-tip">验证码已发送至 {{ formData.phone }}</div>

          <van-button
            type="primary"
            block
            round
            :loading="loading"
            native-type="submit"
            class="submit-btn"
            style="margin-top: 32px"
          >
            下一步
          </van-button>
        </div>
      </van-form>

      <!-- 步骤3: 设置新密码 -->
      <van-form v-if="currentStep === 3" @submit="handleResetPassword">
        <div class="form-content">
          <div class="input-label">新密码</div>
          <div class="password-row">
            <input
              v-model="formData.newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="不低于6位"
              class="password-input"
            />
            <van-icon
              :name="showPassword ? 'eye-o' : 'closed-eye'"
              @click="showPassword = !showPassword"
            />
          </div>
          <div class="password-strength" v-if="formData.newPassword">
            <div class="strength-label">密码强度：</div>
            <div class="strength-bars">
              <div
                class="strength-bar"
                :class="{ active: passwordStrength >= 1, weak: passwordStrength === 1 }"
              ></div>
              <div
                class="strength-bar"
                :class="{ active: passwordStrength >= 2, medium: passwordStrength === 2 }"
              ></div>
              <div
                class="strength-bar"
                :class="{ active: passwordStrength >= 3, strong: passwordStrength === 3 }"
              ></div>
            </div>
            <span class="strength-text">{{ passwordStrengthText }}</span>
          </div>

          <div class="input-label" style="margin-top: 24px">确认密码</div>
          <div class="password-row">
            <input
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="请再次输入密码"
              class="password-input"
            />
            <van-icon
              :name="showConfirmPassword ? 'eye-o' : 'closed-eye'"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </div>
          <div class="password-tip" v-if="formData.confirmPassword && formData.newPassword !== formData.confirmPassword">
            两次输入的密码不一致
          </div>

          <van-button
            type="primary"
            block
            round
            :loading="loading"
            native-type="submit"
            class="submit-btn"
            style="margin-top: 32px"
          >
            确认修改
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'

const router = useRouter()
const loading = ref(false)
const currentStep = ref(1) // 1: 图形验证码, 2: 短信验证码, 3: 设置新密码
const countdown = ref(0) // 短信倒计时
const captchaCanvas = ref(null)
const captchaCode = ref('') // 实际生成的验证码
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = reactive({
  phone: '17696837781',
  captcha: '',
  smsCode: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码强度计算
const passwordStrength = computed(() => {
  const pwd = formData.newPassword
  if (!pwd) return 0

  let strength = 0
  // 长度
  if (pwd.length >= 6) strength++
  // 包含数字和字母
  if (/\d/.test(pwd) && /[a-zA-Z]/.test(pwd)) strength++
  // 包含大小写或特殊字符
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

// 生成图形验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 去除容易混淆的字符
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  captchaCode.value = code

  // 绘制验证码
  if (captchaCanvas.value) {
    const ctx = captchaCanvas.value.getContext('2d')
    const width = 100
    const height = 36

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 背景
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, width, height)

    // 干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.3)`
      ctx.beginPath()
      ctx.moveTo(Math.random() * width, Math.random() * height)
      ctx.lineTo(Math.random() * width, Math.random() * height)
      ctx.stroke()
    }

    // 验证码文字
    ctx.font = 'bold 20px Arial'
    ctx.textBaseline = 'middle'
    for (let i = 0; i < code.length; i++) {
      ctx.fillStyle = `rgb(${Math.random() * 100},${Math.random() * 100},${Math.random() * 100})`
      const x = 15 + i * 20
      const y = height / 2
      const angle = (Math.random() - 0.5) * 0.4
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.fillText(code[i], 0, 0)
      ctx.restore()
    }

    // 干扰点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.4)`
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1)
    }
  }
}

// 刷新验证码
const refreshCaptcha = () => {
  generateCaptcha()
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 步骤1：获取短信验证码
const handleGetSmsCode = () => {
  if (!formData.captcha) {
    showToast('请输入图形验证码')
    return
  }
  if (formData.captcha.toUpperCase() !== captchaCode.value) {
    showToast('图形验证码错误')
    refreshCaptcha()
    formData.captcha = ''
    return
  }

  loading.value = true
  // 模拟发送短信
  setTimeout(() => {
    loading.value = false
    showSuccessToast('短信验证码已发送')
    currentStep.value = 2
    startCountdown()
  }, 1000)
}

// 重新发送短信
const handleResendSms = () => {
  if (countdown.value > 0) return

  loading.value = true
  setTimeout(() => {
    loading.value = false
    showSuccessToast('短信验证码已重新发送')
    startCountdown()
  }, 1000)
}

// 步骤2：验证短信验证码
const handleVerifySmsCode = () => {
  if (!formData.smsCode) {
    showToast('请输入短信验证码')
    return
  }
  if (formData.smsCode.length !== 6) {
    showToast('请输入6位短信验证码')
    return
  }

  loading.value = true
  // 模拟验证短信验证码
  setTimeout(() => {
    loading.value = false
    // 这里应该调用API验证，模拟验证成功
    currentStep.value = 3
  }, 1000)
}

// 步骤3：重置密码
const handleResetPassword = () => {
  if (!formData.newPassword) {
    showToast('请输入新密码')
    return
  }
  if (formData.newPassword.length < 6) {
    showToast('密码不能少于6位')
    return
  }
  if (!formData.confirmPassword) {
    showToast('请确认密码')
    return
  }
  if (formData.newPassword !== formData.confirmPassword) {
    showToast('两次输入的密码不一致')
    return
  }

  loading.value = true
  // 模拟重置密码
  setTimeout(() => {
    loading.value = false
    showSuccessToast('密码修改成功')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }, 1000)
}

onMounted(() => {
  generateCaptcha()
})
</script>

<style lang="scss" scoped>
.forget-password-page {
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

.forget-card {
  position: relative;
  margin: -80px 20px 20px;
  background: white;
  border-radius: 16px;
  padding: 20px 24px 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);

  .back-link {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #4E8EF7;
    font-size: 14px;
    cursor: pointer;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 32px;
  }

  .form-content {
    .input-label {
      font-size: 14px;
      color: #333;
      margin-bottom: 12px;
    }

    .phone-display {
      font-size: 16px;
      color: #333;
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e5e5;
    }

    .captcha-row {
      display: flex;
      gap: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e5e5;

      .captcha-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        color: #333;

        &::placeholder {
          color: #ccc;
        }
      }

      .captcha-image {
        width: 100px;
        height: 36px;
        background: #f0f0f0;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }

    .captcha-tip {
      font-size: 12px;
      color: #999;
      margin-top: 8px;
      margin-bottom: 32px;
      text-align: right;
      cursor: pointer;
    }

    .sms-row {
      display: flex;
      gap: 12px;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e5e5;

      .sms-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        color: #333;

        &::placeholder {
          color: #ccc;
        }
      }
    }

    .sms-tip {
      font-size: 12px;
      color: #999;
      margin-top: 8px;
      margin-bottom: 8px;
    }

    .password-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e5e5;

      .password-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        color: #333;

        &::placeholder {
          color: #ccc;
        }
      }

      .van-icon {
        color: #999;
        cursor: pointer;
        font-size: 18px;
      }
    }

    .password-strength {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      font-size: 12px;

      .strength-label {
        color: #666;
      }

      .strength-bars {
        display: flex;
        gap: 4px;
        flex: 1;

        .strength-bar {
          height: 4px;
          flex: 1;
          background: #e5e5e5;
          border-radius: 2px;
          transition: background 0.3s;

          &.active.weak {
            background: #FF3B30;
          }

          &.active.medium {
            background: #FF8C00;
          }

          &.active.strong {
            background: #09BB07;
          }
        }
      }

      .strength-text {
        color: #666;
        min-width: 20px;
      }
    }

    .password-tip {
      font-size: 12px;
      color: #FF3B30;
      margin-top: 8px;
    }

    .submit-btn {
      height: 48px;
      font-size: 16px;
      background: linear-gradient(90deg, #6BA8FF 0%, #4E8EF7 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(78, 142, 247, 0.3);
    }
  }
}
</style>
