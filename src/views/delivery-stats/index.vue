<template>
  <div class="delivery-stats-page page-with-tabbar">
    <van-nav-bar title="配送统计" left-arrow @click-left="router.back()" fixed placeholder />

    <div class="container">
      <!-- 时间选择 -->
      <div class="time-selector" @click="showTimePicker = true">
        <span>{{ currentTimeLabel }}</span>
        <van-icon name="arrow-down" />
      </div>

      <!-- 统计数据 -->
      <div class="stats-card">
        <div class="stats-header">
          <span class="title">统计数据</span>
          <span class="detail-link" @click="goStatsDetail">
            详情 <van-icon name="arrow" />
          </span>
        </div>

        <div class="stats-content">
          <!-- 左侧数据区域 -->
          <div class="stats-left">
            <div class="stat-row">
              <span class="stat-label">配送订单</span>
              <span class="stat-value">{{ stats.deliveryOrder }}</span>
            </div>
            <div class="stat-row">
              <span class="stat-label">
                配送商品
                <van-icon name="question-o" size="14" color="#999" />
              </span>
              <span class="stat-value">{{ stats.deliveryGoods }}</span>
            </div>
          </div>

          <!-- 右侧金额区域 -->
          <div class="stats-right">
            <div class="amount-label">金额</div>
            <div class="amount-value">¥{{ stats.amount }}</div>
          </div>
        </div>

        <!-- 底部五项数据 -->
        <div class="stats-bottom">
          <div class="bottom-item">
            <div class="bottom-label">回桶</div>
            <div class="bottom-value">{{ stats.returnBarrel }}</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-label">押桶</div>
            <div class="bottom-value">{{ stats.depositBarrel }}</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-label">退桶</div>
            <div class="bottom-value">{{ stats.refundBarrel }}</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-label">配送纸票</div>
            <div class="bottom-value">{{ stats.paperTicket }}</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-label">回票</div>
            <div class="bottom-value">{{ stats.returnTicket }}</div>
          </div>
        </div>
      </div>

      <!-- 配送人员列表 -->
      <div v-for="person in deliveryPersons" :key="person.id" class="person-card">
        <div class="person-header">
          <div class="person-info">
            <van-icon name="user-o" size="20" color="#666" />
            <span class="name">{{ person.name }}</span>
            <span class="phone">{{ person.phone }}</span>
          </div>
          <span class="detail-link" @click="goPersonDetail(person.id)">
            详情 <van-icon name="arrow" />
          </span>
        </div>

        <div class="person-stats">
          <!-- 左侧数据 -->
          <div class="person-left">
            <div class="person-item">
              <div class="person-value">{{ person.deliveryOrder }}</div>
              <div class="person-label">配送订单</div>
            </div>
            <div class="person-item">
              <div class="person-value">{{ person.deliveryGoods }}</div>
              <div class="person-label">
                配送商品
                <van-icon name="question-o" size="12" color="#999" />
              </div>
            </div>
          </div>

          <!-- 右侧金额 -->
          <div class="person-right">
            <div class="amount-value">¥{{ person.amount }}</div>
            <div class="amount-label">金额</div>
          </div>
        </div>

        <!-- 底部五项数据 -->
        <div class="person-bottom">
          <div class="bottom-item">
            <div class="bottom-label">回桶</div>
            <div class="bottom-value">{{ person.returnBarrel }}</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-label">押桶</div>
            <div class="bottom-value">{{ person.depositBarrel }}</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-label">退桶</div>
            <div class="bottom-value">{{ person.refundBarrel }}</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-label">配送纸票</div>
            <div class="bottom-value">{{ person.paperTicket }}</div>
          </div>
          <div class="bottom-item">
            <div class="bottom-label">回票</div>
            <div class="bottom-value">{{ person.returnTicket }}</div>
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

    <!-- 底部导航 -->
    <tabbar />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import Tabbar from '@/components/Tabbar.vue'

const router = useRouter()
const currentTimeLabel = ref('本月')
const showTimePicker = ref(false)

const timeOptions = ['本日', '昨日', '本周', '本月', '上月', '自定义时间']

const stats = reactive({
  deliveryOrder: 2,
  deliveryGoods: 2,
  returnBarrel: 0,
  depositBarrel: 0,
  refundBarrel: 0,
  paperTicket: 0,
  returnTicket: 0,
  amount: '0.00'
})

const deliveryPersons = ref([
  {
    id: 1,
    name: '宋再洋',
    phone: '17696837781',
    deliveryOrder: 2,
    deliveryGoods: 2,
    returnBarrel: 0,
    depositBarrel: 0,
    refundBarrel: 0,
    paperTicket: 0,
    returnTicket: 0,
    amount: '0.00'
  }
])

const onTimeConfirm = ({ selectedValues }) => {
  currentTimeLabel.value = selectedValues[0]
  showTimePicker.value = false
  showToast(`切换到${selectedValues[0]}`)
}

const goStatsDetail = () => {
  router.push('/delivery-detail')
}

const goPersonDetail = (id) => {
  router.push(`/delivery-detail?personId=${id}`)
}
</script>

<style lang="scss" scoped>
.delivery-stats-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 60px;
}

.container {
  padding: 0 12px;
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

// 统计数据卡片
.stats-card {
  background: linear-gradient(135deg, #E8F4F8 0%, #D1E9F3 100%);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
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

  .stats-content {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;

    .stats-left {
      flex: 1;
      background: rgba(78, 142, 247, 0.1);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .stat-label {
          font-size: 14px;
          color: #666;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }
      }
    }

    .stats-right {
      width: 100px;
      background: rgba(255, 59, 48, 0.08);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .amount-label {
        font-size: 13px;
        color: #666;
        margin-bottom: 8px;
      }

      .amount-value {
        font-size: 20px;
        font-weight: bold;
        color: #FF3B30;
      }
    }
  }

  .stats-bottom {
    display: flex;
    justify-content: space-around;
    padding-top: 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.06);

    .bottom-item {
      text-align: center;

      .bottom-label {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }

      .bottom-value {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
    }
  }
}

// 配送人员卡片
.person-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  .person-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
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

  .person-stats {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;

    .person-left {
      flex: 1;
      display: flex;
      gap: 16px;

      .person-item {
        flex: 1;
        text-align: center;

        .person-value {
          font-size: 28px;
          font-weight: bold;
          color: #4E8EF7;
          margin-bottom: 6px;
        }

        .person-label {
          font-size: 13px;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
      }
    }

    .person-right {
      width: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .amount-value {
        font-size: 20px;
        font-weight: bold;
        color: #FF3B30;
        margin-bottom: 6px;
      }

      .amount-label {
        font-size: 13px;
        color: #666;
      }
    }
  }

  .person-bottom {
    display: flex;
    justify-content: space-around;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;

    .bottom-item {
      text-align: center;

      .bottom-label {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }

      .bottom-value {
        font-size: 16px;
        font-weight: 500;
        color: #333;
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
