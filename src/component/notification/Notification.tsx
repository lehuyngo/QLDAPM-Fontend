import { notification } from 'antd'

type NotificationType = {
  type: 'success' | 'info' | 'warning' | 'error'
  message?: string
  description?: string
}

export const NotificationCustom = (values: NotificationType) => {
  const { type, message, description } = values
  notification.open({
    message: message,
    description: description,
    type: type,
    duration: type === 'success' ? 1 : 2
  })
}
