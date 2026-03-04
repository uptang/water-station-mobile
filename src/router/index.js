import { createRouter, createWebHistory } from 'vue-router'

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
    path: '/delivery-order-list',
    name: 'DeliveryOrderList',
    component: () => import('@/views/delivery-stats/order-list.vue'),
    meta: { title: '订单回单明细', requiresAuth: true }
  },
  {
    path: '/delivery-user-detail',
    name: 'DeliveryUserDetail',
    component: () => import('@/views/delivery-stats/user-detail.vue'),
    meta: { title: '配送用户明细', requiresAuth: true }
  },
  {
    path: '/delivery-barrel-detail',
    name: 'DeliveryBarrelDetail',
    component: () => import('@/views/delivery-stats/barrel-detail.vue'),
    meta: { title: '回桶详情', requiresAuth: true }
  },
  {
    path: '/delivery-goods-detail',
    name: 'DeliveryGoodsDetail',
    component: () => import('@/views/delivery-stats/goods-detail.vue'),
    meta: { title: '配送明细', requiresAuth: true }
  },
  {
    path: '/delivery-payment-detail',
    name: 'DeliveryPaymentDetail',
    component: () => import('@/views/delivery-stats/payment-detail.vue'),
    meta: { title: '回票/现金详情', requiresAuth: true }
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
    path: '/barrel-stats',
    name: 'BarrelStats',
    component: () => import('@/views/barrel-stats/index.vue'),
    meta: { title: '空桶综合统计', requiresAuth: true }
  },
  {
    path: '/verification-stats',
    name: 'VerificationStats',
    component: () => import('@/views/verification-stats/index.vue'),
    meta: { title: '待核销统计', requiresAuth: true }
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
  },
  {
    path: '/platform-config',
    name: 'PlatformConfig',
    component: () => import('@/views/platform-config/index.vue'),
    meta: { title: '平台配置', requiresAuth: true }
  },
  {
    path: '/order-sync',
    name: 'OrderSync',
    component: () => import('@/views/order-sync/index.vue'),
    meta: { title: '订单同步', requiresAuth: true }
  },
  {
    path: '/order-manual',
    name: 'OrderManual',
    component: () => import('@/views/order-manual/index.vue'),
    meta: { title: '手动录单', requiresAuth: true }
  },
  {
    path: '/worker-management',
    name: 'WorkerManagement',
    component: () => import('@/views/worker/index.vue'),
    meta: { title: '工人列表', requiresAuth: true }
  },
  {
    path: '/worker-add',
    name: 'WorkerAdd',
    component: () => import('@/views/worker/add.vue'),
    meta: { title: '新增工人', requiresAuth: true }
  },
  {
    path: '/worker-settings/:id',
    name: 'WorkerSettings',
    component: () => import('@/views/worker/settings.vue'),
    meta: { title: '设置', requiresAuth: true }
  },
  {
    path: '/worker-substitute/:id',
    name: 'WorkerSubstitute',
    component: () => import('@/views/worker/substitute.vue'),
    meta: { title: '代班设置', requiresAuth: true }
  },
  {
    path: '/worker-edit/:id',
    name: 'WorkerEdit',
    component: () => import('@/views/worker/edit.vue'),
    meta: { title: '账号设置', requiresAuth: true }
  },
  {
    path: '/worker-delivery-users/:id',
    name: 'WorkerDeliveryUsers',
    component: () => import('@/views/worker/delivery-users.vue'),
    meta: { title: '配送用户', requiresAuth: true }
  },
  {
    path: '/my-delivery',
    name: 'MyDelivery',
    component: () => import('@/views/my-delivery/index.vue'),
    meta: { title: '我的配送', requiresAuth: true }
  },
  {
    path: '/order-distribution',
    name: 'OrderDistribution',
    component: () => import('@/views/my-delivery/order-distribution.vue'),
    meta: { title: '订单分布', requiresAuth: true }
  },
  {
    path: '/route-planning',
    name: 'RoutePlanning',
    component: () => import('@/views/route-planning/index.vue'),
    meta: { title: '线路规划', requiresAuth: true }
  },
  {
    path: '/order-sync-log',
    name: 'OrderSyncLog',
    component: () => import('@/views/order-sync-log/index.vue'),
    meta: { title: '同步日志', requiresAuth: true }
  },
  {
    path: '/store-settings',
    name: 'StoreSettings',
    component: () => import('@/views/store-settings/index.vue'),
    meta: { title: '门店设置', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
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
