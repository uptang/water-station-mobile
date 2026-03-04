<template>
  <div class="platform-config-page page-with-tabbar">
    <van-nav-bar title="平台配置" left-arrow fixed placeholder @click-left="onClickLeft" />

    <div class="config-content">
      <!-- 拼多多配置 -->
      <van-cell-group title="拼多多平台配置" inset>
        <van-field
          v-model="pinduoduo.clientId"
          label="Client ID"
          placeholder="请输入拼多多Client ID"
          required
        />
        <van-field
          v-model="pinduoduo.clientSecret"
          label="Client Secret"
          type="password"
          placeholder="请输入拼多多Client Secret"
          required
        />
        <van-field
          v-model="pinduoduo.accessToken"
          label="Access Token"
          type="password"
          placeholder="请输入授权Token"
          required
        />
        <van-cell title="状态">
          <template #right-icon>
            <van-tag :type="pinduoduo.enabled ? 'success' : 'default'">
              {{ pinduoduo.enabled ? '已启用' : '未启用' }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell center title="启用拼多多同步">
          <template #right-icon>
            <van-switch v-model="pinduoduo.enabled" size="24" />
          </template>
        </van-cell>
        <van-cell title="测试连接" is-link @click="testConnection('pinduoduo')">
          <template #right-icon>
            <van-button size="small" type="primary">测试</van-button>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 饿了么配置 -->
      <van-cell-group title="饿了么平台配置" inset>
        <van-field
          v-model="eleme.appKey"
          label="App Key"
          placeholder="请输入饿了么App Key"
          required
        />
        <van-field
          v-model="eleme.appSecret"
          label="App Secret"
          type="password"
          placeholder="请输入饿了么App Secret"
          required
        />
        <van-field
          v-model="eleme.accessToken"
          label="Access Token"
          type="password"
          placeholder="请输入授权Token"
          required
        />
        <van-cell title="状态">
          <template #right-icon>
            <van-tag :type="eleme.enabled ? 'success' : 'default'">
              {{ eleme.enabled ? '已启用' : '未启用' }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell center title="启用饿了么同步">
          <template #right-icon>
            <van-switch v-model="eleme.enabled" size="24" />
          </template>
        </van-cell>
        <van-cell title="测试连接" is-link @click="testConnection('eleme')">
          <template #right-icon>
            <van-button size="small" type="primary">测试</van-button>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 抖音配置 -->
      <van-cell-group title="抖音平台配置" inset>
        <van-field
          v-model="douyin.appId"
          label="App ID"
          placeholder="请输入抖音App ID"
          required
        />
        <van-field
          v-model="douyin.appSecret"
          label="App Secret"
          type="password"
          placeholder="请输入抖音App Secret"
          required
        />
        <van-field
          v-model="douyin.accessToken"
          label="Access Token"
          type="password"
          placeholder="请输入授权Token"
          required
        />
        <van-cell title="状态">
          <template #right-icon>
            <van-tag :type="douyin.enabled ? 'success' : 'default'">
              {{ douyin.enabled ? '已启用' : '未启用' }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell center title="启用抖音同步">
          <template #right-icon>
            <van-switch v-model="douyin.enabled" size="24" />
          </template>
        </van-cell>
        <van-cell title="测试连接" is-link @click="testConnection('douyin')">
          <template #right-icon>
            <van-button size="small" type="primary">测试</van-button>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 美团配置 -->
      <van-cell-group title="美团平台配置" inset>
        <van-field
          v-model="meituan.appKey"
          label="App Key"
          placeholder="请输入美团App Key"
          required
        />
        <van-field
          v-model="meituan.appSecret"
          label="App Secret"
          type="password"
          placeholder="请输入美团App Secret"
          required
        />
        <van-field
          v-model="meituan.accessToken"
          label="Access Token"
          type="password"
          placeholder="请输入授权Token"
          required
        />
        <van-cell title="状态">
          <template #right-icon>
            <van-tag :type="meituan.enabled ? 'success' : 'default'">
              {{ meituan.enabled ? '已启用' : '未启用' }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell center title="启用美团同步">
          <template #right-icon>
            <van-switch v-model="meituan.enabled" size="24" />
          </template>
        </van-cell>
        <van-cell title="测试连接" is-link @click="testConnection('meituan')">
          <template #right-icon>
            <van-button size="small" type="primary">测试</van-button>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 同步设置 -->
      <van-cell-group title="自动同步设置" inset>
        <van-cell center title="启用自动同步">
          <template #right-icon>
            <van-switch v-model="autoSyncEnabled" size="24" />
          </template>
        </van-cell>
        <van-cell
          v-if="autoSyncEnabled"
          title="同步间隔"
          is-link
          :value="syncInterval + '分钟'"
          @click="showIntervalPicker = true"
        />
        <van-cell
          v-if="autoSyncEnabled"
          title="最近同步时间"
          :value="lastSyncTime || '未同步'"
        />
      </van-cell-group>
    </div>

    <div class="save-btn-wrapper">
      <van-button type="primary" block round @click="saveConfig">保存配置</van-button>
    </div>

    <!-- 同步间隔选择器 -->
    <van-popup v-model:show="showIntervalPicker" position="bottom">
      <van-picker
        :columns="intervalOptions"
        @confirm="onIntervalConfirm"
        @cancel="showIntervalPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast, showLoadingToast, closeToast } from 'vant'

const router = useRouter()

const pinduoduo = reactive({
  clientId: '',
  clientSecret: '',
  accessToken: '',
  enabled: false
})

const eleme = reactive({
  appKey: '',
  appSecret: '',
  accessToken: '',
  enabled: false
})

const douyin = reactive({
  appId: '',
  appSecret: '',
  accessToken: '',
  enabled: false
})

const meituan = reactive({
  appKey: '',
  appSecret: '',
  accessToken: '',
  enabled: false
})

const autoSyncEnabled = ref(false)
const syncInterval = ref(30)
const lastSyncTime = ref('')
const showIntervalPicker = ref(false)

const intervalOptions = [
  { text: '5分钟', value: 5 },
  { text: '10分钟', value: 10 },
  { text: '15分钟', value: 15 },
  { text: '30分钟', value: 30 },
  { text: '60分钟', value: 60 }
]

const onClickLeft = () => {
  router.back()
}

const loadConfig = async () => {
  try {
    const savedConfig = localStorage.getItem('platformConfig')
    if (savedConfig) {
      const config = JSON.parse(savedConfig)
      Object.assign(pinduoduo, config.pinduoduo || {})
      Object.assign(eleme, config.eleme || {})
      Object.assign(douyin, config.douyin || {})
      Object.assign(meituan, config.meituan || {})
      autoSyncEnabled.value = config.autoSyncEnabled || false
      syncInterval.value = config.syncInterval || 30
      lastSyncTime.value = config.lastSyncTime || ''
    }
  } catch (error) {
    console.error('加载配置失败:', error)
  }
}

const saveConfig = async () => {
  const platforms = [
    { name: '拼多多', config: pinduoduo, enabled: pinduoduo.enabled },
    { name: '饿了么', config: eleme, enabled: eleme.enabled },
    { name: '抖音', config: douyin, enabled: douyin.enabled },
    { name: '美团', config: meituan, enabled: meituan.enabled }
  ]

  for (const platform of platforms) {
    if (platform.enabled) {
      if (!platform.config.clientId && !platform.config.appKey && !platform.config.appId) {
        showToast(`请${platform.name}配置必须的信息`)
        return
      }
    }
  }

  const config = {
    pinduoduo,
    eleme,
    douyin,
    meituan,
    autoSyncEnabled: autoSyncEnabled.value,
    syncInterval: syncInterval.value,
    lastSyncTime: lastSyncTime.value
  }

  try {
    showLoadingToast({ message: '保存中...', forbidClick: true })
    localStorage.setItem('platformConfig', JSON.stringify(config))
    setTimeout(() => {
      closeToast()
      showSuccessToast('配置保存成功')
    }, 500)
  } catch (error) {
    closeToast()
    showToast('保存失败: ' + error.message)
  }
}

const testConnection = async (platform) => {
  const platformNames = {
    pinduoduo: '拼多多',
    eleme: '饿了么',
    douyin: '抖音',
    meituan: '美团'
  }

  try {
    showLoadingToast({ message: `正在测试${platformNames[platform]}连接...`, forbidClick: true })
    setTimeout(() => {
      closeToast()
      showSuccessToast(`${platformNames[platform]}连接成功`)
    }, 1000)
  } catch (error) {
    closeToast()
    showToast(`${platformNames[platform]}连接失败: ` + error.message)
  }
}

const onIntervalConfirm = ({ selectedOptions }) => {
  syncInterval.value = selectedOptions[0].value
  showIntervalPicker.value = false
}

onMounted(() => {
  loadConfig()
})
</script>

<style lang="scss" scoped>
.platform-config-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 80px;
}

.config-content {
  padding: 16px 0;

  :deep(.van-cell-group) {
    margin-bottom: 16px;
  }

  :deep(.van-cell__title) {
    font-weight: 500;
    color: #333;
  }

  :deep(.van-field__label) {
    width: 100px;
    color: #666;
  }

  :deep(.van-button) {
    border-radius: 16px;
  }
}

.save-btn-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}
</style>
