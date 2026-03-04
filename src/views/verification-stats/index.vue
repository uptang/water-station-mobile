<template>
  <div class="verification-stats-page page">
    <van-nav-bar title="待核销统计" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <!-- 时间选择 -->
      <div class="time-selector" @click="showTimePicker = true">
        <span>{{ currentTimeLabel }}</span>
        <van-icon name="arrow-down" />
      </div>

      <!-- 人员列表 -->
      <div v-for="(person, index) in personList" :key="index" class="person-card">
        <div class="person-header">
          <div class="person-info">
            <van-icon name="user-o" size="20" color="#666" />
            <span class="name">{{ person.name }}</span>
            <span class="phone">{{ person.phone }}</span>
          </div>
          <span class="detail-link" @click="goDetail(person.id)">
            详情 <van-icon name="arrow" />
          </span>
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-value primary">{{ person.deliveryOrder }}</div>
            <div class="stat-label">配送订单</div>
          </div>
          <div class="stat-item">
            <div class="stat-value primary">
              {{ person.deliveryGoods }}
            </div>
            <div class="stat-label">
              配送商品
              <van-icon name="question-o" size="14" color="#999" />
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-value price">¥{{ person.amount }}</div>
            <div class="stat-label">金额</div>
          </div>
        </div>

        <div class="bottom-stats">
          <div class="bottom-item">
            <div class="bottom-value">{{ person.returnBarrel }}</div>
            <div class="bottom-label">回桶</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-value">{{ person.depositBarrel }}</div>
            <div class="bottom-label">押桶</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-value">{{ person.refundBarrel }}</div>
            <div class="bottom-label">退桶</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-value">{{ person.paperTicket }}</div>
            <div class="bottom-label">配送纸票</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-value">{{ person.returnTicket }}</div>
            <div class="bottom-label">回票</div>
          </div>
        </div>
      </div>

      <div class="empty-tip">暂无更多</div>
    </div>

    <!-- 时间选择器弹窗 -->
    <van-popup v-model:show="showTimePicker" position="bottom" round>
      <van-picker
        :columns="timeOptions"
        @confirm="onTimeConfirm"
        @cancel="showTimePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 时间选择
const currentTimeLabel = ref('上月')
const showTimePicker = ref(false)
const timeOptions = ['本日', '昨日', '本周', '本月', '上月', '自定义时间']

// 人员列表
const personList = ref([
  {
    id: 1,
    name: '宋再洋',
    phone: '17696837781',
    deliveryOrder: 2,
    deliveryGoods: 2,
    amount: '0.00',
    returnBarrel: 0,
    depositBarrel: 0,
    refundBarrel: 0,
    paperTicket: 0,
    returnTicket: 0
  }
])

// 时间选择确认
const onTimeConfirm = ({ selectedValues }) => {
  currentTimeLabel.value = selectedValues[0]
  showTimePicker.value = false
  showToast(`切换到${selectedValues[0]}`)
}

// 查看详情
const goDetail = (id) => {
  router.push('/delivery-stats')
}
</script>

<style lang="scss" scoped>
.verification-stats-page {
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
  padding: 0 12px 20px;
}

// 时间选择器
.time-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: white;
  margin-bottom: 12px;
  border-radius: 8px;
  cursor: pointer;

  span {
    font-size: 15px;
    color: #333;
    font-weight: 500;
  }

  .van-icon {
    font-size: 14px;
    color: #666;
  }
}

// 人员卡片
.person-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  .person-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    margin-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    .person-info {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;

      .name {
        font-size: 15px;
        font-weight: 500;
        color: #333;
      }

      .phone {
        font-size: 14px;
        color: #666;
      }
    }

    .detail-link {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #999;
      cursor: pointer;

      .van-icon {
        font-size: 12px;
      }
    }
  }

  .stats-row {
    display: flex;
    justify-content: space-around;
    margin-bottom: 16px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;

    .stat-item {
      text-align: center;

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 6px;

        &.primary {
          color: #4E8EF7;
        }

        &.price {
          color: #FF3B30;
        }
      }

      .stat-label {
        font-size: 13px;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }
    }
  }

  .bottom-stats {
    display: flex;
    justify-content: space-around;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;

    .bottom-item {
      text-align: center;

      .bottom-value {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      .bottom-label {
        font-size: 12px;
        color: #666;
      }
    }
  }
}

.empty-tip {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>
