import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue'),
    meta: { title: '门店注册' }
  },
  {
    path: '/forget-password',
    name: 'ForgetPassword',
    component: () => import('@/views/forget-password/index.vue'),
    meta: { title: '忘记密码' }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '首页', requiresAuth: true }
  },
  {
    path: '/order-list',
    name: 'OrderList',
    component: () => import('@/views/order-list/index.vue'),
    meta: { title: '订单管理', requiresAuth: true }
  },
  {
    path: '/product-list',
    name: 'ProductList',
    component: () => import('@/views/product-list/index.vue'),
    meta: { title: '商品管理', requiresAuth: true }
  },
  {
    path: '/more',
    name: 'More',
    component: () => import('@/views/more/index.vue'),
    meta: { title: '更多', requiresAuth: true }
  },
  {
    path: '/order-stats',
    name: 'OrderStats',
    component: () => import('@/views/order-stats/index.vue'),
    meta: { title: '订单统计', requiresAuth: true }
  },
  {
    path: '/order-detail/:id',
    name: 'OrderDetail',
    component: () => import('@/views/order-detail/index.vue'),
    meta: { title: '订单详情', requiresAuth: true }
  },
  {
    path: '/promotion-settings',
    name: 'PromotionSettings',
    component: () => import('@/views/promotion-settings/index.vue'),
    meta: { title: '推广设置', requiresAuth: true }
  },
  {
    path: '/user-management',
    name: 'UserManagement',
    component: () => import('@/views/user-management/index.vue'),
    meta: { title: '我的用户', requiresAuth: true }
  },
  {
    path: '/user-detail/:id',
    name: 'UserDetail',
    component: () => import('@/views/user-management/detail.vue'),
    meta: { title: '用户详情', requiresAuth: true }
  },
  {
    path: '/ticket-distribute',
    name: 'TicketDistribute',
    component: () => import('@/views/ticket-distribute/index.vue'),
    meta: { title: '指定用户发', requiresAuth: true }
  },
  {
    path: '/user-promotion',
    name: 'UserPromotion',
    component: () => import('@/views/user-promotion/index.vue'),
    meta: { title: '用户推广统计', requiresAuth: true }
  },
  {
    path: '/order-feedback',
    name: 'OrderFeedback',
    component: () => import('@/views/order-feedback/index.vue'),
    meta: { title: '工单反馈', requiresAuth: true }
  },
  {
    path: '/order-appeal',
    name: 'OrderAppeal',
    component: () => import('@/views/order-appeal/index.vue'),
    meta: { title: '工单申诉列表', requiresAuth: true }
  },
  {
    path: '/delivery-stats',
    name: 'DeliveryStats',
    component: () => import('@/views/delivery-stats/index.vue'),
    meta: { title: '配送统计', requiresAuth: true }
  },
  {
    path: '/delivery-detail',
    name: 'DeliveryDetail',
    component: () => import('@/views/delivery-stats/detail.vue'),
    meta: { title: '配送明细', requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('@/views/inventory/index.vue'),
    meta: { title: '进销存', requiresAuth: true }
  },
  {
    path: '/supplier',
    name: 'Supplier',
    component: () => import('@/views/inventory/supplier/index.vue'),
    meta: { title: '供货商管理', requiresAuth: true }
  },
  {
    path: '/supplier/add',
    name: 'SupplierAdd',
    component: () => import('@/views/inventory/supplier/add.vue'),
    meta: { title: '添加供货商', requiresAuth: true }
  },
  {
    path: '/supplier/edit/:id',
    name: 'SupplierEdit',
    component: () => import('@/views/inventory/supplier/edit.vue'),
    meta: { title: '修改供货商资料', requiresAuth: true }
  },
  {
    path: '/supplier/detail/:id',
    name: 'SupplierDetail',
    component: () => import('@/views/inventory/supplier/detail.vue'),
    meta: { title: '供货商欠桶详情', requiresAuth: true }
  },
  {
    path: '/purchase',
    name: 'Purchase',
    component: () => import('@/views/purchase/index.vue'),
    meta: { title: '进货管理', requiresAuth: true }
  },
  {
    path: '/goods',
    name: 'Goods',
    component: () => import('@/views/goods/index.vue'),
    meta: { title: '商品库存', requiresAuth: true }
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    component: () => import('@/views/warehouse/index.vue'),
    meta: { title: '仓库管理', requiresAuth: true }
  },
  {
    path: '/stock-in',
    name: 'StockIn',
    component: () => import('@/views/stock-in/index.vue'),
    meta: { title: '入库管理', requiresAuth: true }
  },
  {
    path: '/stock-out',
    name: 'StockOut',
    component: () => import('@/views/stock-out/index.vue'),
    meta: { title: '出库管理', requiresAuth: true }
  },
  {
    path: '/inventory-check',
    name: 'InventoryCheck',
    component: () => import('@/views/inventory-check/index.vue'),
    meta: { title: '盘点管理', requiresAuth: true }
  },
  {
    path: '/empty-barrel',
    name: 'EmptyBarrel',
    component: () => import('@/views/empty-barrel/index.vue'),
    meta: { title: '空桶库存', requiresAuth: true }
  },
  {
    path: '/tianwang-goods',
    name: 'TianwangGoods',
    component: () => import('@/views/tianwang-goods/index.vue'),
    meta: { title: '天网商品库存', requiresAuth: true }
  },
  {
    path: '/financial',
    name: 'Financial',
    component: () => import('@/views/financial/index.vue'),
    meta: { title: '财务收支', requiresAuth: true }
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/views/message/index.vue'),
    meta: { title: '消息中心', requiresAuth: true }
  },
  {
    path: '/order-timeout',
    name: 'OrderTimeout',
    component: () => import('@/views/order-timeout/index.vue'),
    meta: { title: '即将超时订单', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '吉客道商家管理系统'

  // 检查是否需要登录
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
