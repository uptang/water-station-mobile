<template>
  <div class="inventory-page page-with-tabbar">
    <van-nav-bar title="进销存" left-arrow fixed placeholder @click-left="router.back()" />

    <div class="container">
      <div class="menu-grid">
        <div
          v-for="item in menuItems"
          :key="item.path"
          class="menu-item"
          @click="router.push(item.path)"
        >
          <van-icon :name="item.icon" :color="item.color" size="44" />
          <span class="menu-text">{{ item.text }}</span>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <tabbar />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Tabbar from '@/components/Tabbar.vue'

const router = useRouter()

const menuItems = [
  { path: '/supplier', icon: 'manager-o', text: '供货商管理', color: '#9C27B0' },
  { path: '/purchase', icon: 'shopping-cart-o', text: '进货管理', color: '#8BC34A' },
  { path: '/goods', icon: 'goods-collect-o', text: '商品库存', color: '#FF9800' },
  { path: '/warehouse', icon: 'shop-o', text: '仓库管理', color: '#5C6BC0' },
  { path: '/stock-in', icon: 'sign', text: '入库管理', color: '#42A5F5' },
  { path: '/stock-out', icon: 'records', text: '出库管理', color: '#5C93F7' },
  { path: '/inventory-check', icon: 'balance-list-o', text: '盘点管理', color: '#26A69A' },
  { path: '/empty-barrel', icon: 'records', text: '空桶库存', color: '#3F51B5' },
  { path: '/financial', icon: 'gold-coin-o', text: '财务收支', color: '#26C6DA' },
  { path: '/tianwang-goods', icon: 'shop-collect-o', text: '天网商品库存', color: '#EF5350' }
]
</script>

<style lang="scss" scoped>
.inventory-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 60px;

  .container {
    padding: 16px 12px;
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .menu-item {
    background: white;
    border-radius: 12px;
    padding: 20px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s;

    &:active {
      transform: scale(0.98);
      opacity: 0.9;
    }

    .menu-text {
      font-size: 15px;
      color: #333;
      font-weight: 500;
    }
  }
}
</style>
