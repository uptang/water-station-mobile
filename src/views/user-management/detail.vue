<template>
  <div class="user-detail-page page">
    <van-nav-bar
      title="用户详情"
      left-arrow
      @click-left="router.back()"
    />

    <div class="container">
      <!-- 用户基本信息 -->
      <div class="user-card">
        <div class="user-header">
          <van-image
            round
            width="60"
            height="60"
            :src="userInfo.avatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'"
          />
          <div class="user-info">
            <h3>{{ userInfo.name }}</h3>
            <p>{{ userInfo.phone }}</p>
          </div>
          <van-tag v-if="userInfo.isVip" type="warning">VIP</van-tag>
        </div>

        <van-cell-group :border="false">
          <van-cell title="地址" :value="userInfo.address" />
          <van-cell title="注册时间" :value="userInfo.registerTime" />
        </van-cell-group>
      </div>

      <!-- 账户信息 -->
      <div class="account-card">
        <h3>账户信息</h3>
        <van-row gutter="16">
          <van-col span="12">
            <div class="account-item">
              <p class="label">余额</p>
              <p class="value">¥{{ userInfo.balance }}</p>
            </div>
          </van-col>
          <van-col span="12">
            <div class="account-item">
              <p class="label">水票</p>
              <p class="value">{{ userInfo.tickets }}张</p>
            </div>
          </van-col>
          <van-col span="12">
            <div class="account-item">
              <p class="label">累计消费</p>
              <p class="value">¥{{ userInfo.totalConsume }}</p>
            </div>
          </van-col>
          <van-col span="12">
            <div class="account-item">
              <p class="label">订单数</p>
              <p class="value">{{ userInfo.orderCount }}</p>
            </div>
          </van-col>
        </van-row>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <van-button type="primary" block round>发放水票</van-button>
        <van-button plain type="primary" block round>充值</van-button>
        <van-button plain type="primary" block round>查看订单</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const userInfo = ref({
  id: route.params.id,
  name: '张三',
  phone: '138****5678',
  avatar: '',
  address: '北京市朝阳区某某小区1号楼101',
  registerTime: '2023-01-15 10:30',
  balance: 280,
  tickets: 5,
  totalConsume: 1580,
  orderCount: 28,
  isVip: true
})
</script>

<style lang="scss" scoped>
.user-detail-page {
  :deep(.van-nav-bar) {
    background: white;
  }
}

.user-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .user-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .user-info {
      flex: 1;

      h3 {
        font-size: 18px;
        font-weight: 500;
        color: #333;
        margin-bottom: 6px;
      }

      p {
        font-size: 14px;
        color: #666;
      }
    }
  }

  :deep(.van-cell-group) {
    background: transparent;
  }

  :deep(.van-cell) {
    padding: 8px 0;
    font-size: 14px;

    &::after {
      border-bottom: none;
    }

    .van-cell__title {
      color: #666;
    }

    .van-cell__value {
      color: #333;
    }
  }
}

.account-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  h3 {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 16px;
  }

  .account-item {
    text-align: center;
    padding: 16px 0;

    .label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .value {
      font-size: 20px;
      font-weight: bold;
      color: #4E8EF7;
    }
  }
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;

  :deep(.van-button--primary) {
    background: #4E8EF7;
    border-color: #4E8EF7;
  }

  :deep(.van-button--plain) {
    color: #4E8EF7;
    border-color: #4E8EF7;
  }
}
</style>
