<template>
  <div class="login-page">
    <!-- 顶部背景区域 -->
    <div class="header-bg">
      <div class="logo-container">
        <div class="logo-text">吉客道</div>
      </div>
    </div>

    <!-- 登录表单卡片 -->
    <div class="login-card">
      <h2 class="title">吉客道商家管理系统</h2>

      <div class="form-container">
        <!-- 手机号输入 -->
        <div class="input-group">
          <van-icon name="user-o" class="input-icon" />
          <input
            v-model="formData.phone"
            type="tel"
            placeholder="17696837781"
            maxlength="11"
          />
        </div>

        <!-- 密码输入 -->
        <div class="input-group">
          <van-icon name="lock" class="input-icon" />
          <input
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••••••••"
          />
          <van-icon
            :name="showPassword ? 'eye-o' : 'closed-eye'"
            class="eye-icon"
            @click="showPassword = !showPassword"
          />
        </div>

        <!-- 记住密码 -->
        <div class="remember-row">
          <van-checkbox v-model="rememberPassword" icon-size="18px">
            记住密码
          </van-checkbox>
        </div>

        <!-- 登录按钮 -->
        <van-button
          type="primary"
          block
          round
          :loading="loading"
          @click="handleLogin"
          class="login-btn"
        >
          登录
        </van-button>

        <!-- 忘记密码和注册 -->
        <div class="footer-links">
          <span class="link" @click="goToForget">忘记密码？</span>
          <span class="link" @click="goToRegister">门店注册</span>
        </div>
      </div>

      <!-- 协议 -->
      <div class="agreement">
        <van-checkbox v-model="agreedProtocol" icon-size="16px">
          我已阅读并同意《吉客道企业订单管理系统》隐私协议和用户协议
        </van-checkbox>
      </div>
    </div>

    <!-- 版本号 -->
    <div class="version">App Version 2.1.4&20260102</div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formData = reactive({
  phone: '',
  password: ''
})

const showPassword = ref(false)
const rememberPassword = ref(false)
const agreedProtocol = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  if (!formData.phone) {
    showToast('请输入手机号')
    return
  }
  if (!formData.password) {
    showToast('请输入密码')
    return
  }
  if (!agreedProtocol.value) {
    showToast('请阅读并同意协议')
    return
  }

  loading.value = true

  try {
    setTimeout(() => {
      const mockToken = 'mock_token_' + Date.now()
      const mockUserInfo = {
        id: 1,
        phone: formData.phone,
        name: '商家用户'
      }

      userStore.setToken(mockToken)
      userStore.setUserInfo(mockUserInfo)

      showToast('登录成功')
      router.replace('/home')
      loading.value = false
    }, 1000)
  } catch (error) {
    loading.value = false
    showToast(error.message || '登录失败')
  }
}

const goToForget = () => {
  router.push('/forget-password')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
}

.header-bg {
  height: 380px;
  background: linear-gradient(180deg, #6BA8FF 0%, #4E8EF7 100%);
  position: relative;
  overflow: hidden;

  // 方格背景
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
    text-align: center;

    .logo-text {
      font-size: 64px;
      font-weight: bold;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      letter-spacing: 4px;
      font-family: 'Microsoft YaHei', sans-serif;
    }
  }
}

.login-card {
  position: relative;
  margin: -100px 20px 0;
  background: white;
  border-radius: 24px;
  padding: 32px 24px 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);

  .title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 40px;
  }

  .form-container {
    .input-group {
      position: relative;
      margin-bottom: 24px;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      padding-bottom: 12px;

      .input-icon {
        font-size: 22px;
        color: #999;
        margin-right: 12px;
      }

      input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 16px;
        color: #333;

        &::placeholder {
          color: #ccc;
        }
      }

      .eye-icon {
        font-size: 20px;
        color: #999;
        cursor: pointer;
      }
    }

    .remember-row {
      margin-bottom: 32px;

      :deep(.van-checkbox__label) {
        color: #666;
        font-size: 14px;
      }
    }

    .login-btn {
      height: 50px;
      font-size: 18px;
      font-weight: 500;
      background: linear-gradient(90deg, #6BA8FF 0%, #4E8EF7 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(78, 142, 247, 0.3);
      margin-bottom: 20px;
    }

    .footer-links {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;

      .link {
        font-size: 14px;
        color: #999;
        cursor: pointer;

        &:last-child {
          color: #4E8EF7;
        }
      }
    }
  }

  .agreement {
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;

    :deep(.van-checkbox__label) {
      color: #999;
      font-size: 12px;
      line-height: 1.6;
    }
  }
}

.version {
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 20px 0;
}
</style>
