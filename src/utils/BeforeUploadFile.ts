import { message } from 'antd'
import { ALLOW_FILE } from '../constants/common'

const useCheckUploadFile = ({
  maxFiles = 0,
  typeAccept = [],
  maxSizeMB = 10,
  maxLengthNameFile = 0
}: {
  maxFiles?: number
  typeAccept: string[]
  maxSizeMB?: number
  maxLengthNameFile?: number
}) => {
  const maxFileSize = maxSizeMB * 1024 * 1024 // 10MB in bytes

  let listTypeAccept: any
  if (typeAccept.length > 0) {
    let types: any = []
    typeAccept.forEach((type) => {
      types.push(ALLOW_FILE[type.toUpperCase() as keyof typeof ALLOW_FILE])
    })
    listTypeAccept = types.flat()
  } else {
    listTypeAccept = []
  }

  const allowedFileExtensions = listTypeAccept.join(',')

  const beforeUploadFile = (file: any, fileList: any) => {
    if (maxFiles > 0) {
      let acceptFileNumber = fileList?.map((f: any) => f.uid).indexOf(file.uid)
      if (acceptFileNumber >= maxFiles) {
        message.error(`You can only upload maximum ${maxFiles} files.`)
        return false
      }
    }

    let fileName = file?.name    
    if (maxLengthNameFile > 0 && fileName.length > maxLengthNameFile) {
      message.error(`This file name is too long! Maximum ${maxLengthNameFile} characters.`)
      return false
    }
    if (!listTypeAccept.some((ext: string) => fileName.endsWith(ext))) {
      message.error(`This file type is not supported!`)
      return false
    }
    if (file?.size > maxFileSize) {
      message.error(
        `This file size exceeds the limit (${maxSizeMB}MB)!`
      )
      return false
    }

    return true
  }

  return { beforeUploadFile, allowedFileExtensions }
}

export { useCheckUploadFile }
