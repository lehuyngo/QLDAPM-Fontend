import { message } from 'antd'

export const beforeUploadImage = (file: any) => {
  const isImage = file.type.startsWith('image/')
  const isSizeValid = file.size / 1024 / 1024 <= 10 // 10MB limit

  if (!isImage) {
    message.error('The file type is not allowed.')
  }

  if (!isSizeValid) {
    message.error('The file exceeds 10MB. Please upload another file.')
  }

  return isImage && isSizeValid
}
