import { App } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'

let message: MessageInstance

export const useRegisterMessage = () => {
  const { message: messageInstance } = App.useApp()
  message = messageInstance
  return null
}

export { message }
