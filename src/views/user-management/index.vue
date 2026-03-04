<template>
  <div class="user-management-page page">
    <van-nav-bar
      title="我的用户"
      left-arrow
      fixed
      placeholder
      @click-left="router.back()"
    />

    <!-- 搜索栏 -->
    <van-search
      v-model="searchValue"
      placeholder="请输入用户名/地址/电话查找/用户编号"
      show-action
      @search="handleSearch"
    >
      <template #action>
        <div @click="handleSearch" style="color: #4E8EF7; font-size: 15px">搜索</div>
      </template>
    </van-search>

    <!-- Tab标签栏 -->
    <van-tabs v-model:active="activeTab" @change="handleTabChange" class="user-tabs" scrollable>
      <van-tab title="公众号" name="gzh" />
      <van-tab title="微信小程序" name="wxapp" />
      <van-tab title="电话" name="phone" />
      <van-tab title="二维码" name="qrcode" />
      <van-tab title="支付宝小程序" name="aliapp" />
    </van-tabs>

    <!-- 统计卡片 -->
    <div class="stats-card">
      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-label">用户数</div>
          <div class="stat-value">{{ stats.totalUsers }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">本月新增</div>
          <div class="stat-value">{{ stats.monthNew }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">本月活跃</div>
          <div class="stat-value">{{ stats.monthActive }}</div>
        </div>
      </div>
      <div class="stats-row-bottom">
        <div class="stat-info">
          <span class="info-label">今日新增用户</span>
          <span class="info-value">{{ stats.todayNew }}</span>
        </div>
        <div class="stat-info">
          <span class="info-label">上月新增</span>
          <span class="info-value">{{ stats.lastMonthNew }}</span>
        </div>
        <div class="stat-info">
          <span class="info-label">上月活跃</span>
          <span class="info-value">{{ stats.lastMonthActive }}</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮区 -->
    <div class="action-bar">
      <div class="filter-btn" @click="showFilterPopup = true">
        <span>筛选</span>
        <van-icon name="arrow-down" />
      </div>
      <div class="action-buttons">
        <van-button plain type="primary" size="small" @click="handleAddUser">
          新建用户
        </van-button>
      </div>
    </div>

    <!-- 用户列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了！"
        @load="onLoad"
      >
        <div v-for="user in userList" :key="user.id" class="user-item" @click="goDetail(user.id)">
          <div class="user-header">
            <van-image
              round
              width="50"
              height="50"
              :src="user.avatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
            />
            <div class="user-info">
              <h4>{{ user.name }}</h4>
              <p>{{ user.phone }}</p>
            </div>
            <van-tag v-if="user.isVip" type="warning">VIP</van-tag>
          </div>
          <van-cell-group :border="false">
            <van-cell title="地址" :value="user.address" />
            <van-cell title="余额" :value="`¥${user.balance}`" />
            <van-cell title="水票" :value="`${user.tickets}张`" />
          </van-cell-group>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && userList.length === 0" class="empty-state">
          <p>没有更多了！</p>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 底部导航 -->
    <tabbar />

    <!-- 筛选弹窗 -->
    <van-popup v-model:show="showFilterPopup" position="bottom" round>
      <div class="filter-popup">
        <div class="filter-header">筛选</div>
        <!-- 这里可以添加筛选内容 -->
        <van-button type="primary" block @click="showFilterPopup = false">确定</van-button>
      </div>
    </van-popup>

    <!-- 新建用户弹窗 -->
    <van-popup v-model:show="showAddUserPopup" position="center" round :style="{ width: '90%', maxHeight: '85vh' }">
      <div class="add-user-popup">
        <div class="popup-header">
          <span class="popup-title">新建用户</span>
          <van-icon name="cross" class="close-icon" @click="closeAddUser" />
        </div>

        <van-form class="user-form">
          <van-cell-group :border="false">
            <!-- 渠道 -->
            <van-field
              readonly
              required
              label="渠道"
              :model-value="getChannelText(newUser.channel)"
              is-link
              @click="showChannelPicker = true"
            />

            <!-- 编号 -->
            <van-field
              v-model="newUser.userCode"
              required
              label="编号"
              placeholder="请输入或选择编号"
            >
              <template #button>
                <van-button size="small" type="primary" @click="generateRandomCode">随机编号</van-button>
              </template>
            </van-field>

            <!-- 联系人 -->
            <van-field
              v-model="newUser.contact"
              required
              label="联系人"
              placeholder="请输入联系人"
            />

            <!-- 电话 -->
            <van-field
              v-model="newUser.phone"
              required
              label="电话"
              type="tel"
              placeholder="请输入电话"
              maxlength="11"
            />

            <!-- 地址 -->
            <van-field
              v-model="newUser.address"
              required
              label="地址"
              placeholder="请输入地址"
            />

            <!-- 地址类型 -->
            <van-field required label="地址类型">
              <template #input>
                <van-radio-group v-model="newUser.addressType" direction="horizontal">
                  <van-radio name="elevator" icon-size="18px">电梯</van-radio>
                  <van-radio name="stairs" icon-size="18px">步梯</van-radio>
                </van-radio-group>
              </template>
            </van-field>

            <!-- 备注 -->
            <van-field
              v-model="newUser.remark"
              required
              label="备注"
              placeholder="请输入备注信息"
            />

            <!-- 是否加入老用户 -->
            <van-field label="是否加入老用户">
              <template #input>
                <div class="old-user-field">
                  <van-switch v-model="newUser.isOldUser" size="20px" />
                  <van-button size="small" type="primary" plain @click="handleJoinOldUser">加入老用户</van-button>
                </div>
              </template>
            </van-field>
          </van-cell-group>
        </van-form>

        <!-- 底部按钮组 -->
        <div class="popup-footer">
          <van-button plain @click="closeAddUser">取消</van-button>
          <van-button type="primary" plain @click="handleSave">保存</van-button>
          <van-button type="primary" @click="handleSaveAndOrder">保存并下单</van-button>
        </div>
      </div>
    </van-popup>

    <!-- 渠道选择器 -->
    <van-popup v-model:show="showChannelPicker" position="bottom" round>
      <van-picker
        :columns="channelOptions"
        @confirm="onChannelConfirm"
        @cancel="showChannelPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import Tabbar from '@/components/Tabbar.vue'

const router = useRouter()

const searchValue = ref('')
const activeTab = ref('gzh')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const showFilterPopup = ref(false)
const showAddUserPopup = ref(false)
const showChannelPicker = ref(false)

// 渠道选项
const channelOptions = [
  { text: '公众号', value: 'gzh' },
  { text: '微信小程序', value: 'wxapp' },
  { text: '电话', value: 'phone' },
  { text: '二维码', value: 'qrcode' },
  { text: '支付宝小程序', value: 'aliapp' }
]

// 统计数据
const stats = ref({
  totalUsers: 0,
  monthNew: 0,
  monthActive: 0,
  todayNew: 0,
  lastMonthNew: 0,
  lastMonthActive: 0
})

// 新建用户表单数据
const newUser = reactive({
  channel: 'gzh',
  userCode: '',
  contact: '',
  phone: '',
  address: '',
  addressType: 'elevator',
  remark: '',
  isOldUser: false
})

// 重置新建用户表单
const resetNewUser = () => {
  newUser.channel = 'gzh'
  newUser.userCode = ''
  newUser.contact = ''
  newUser.phone = ''
  newUser.address = ''
  newUser.addressType = 'elevator'
  newUser.remark = ''
  newUser.isOldUser = false
}

// 模拟用户数据
const userList = ref([
  {
    id: 1,
    name: '张三',
    phone: '138****5678',
    avatar: '',
    address: '北京市朝阳区某某小区1号楼101',
    balance: 280,
    tickets: 5,
    isVip: true
  },
  {
    id: 2,
    name: '李四',
    phone: '139****6789',
    avatar: '',
    address: '北京市海淀区某某小区2号楼202',
    balance: 150,
    tickets: 3,
    isVip: false
  }
])

const onLoad = () => {
  setTimeout(() => {
    loading.value = false
    finished.value = true
  }, 500)
}

const onRefresh = () => {
  setTimeout(() => {
    refreshing.value = false
    finished.value = false
    loading.value = false
  }, 1000)
}

const handleSearch = () => {
  console.log('搜索:', searchValue.value)
}

const handleTabChange = (name) => {
  console.log('切换标签:', name)
  // 重新加载数据
}

const handleAddUser = () => {
  resetNewUser()
  showAddUserPopup.value = true
}

const closeAddUser = () => {
  showAddUserPopup.value = false
}

// 获取渠道文本
const getChannelText = (value) => {
  const channel = channelOptions.find(item => item.value === value)
  return channel ? channel.text : ''
}

// 渠道选择确认
const onChannelConfirm = ({ selectedOptions }) => {
  newUser.channel = selectedOptions[0].value
  showChannelPicker.value = false
}

// 生成随机编号
const generateRandomCode = () => {
  // 生成8位随机编号
  const code = 'U' + Date.now().toString().slice(-7)
  newUser.userCode = code
  showToast('已生成随机编号')
}

// 加入老用户
const handleJoinOldUser = () => {
  if (newUser.isOldUser) {
    showToast('该用户已加入老用户')
  } else {
    showToast('加入老用户功能待实现')
  }
}

// 保存
const handleSave = () => {
  // 验证必填字段
  if (!newUser.channel) {
    showToast('请选择渠道')
    return
  }
  if (!newUser.userCode.trim()) {
    showToast('请输入用户编号')
    return
  }
  if (!newUser.contact.trim()) {
    showToast('请输入联系人')
    return
  }
  if (!newUser.phone.trim()) {
    showToast('请输入电话')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(newUser.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  if (!newUser.address.trim()) {
    showToast('请输入地址')
    return
  }
  if (!newUser.remark.trim()) {
    showToast('请输入备注信息')
    return
  }

  // 模拟添加用户
  const newId = userList.value.length + 1
  const user = {
    id: newId,
    name: newUser.contact,
    phone: newUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    avatar: '',
    address: newUser.address,
    balance: 0,
    tickets: 0,
    isVip: false
  }

  userList.value.unshift(user)

  // 更新统计数据
  stats.value.totalUsers++
  stats.value.todayNew++

  showToast('保存成功')
  showAddUserPopup.value = false
  resetNewUser()
}

// 保存并下单
const handleSaveAndOrder = () => {
  // 验证必填字段
  if (!newUser.channel) {
    showToast('请选择渠道')
    return
  }
  if (!newUser.userCode.trim()) {
    showToast('请输入用户编号')
    return
  }
  if (!newUser.contact.trim()) {
    showToast('请输入联系人')
    return
  }
  if (!newUser.phone.trim()) {
    showToast('请输入电话')
    return
  }
  if (!/^1[3-9]\d{9}$/.test(newUser.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  if (!newUser.address.trim()) {
    showToast('请输入地址')
    return
  }
  if (!newUser.remark.trim()) {
    showToast('请输入备注信息')
    return
  }

  // 模拟添加用户
  const newId = userList.value.length + 1
  const user = {
    id: newId,
    name: newUser.contact,
    phone: newUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    avatar: '',
    address: newUser.address,
    balance: 0,
    tickets: 0,
    isVip: false
  }

  userList.value.unshift(user)

  // 更新统计数据
  stats.value.totalUsers++
  stats.value.todayNew++

  showToast('保存成功，即将跳转下单...')
  showAddUserPopup.value = false
  resetNewUser()

  // 跳转到下单页面
  setTimeout(() => {
    router.push('/order-create')
  }, 1000)
}

const submitAddUser = () => {
  handleSave()
}

const goDetail = (id) => {
  router.push(`/user-detail/${id}`)
}
</script>

<style lang="scss" scoped>
.user-management-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 60px;

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

  :deep(.van-search) {
    padding: 12px 16px;
    background: white;

    .van-search__content {
      background: #f5f5f5;
    }
  }
}

// Tab标签样式
.user-tabs {
  background: white;
  margin-bottom: 12px;

  :deep(.van-tab) {
    font-size: 15px;
    color: #666;
    padding: 0 16px;
  }

  :deep(.van-tab--active) {
    color: #4E8EF7;
    font-weight: 500;
  }

  :deep(.van-tabs__line) {
    background: #4E8EF7;
    width: 30px;
  }
}

// 统计卡片样式
.stats-card {
  background: white;
  padding: 20px 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .stats-row {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f5f5f5;

    .stat-item {
      text-align: center;
      flex: 1;

      .stat-label {
        font-size: 14px;
        color: #999;
        margin-bottom: 10px;
      }

      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #4E8EF7;
      }
    }
  }

  .stats-row-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .stat-info {
      display: flex;
      align-items: center;
      font-size: 13px;

      .info-label {
        color: #999;
        margin-right: 4px;
      }

      .info-value {
        color: #4E8EF7;
        font-weight: 500;
      }
    }
  }
}

// 操作按钮区
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .filter-btn {
    display: flex;
    align-items: center;
    color: #4E8EF7;
    font-size: 15px;
    cursor: pointer;
    font-weight: 500;

    span {
      margin-right: 4px;
    }

    .van-icon {
      font-size: 14px;
    }
  }

  .action-buttons {
    display: flex;
    gap: 10px;

    :deep(.van-button) {
      height: 34px;
      padding: 0 18px;
      font-size: 14px;
      border-color: #4E8EF7;
      color: #4E8EF7;
      font-weight: 500;
      border-radius: 17px;
    }
  }
}

// 用户列表项
.user-item {
  background: white;
  margin: 0 12px 12px;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .user-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f5f5f5;

    .user-info {
      flex: 1;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 6px;
      }

      p {
        font-size: 14px;
        color: #999;
      }
    }

    :deep(.van-tag) {
      font-weight: 500;
    }
  }

  :deep(.van-cell-group) {
    background: transparent;
  }

  :deep(.van-cell) {
    padding: 10px 0;
    font-size: 14px;

    &::after {
      border-bottom: none;
    }

    .van-cell__title {
      color: #999;
      font-size: 14px;
    }

    .van-cell__value {
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

// 空状态
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 14px;
}

// 筛选弹窗
.filter-popup {
  padding: 20px;

  .filter-header {
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 20px;
  }

  :deep(.van-button) {
    margin-top: 20px;
    background: #4E8EF7;
    border-color: #4E8EF7;
  }
}

// 新建用户弹窗
.add-user-popup {
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;

  .popup-header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;

    .popup-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }

    .close-icon {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      color: #969799;
      cursor: pointer;

      &:active {
        opacity: 0.6;
      }
    }
  }

  .user-form {
    flex: 1;
    overflow-y: auto;
    padding: 0 0 16px;

    :deep(.van-cell-group) {
      background: white;
    }

    :deep(.van-cell) {
      padding: 12px 16px;
      align-items: center;
    }

    :deep(.van-field__label) {
      width: auto;
      min-width: 100px;
      color: #333;
      font-size: 14px;

      &::before {
        color: #ee0a24;
      }
    }

    :deep(.van-field__value) {
      flex: 1;
    }

    :deep(.van-field__control) {
      font-size: 14px;
      color: #333;
    }

    :deep(.van-field__control::placeholder) {
      color: #c8c9cc;
    }

    :deep(.van-field__button) {
      .van-button {
        height: 28px;
        padding: 0 12px;
        font-size: 12px;
      }
    }

    :deep(.van-radio-group) {
      display: flex;
      gap: 24px;
    }

    :deep(.van-radio) {
      .van-radio__label {
        font-size: 14px;
        color: #333;
        margin-left: 6px;
      }

      .van-radio__icon--checked {
        .van-icon {
          background-color: #4E8EF7;
          border-color: #4E8EF7;
        }
      }
    }

    .old-user-field {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;

      .van-switch {
        flex-shrink: 0;
      }

      .van-button {
        flex: 1;
        height: 32px;
        font-size: 14px;
      }
    }

    :deep(.van-switch) {
      background-color: #dcdee0;

      &.van-switch--on {
        background-color: #4E8EF7;
      }
    }
  }

  .popup-footer {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid #f0f0f0;
    background: white;

    .van-button {
      flex: 1;
      height: 40px;
      font-size: 14px;
      border-radius: 20px;

      &:first-child {
        border-color: #c8c9cc;
        color: #666;
      }

      &:nth-child(2) {
        background: #E8F4FF;
        border-color: #4E8EF7;
        color: #4E8EF7;
      }

      &:last-child {
        background: #4E8EF7;
        border-color: #4E8EF7;
        color: white;
      }
    }
  }
}
</style>
