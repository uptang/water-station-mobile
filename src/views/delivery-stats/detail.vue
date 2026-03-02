<template>
  <div class="delivery-detail-page page">
    <van-nav-bar title="配送明细" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <div class="card">
        <p class="detail-info">商品数量：2</p>
        <p class="detail-info">配送收入：¥0.00</p>

        <van-cell-group :border="false">
          <van-cell title="怡宝 饮用纯净水 1.55L*12瓶/箱" value="×1" label="第三方商品" />
          <van-cell-group inset>
            <van-cell title="用电子水票：0" value="线上支付：1" />
            <van-cell title="收纸票：0" value="线下已收：0" />
            <van-cell title="签单：0" value="回桶：0" />
          </van-cell-group>

          <van-cell title="怡宝纯净水非矿泉水4.5L*4桶/箱" value="×1" label="第三方商品" />
          <van-cell-group inset>
            <van-cell title="用电子水票：0" value="线上支付：1" />
            <van-cell title="收纸票：0" value="线下已收：0" />
            <van-cell title="签单：0" value="回桶：0" />
          </van-cell-group>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped>
.delivery-detail-page {
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

.detail-info {
  padding: 8px 0;
  font-size: 14px;
}
</style>
