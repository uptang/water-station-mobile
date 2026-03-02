<template>
  <div class="product-list-page page-with-tabbar">
    <van-nav-bar title="商品管理" fixed placeholder>
      <template #right>
        <van-icon name="plus" size="20" @click="handleAddProduct" />
      </template>
    </van-nav-bar>

    <!-- 分类标签 -->
    <van-tabs v-model:active="activeCategory" @change="handleCategoryChange">
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="桶装水" name="water"></van-tab>
      <van-tab title="饮料" name="drink"></van-tab>
      <van-tab title="其他" name="other"></van-tab>
    </van-tabs>

    <!-- 搜索和筛选 -->
    <div class="search-section">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索商品名称、编号"
        @search="handleSearch"
      />
    </div>

    <!-- 商品列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="product in productList"
          :key="product.id"
          class="product-card"
          @click="goProductDetail(product.id)"
        >
          <div class="product-image">
            <van-image
              width="80"
              height="80"
              fit="cover"
              :src="product.image"
              radius="8"
            />
            <van-tag v-if="product.stock < 10" type="danger" class="stock-tag">
              库存不足
            </van-tag>
          </div>

          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-spec">{{ product.spec }}</div>
            <div class="product-meta">
              <span class="product-code">编号：{{ product.code }}</span>
              <span class="product-stock">库存：{{ product.stock }}</span>
            </div>
            <div class="product-price">
              <span class="price">¥{{ product.price }}</span>
              <span class="origin-price">¥{{ product.originPrice }}</span>
            </div>
          </div>

          <div class="product-actions">
            <van-button
              size="small"
              icon="edit"
              plain
              @click.stop="handleEditProduct(product)"
            >
              编辑
            </van-button>
            <van-switch
              v-model="product.status"
              size="20"
              @change="handleStatusChange(product)"
              @click.stop
            />
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 添加/编辑商品弹窗 -->
    <van-popup v-model:show="showProductDialog" position="bottom" round :style="{ height: '85%' }">
      <div class="product-dialog">
        <div class="dialog-header">
          <span class="close-btn" @click="closeProductDialog">取消</span>
          <span class="dialog-title">{{ isEdit ? '编辑商品' : '添加商品' }}</span>
          <span class="submit-btn" @click="submitProduct">保存</span>
        </div>

        <van-form class="product-form">
          <van-cell-group :border="false">
            <van-field
              v-model="productForm.name"
              label="商品名称"
              placeholder="请输入商品名称"
              required
            />

            <van-field
              v-model="productForm.spec"
              label="规格"
              placeholder="请输入商品规格"
              required
            />

            <van-field
              v-model="productForm.code"
              label="商品编号"
              placeholder="请输入商品编号"
              required
            />

            <van-field
              v-model="productForm.price"
              label="售价"
              type="digit"
              placeholder="请输入售价"
              required
              suffix="元"
            />

            <van-field
              v-model="productForm.originPrice"
              label="原价"
              type="digit"
              placeholder="请输入原价"
              suffix="元"
            />

            <van-field
              v-model="productForm.stock"
              label="库存"
              type="digit"
              placeholder="请输入库存数量"
              required
            />

            <van-field label="分类">
              <template #input>
                <van-radio-group v-model="productForm.category" direction="horizontal">
                  <van-radio name="water">桶装水</van-radio>
                  <van-radio name="drink">饮料</van-radio>
                  <van-radio name="other">其他</van-radio>
                </van-radio-group>
              </template>
            </van-field>

            <van-field label="状态">
              <template #input>
                <van-switch v-model="productForm.status" size="20px" />
                <span class="status-text">{{ productForm.status ? '上架' : '下架' }}</span>
              </template>
            </van-field>

            <van-field
              v-model="productForm.description"
              label="商品描述"
              type="textarea"
              placeholder="请输入商品描述（选填）"
              rows="3"
              maxlength="200"
              show-word-limit
            />
          </van-cell-group>
        </van-form>
      </div>
    </van-popup>

    <tabbar />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showSuccessToast } from 'vant'
import Tabbar from '@/components/Tabbar.vue'

const router = useRouter()

const activeCategory = ref('all')
const searchKeyword = ref('')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)
const productList = ref([])
const showProductDialog = ref(false)
const isEdit = ref(false)
const currentProductId = ref(null)

// 商品表单
const productForm = reactive({
  name: '',
  spec: '',
  code: '',
  price: '',
  originPrice: '',
  stock: '',
  category: 'water',
  status: true,
  description: ''
})

// 重置表单
const resetForm = () => {
  productForm.name = ''
  productForm.spec = ''
  productForm.code = ''
  productForm.price = ''
  productForm.originPrice = ''
  productForm.stock = ''
  productForm.category = 'water'
  productForm.status = true
  productForm.description = ''
}

