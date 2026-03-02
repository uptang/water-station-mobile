<template>
  <van-tabbar v-model="active" :fixed="true" :placeholder="true" active-color="#3b7ef5">
    <van-tabbar-item
      v-for="item in tabbarItems"
      :key="item.name"
      :name="item.name"
      :icon="item.icon"
      :to="item.path"
    >
      {{ item.text }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref('home')

const tabbarItems = [
  { name: 'home', icon: 'wap-home-o', text: '首页', path: '/home' },
  { name: 'order', icon: 'notes-o', text: '订单', path: '/order-list' },
  { name: 'product', icon: 'shopping-cart-o', text: '商品', path: '/product-list' },
  { name: 'more', icon: 'apps-o', text: '更多', path: '/more' }
]

// 根据当前路由更新激活项
watch(
  () => route.path,
  (newPath) => {
    const item = tabbarItems.find(t => t.path === newPath)
    if (item) {
      active.value = item.name
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
:deep(.van-tabbar) {
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
}
</style>
