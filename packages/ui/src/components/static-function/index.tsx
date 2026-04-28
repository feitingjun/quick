import { App, type GetProp } from 'antd'

let message: GetProp<ReturnType<typeof App.useApp>, 'message'>
let modal: GetProp<ReturnType<typeof App.useApp>, 'modal'>
let notification: GetProp<ReturnType<typeof App.useApp>, 'notification'>

export const useRegisterStatic = () => {
  const { message: messageInstance, modal: modalInstance, notification: notificationInstance } = App.useApp()
  message = messageInstance
  modal = modalInstance
  notification = notificationInstance
  return null
}

export { message, modal, notification }
