<template>
  <div class="order-detail-page page">
    <van-nav-bar title="订单详情" left-arrow @click-left="router.back()" fixed placeholder />

    <div class="container">
      <!-- 商品信息 -->
      <div class="section product-section">
        <div class="section-title">商品信息</div>
        <div class="product-info">
          <div class="product-name-row">
            <span>{{ orderDetail.productName }}</span>
            <div class="stamp-icon">
              <van-icon name="passed" size="40" color="#4E8EF7" />
            </div>
            <span class="qty">×{{ orderDetail.qty }}</span>
          </div>
          <div class="price-rows">
            <div class="price-item">
              <span class="label">商品总价：</span>
              <span class="value">¥{{ orderDetail.totalPrice }}</span>
            </div>
            <div class="price-item">
              <span class="label">上楼费：</span>
              <span class="value">¥{{ orderDetail.floorFee }}</span>
            </div>
            <div class="price-item">
              <span class="label">优惠券：</span>
              <span class="value">¥{{ orderDetail.coupon }}</span>
            </div>
            <div class="price-item">
              <span class="label">活动减：</span>
              <span class="value">¥{{ orderDetail.discount }}</span>
            </div>
            <div class="price-item">
              <span class="label">电子水票：</span>
              <span class="value">{{ orderDetail.eTicket }}张</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户信息 -->
      <div class="section customer-section">
        <div class="section-title">客户信息</div>
        <div class="customer-info">
          <div class="info-row">
            <span class="label">编号昵称</span>
            <span class="value">{{ orderDetail.customerNickname }}</span>
          </div>
          <div class="info-row">
            <span class="label">联系电话</span>
            <div class="value-with-icons">
              <span>{{ orderDetail.phone }}</span>
              <van-icon name="phone-o" color="#4E8EF7" />
            </div>
          </div>
          <div class="info-row">
            <span class="label">收货地址</span>
            <div class="value-with-icons">
              <span>{{ orderDetail.address }}</span>
              <van-icon name="edit" color="#4E8EF7" />
            </div>
          </div>

          <div class="barrel-info">
            <div class="label">楼层信息</div>
            <div class="barrel-row">
              <span>押桶</span>
              <span class="count">{{ orderDetail.depositBarrel }}</span>
              <van-button size="mini" icon="plus" class="add-btn">押桶</van-button>
            </div>
            <div class="barrel-row">
              <span>欠桶{{ orderDetail.owedBarrel }}</span>
              <span class="separator">|</span>
              <span>欠票{{ orderDetail.owedTicket }}</span>
              <span class="separator">|</span>
              <span>欠款：{{ orderDetail.owedMoney }}</span>
            </div>
          </div>

          <div class="remark-section">
            <span class="label">商家备注</span>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="section order-info-section">
        <div class="section-title">订单信息</div>
        <div class="order-info">
          <div class="info-row">
            <span class="label">订单编号</span>
            <span class="value">{{ orderDetail.orderNo }}</span>
          </div>
          <div class="info-row">
            <span class="label">下单时间</span>
            <span class="value">{{ orderDetail.orderTime }}</span>
          </div>
          <div class="info-row">
            <span class="label">预约时间</span>
            <span class="value time-range">{{ orderDetail.appointmentTime }}</span>
          </div>
          <div class="info-row">
            <span class="label">订单类型</span>
            <div class="tags">
              <van-tag v-for="tag in orderDetail.orderTags" :key="tag" type="primary" size="medium">
                {{ tag }}
              </van-tag>
            </div>
          </div>
          <div class="info-row">
            <span class="label">支付方式</span>
            <van-tag :type="orderDetail.payType === '线上支付' ? 'success' : 'default'">
              {{ orderDetail.payType }}
            </van-tag>
          </div>
        </div>
      </div>

      <!-- 配送收入 -->
      <div class="section delivery-income-section">
        <div class="section-title">配送收入</div>
        <div class="income-value">¥{{ orderDetail.deliveryIncome }}</div>
      </div>

      <!-- 订单备注 -->
      <div class="section remark-section">
        <div class="section-title">订单备注</div>
        <div class="remark-text">{{ orderDetail.remark }}</div>
      </div>

      <!-- 配送门店 -->
      <div class="section store-section">
        <div class="section-title">配送门店：{{ orderDetail.store }}</div>
        <div class="store-image">
          <van-image
            width="60"
            height="60"
            :src="orderDetail.storeImage"
            fit="cover"
            radius="4"
          />
        </div>
        <van-button type="primary" size="small" icon="photograph">上传图片</van-button>
      </div>

      <!-- 订单时间线 -->
      <div class="order-timeline">
        <div
          v-for="(status, index) in orderDetail.statusList"
          :key="index"
          class="timeline-item"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="status-header">
              <span class="status-name">{{ status.name }}</span>
              <span class="time">{{ status.time }}</span>
            </div>
            <div class="status-operator">操作人：{{ status.operator }}</div>
            <div v-if="status.worker" class="status-detail">
              配送工：{{ status.worker }}
              <span v-if="status.payMethod">签收方式：{{ status.payMethod }}</span>
            </div>
            <div v-if="status.deliveryAddress" class="status-detail">
              配送工送达地址：{{ status.deliveryAddress }}
            </div>
            <div v-if="status.money !== undefined" class="status-detail">
              收现金：¥{{ status.money }}
              <span style="margin-left: 20px">欠款：¥{{ status.debt }}</span>
            </div>
            <div v-if="status.product" class="status-detail product-name">
              {{ status.product }}
              <span class="product-qty">*{{ status.qty }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const orderDetail = ref({
  productName: '怡宝 饮用纯净水6L×3桶/箱',
  qty: 2,
  totalPrice: 0,
  floorFee: 0,
  coupon: 0,
  discount: 0,
  eTicket: 0,
  customerNickname: '李',
  phone: '15784029270,020',
  address: '江苏省扬州市广陵区永桥镇抗埠康陈园小区1栋1栋502~',
  depositBarrel: 0,
  owedBarrel: 0,
  owedTicket: 0,
  owedMoney: '0.00',
  orderNo: '400447028470919304040',
  orderTime: '2026-01-03 09:05:45',
  appointmentTime: '2026-01-03 12:00~2026-01-03 16:00',
  orderTags: ['天网O2O', '天网O2O', '百一先到'],
  payType: '线上支付',
  deliveryIncome: '0.00',
  remark: '(缺货时电话与我联系)',
  store: '百一先到',
  storeImage: '',
  statusList: [
    {
      name: '送达',
      time: '2026-01-04 10:43:39',
      operator: '宋再洋',
      worker: '宋再洋',
      payMethod: '送到家门口',
      deliveryAddress: '江苏省扬州市广陵区永桥镇抗埠康陈',
      money: '0.00',
      debt: '0.00',
      product: '怡宝饮用纯净水6L×3桶/箱',
      qty: 2
    },
    {
      name: '派单',
      time: '2026-01-03 11:11:26',
      operator: '海涛',
      worker: '宋再洋'
    },
    {
      name: '转单',
      time: '2026-01-03 09:23:48',
      operator: '海涛'
    },
    {
      name: '分配订单',
      time: '2026-01-03 09:05:51',
      operator: '系统'
    },
    {
      name: '电子囤栏分单',
      time: '2026-01-03 09:05:51',
      operator: ''
    },
    {
      name: '下单',
      time: '2026-01-03 09:05:51',
      operator: ''
    }
  ]
})
</script>

<style lang="scss" scoped>
.order-detail-page {
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

.section {
  background: white;
  margin-bottom: 8px;
  padding: 16px;

  .section-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
  }
}

.product-section {
  .product-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #333;

    .stamp-icon {
      margin-left: auto;
    }

    .qty {
      font-size: 14px;
    }
  }

  .price-rows {
    .price-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;

      .label {
        color: #666;
      }

      .value {
        color: #333;
      }
    }
  }
}