// 模拟商品数据
const mockProducts = [
  {
    id: '1',
    name: '怡宝 饮用纯净水',
    spec: '6L×3桶/箱',
    code: 'SP20260001',
    price: '36.00',
    originPrice: '42.00',
    stock: 156,
    status: true,
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '2',
    name: '农夫山泉 饮用天然水',
    spec: '4L×6桶/箱',
    code: 'SP20260002',
    price: '48.00',
    originPrice: '55.00',
    stock: 8,
    status: true,
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '3',
    name: '景田 百岁山饮用水',
    spec: '5L×4桶/箱',
    code: 'SP20260003',
    price: '52.00',
    originPrice: '60.00',
    stock: 89,
    status: true,
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: '4',
    name: '娃哈哈 纯净水',
    spec: '5L×4桶/箱',
    code: 'SP20260004',
    price: '32.00',
    originPrice: '38.00',
    stock: 120,
    status: false,
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  }
]

// 加载商品列表
const onLoad = () => {
  setTimeout(() => {
    productList.value = [...mockProducts]
    loading.value = false
    finished.value = true
  }, 500)
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  loading.value = true
  productList.value = []
  onLoad()
  setTimeout(() => {
    refreshing.value = false
    showToast('刷新成功')
  }, 1000)
}

// 分类切换
const handleCategoryChange = () => {
  productList.value = []
  finished.value = false
  onLoad()
}

// 搜索
const handleSearch = () => {
  if (!searchKeyword.value) {
    showToast('请输入搜索关键词')
    return
  }
  showToast('搜索功能开发中')
}

// 添加商品
const handleAddProduct = () => {
  isEdit.value = false
  resetForm()
  showProductDialog.value = true
}

// 编辑商品
const handleEditProduct = (product) => {
  isEdit.value = true
  currentProductId.value = product.id

  // 填充表单
  productForm.name = product.name
  productForm.spec = product.spec
  productForm.code = product.code
  productForm.price = product.price
  productForm.originPrice = product.originPrice
  productForm.stock = String(product.stock)
  productForm.category = 'water'
  productForm.status = product.status
  productForm.description = ''

  showProductDialog.value = true
}

// 关闭弹窗
const closeProductDialog = () => {
  showProductDialog.value = false
}

// 提交商品
const submitProduct = () => {
  // 验证必填字段
  if (!productForm.name.trim()) {
    showToast('请输入商品名称')
    return
  }
  if (!productForm.spec.trim()) {
    showToast('请输入商品规格')
    return
  }
  if (!productForm.code.trim()) {
    showToast('请输入商品编号')
    return
  }
  if (!productForm.price || parseFloat(productForm.price) <= 0) {
    showToast('请输入正确的售价')
    return
  }
  if (!productForm.stock || parseInt(productForm.stock) < 0) {
    showToast('请输入正确的库存数量')
    return
  }

  if (isEdit.value) {
    // 编辑商品
    const product = productList.value.find(p => p.id === currentProductId.value)
    if (product) {
      product.name = productForm.name
      product.spec = productForm.spec
      product.code = productForm.code
      product.price = productForm.price
      product.originPrice = productForm.originPrice || product.price
      product.stock = parseInt(productForm.stock)
      product.status = productForm.status
    }
    showSuccessToast('商品修改成功')
  } else {
    // 添加商品
    const newProduct = {
      id: String(Date.now()),
      name: productForm.name,
      spec: productForm.spec,
      code: productForm.code,
      price: productForm.price,
      originPrice: productForm.originPrice || productForm.price,
      stock: parseInt(productForm.stock),
      status: productForm.status,
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
    }
    productList.value.unshift(newProduct)
    showSuccessToast('商品添加成功')
  }

  showProductDialog.value = false
}

// 商品状态切换
const handleStatusChange = (product) => {
  showToast(product.status ? '商品已上架' : '商品已下架')
}

// 查看商品详情
const goProductDetail = (id) => {
  showToast('商品详情功能开发中')
}
</script>

<style lang="scss" scoped>
.product-list-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 50px;
}

.search-section {
  background: white;
  padding: 12px 16px;
}

.product-card {
  background: white;
  margin: 8px 16px;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .product-image {
    position: relative;

    .stock-tag {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 10px;
    }
  }

  .product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .product-name {
      font-size: 15px;
      font-weight: 500;
      color: #333;
    }

    .product-spec {
      font-size: 13px;
      color: #999;
    }

    .product-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #999;
    }

    .product-price {
      display: flex;
      align-items: baseline;
      gap: 8px;

      .price {
        font-size: 18px;
        font-weight: bold;
        color: #FF3B30;
      }

      .origin-price {
        font-size: 13px;
        color: #999;
        text-decoration: line-through;
      }
    }
  }

  .product-actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8px;
  }
}

// 商品弹窗
.product-dialog {
  height: 100%;
  display: flex;
  flex-direction: column;

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    background: white;

    .close-btn,
    .submit-btn {
      font-size: 15px;
      color: #4E8EF7;
      cursor: pointer;
      padding: 4px 8px;
    }

    .dialog-title {
      font-size: 17px;
      font-weight: 500;
      color: #333;
    }
  }

  .product-form {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 20px;

    :deep(.van-cell-group) {
      background: white;
    }

    :deep(.van-field__label) {
      width: 85px;
      color: #333;
      font-size: 15px;
    }

    :deep(.van-field__control) {
      font-size: 15px;
    }

    :deep(.van-radio-group) {
      display: flex;
      gap: 12px;
    }

    .status-text {
      margin-left: 8px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
