import request from '@/utils/request'

/**
 * 同步订单
 * @param {string} platform - 平台名称 (pinduoduo/eleme/douyin/meituan)
 * @returns {Promise}
 */
export function syncOrders(platform) {
  return request({
    url: `/platform/sync/${platform}`,
    method: 'post'
  })
}

/**
 * 获取同步日志
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getSyncLogs(params) {
  return request({
    url: '/platform/sync/logs',
    method: 'get',
    params
  })
}

/**
 * 测试平台连接
 * @param {string} platform - 平台名称
 * @returns {Promise}
 */
export function testPlatformConnection(platform) {
  return request({
    url: `/platform/test/${platform}`,
    method: 'post'
  })
}

/**
 * 保存平台配置
 * @param {Object} data - 配置数据
 * @returns {Promise}
 */
export function savePlatformConfig(data) {
  return request({
    url: '/platform/config',
    method: 'post',
    data
  })
}

/**
 * 获取平台配置
 * @returns {Promise}
 */
export function getPlatformConfig() {
  return request({
    url: '/platform/config',
    method: 'get'
  })
}

/**
 * 创建手动订单
 * @param {Object} data - 订单数据
 * @returns {Promise}
 */
export function createManualOrder(data) {
  return request({
    url: '/order/manual',
    method: 'post',
    data
  })
}