.customer-section {
  .customer-info {
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;

      .label {
        color: #999;
        font-size: 14px;
      }

      .value,
      .value-with-icons {
        color: #333;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .barrel-info {
      margin-top: 12px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 4px;

      .label {
        color: #333;
        font-size: 14px;
        margin-bottom: 8px;
        display: block;
      }

      .barrel-row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        font-size: 14px;
        color: #666;

        .count {
          color: #333;
          font-weight: 500;
        }

        .separator {
          margin: 0 4px;
        }

        .add-btn {
          margin-left: auto;
        }
      }
    }

    .remark-section {
      margin-top: 12px;
      font-size: 14px;
      color: #666;
    }
  }
}

.order-info-section {
  .order-info {
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      font-size: 14px;

      .label {
        color: #666;
      }

      .value {
        color: #333;
      }

      .time-range {
        color: #FF8C00;
      }

      .tags {
        display: flex;
        gap: 6px;
      }
    }
  }
}

.delivery-income-section {
  .income-value {
    font-size: 18px;
    font-weight: bold;
    color: #FF3B30;
  }
}

.remark-section {
  .remark-text {
    color: #FF3B30;
    font-size: 14px;
    line-height: 1.6;
  }
}

.store-section {
  .store-image {
    margin: 12px 0;
  }
}

.order-timeline {
  background: white;
  padding: 16px 16px 16px 40px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 23px;
    top: 20px;
    bottom: 20px;
    width: 1px;
    background: #e5e5e5;
  }

  .timeline-item {
    position: relative;
    padding-bottom: 20px;

    &:last-child {
      padding-bottom: 0;
    }

    .timeline-dot {
      position: absolute;
      left: -21px;
      top: 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #FF8C00;
      border: 2px solid #fff;
      box-shadow: 0 0 0 2px #FF8C00;
    }

    .timeline-content {
      .status-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;

        .status-name {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .time {
          font-size: 13px;
          color: #999;
        }
      }

      .status-operator,
      .status-detail {
        font-size: 13px;
        color: #666;
        line-height: 1.8;
      }

      .product-name {
        color: #333;
        margin-top: 4px;

        .product-qty {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
