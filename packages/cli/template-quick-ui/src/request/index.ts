import { request, notification } from '@quick/ui'

const api = request.create<{
  code: number
  message: string
  data: any
}>({
  validateData: data => data.code === 0,
  reject: error => {
    const msg = error.response?.data?.message || error.message
    notification.error({ title: '系统消息', description: msg, placement: 'bottomRight', duration: 3 })
    return Promise.reject(error)
  }
})

export default api
