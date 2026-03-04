import { showToast, showSuccessToast, showConfirmDialog } from 'vant'

/**
 * 订单操作逻辑复用
 */
export function useOrderActions() {
  /**
   * 格式化当前时间
   */
  const formatNow = () => {
    return new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-')
  }

  /**
   * 派单操作
   * @param {Object} order - 订单对象
   * @param {Object} worker - 配送员对象
   * @param {Function} onSuccess - 成功回调
   */
  const dispatchOrder = async (order, worker, onSuccess) => {
    if (!worker) {
      showToast('请选择配送员')
      return false
    }

    try {
      await showConfirmDialog({
        title: '确认派单',
        message: `确定将订单派给 ${worker.name} 吗？`
      })

      // 更新订单状态
      order.status = 'delivering'

      // 添加派单记录到时间线
      if (order.statusList) {
        order.statusList.unshift({
          name: '派单',
          time: formatNow(),
          operator: '当前用户',
          worker: worker.name
        })
      }

      showSuccessToast('派单成功')

      // 执行成功回调
      if (onSuccess) {
        onSuccess(order, worker)
      }

      return true
    } catch {
      // 用户取消
      return false
    }
  }

  /**
   * 送达操作
   * @param {Object} order - 订单对象
   * @param {Function} onSuccess - 成功回调
   */
  const deliverOrder = async (order, onSuccess) => {
    try {
      await showConfirmDialog({
        title: '确认送达',
        message: '确认订单已送达？'
      })

      // 更新订单状态
      order.status = 'delivered'

      // 添加送达记录
      if (order.statusList) {
        order.statusList.unshift({
          name: '送达',
          time: formatNow(),
          operator: '当前配送员',
          deliveryAddress: order.address,
          money: '0.00',
          debt: '0.00'
        })
      }

      showSuccessToast('订单已送达')

      // 执行成功回调
      if (onSuccess) {
        onSuccess(order)
      }

      return true
    } catch {
      // 用户取消
      return false
    }
  }

  /**
   * 核销操作
   * @param {Object} order - 订单对象
   * @param {Function} onSuccess - 成功回调
   */
  const verifyOrder = async (order, onSuccess) => {
    try {
      await showConfirmDialog({
        title: '确认核销',
        message: '确认核销该订单？核销后订单状态将变为已完成'
      })

      // 更新订单状态
      order.status = 'verified'

      // 添加核销记录
      if (order.statusList) {
        order.statusList.unshift({
          name: '核销',
          time: formatNow(),
          operator: '当前用户'
        })
      }

      showSuccessToast('核销成功')

      // 执行成功回调
      if (onSuccess) {
        onSuccess(order)
      }

      return true
    } catch {
      // 用户取消
      return false
    }
  }

  /**
   * 取消订单操作
   * @param {Object} order - 订单对象
   * @param {Function} onSuccess - 成功回调
   */
  const cancelOrder = async (order, onSuccess) => {
    try {
      await showConfirmDialog({
        title: '取消订单',
        message: '确定要取消该订单吗？取消后无法恢复',
        confirmButtonText: '确认取消',
        confirmButtonColor: '#FF3B30'
      })

      // 更新订单状态
      order.status = 'cancelled'

      // 添加取消记录
      if (order.statusList) {
        order.statusList.unshift({
          name: '取消订单',
          time: formatNow(),
          operator: '当前用户'
        })
      }

      showSuccessToast('订单已取消')

      // 执行成功回调
      if (onSuccess) {
        onSuccess(order)
      }

      return true
    } catch {
      // 用户取消
      return false
    }
  }

  /**
   * 刷新订单
   * @param {Object} order - 订单对象
   */
  const refreshOrder = (order) => {
    showToast('刷新订单')
    // 这里可以调用API重新获取订单数据
  }

  return {
    dispatchOrder,
    deliverOrder,
    verifyOrder,
    cancelOrder,
    refreshOrder
  }
}
