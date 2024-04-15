import validator from 'validator'
import { clearSpaceString } from './FunctionsShare'

export const validateEmail = {
  validator: (_: any, value: any, callback: any) => {
    if (value) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (regex.test(value)) {
        callback()
      } else {
        callback('The input data is syntax error.')
      }
    } else {
      callback()
    }
  },
  validateTrigger: 'onBlur'
}

export const validateEditor = {
  validator: (_: any, value: any, callback: any) => {
    if (value.length > 8192) {
      return Promise.reject(new Error('Accept up to 8192 characters!'))
    }
    if (value.replace(/<[^>]+>/g, '') !== '') {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Please input your notes!'))
  },
  validateTrigger: 'onBlur'
}

export const validationWebsite = {
  validator: (_: any, value: any, callback: any) => {
    if (value) {
      if (validator.isURL(value)) {
        callback() // Value is numeric, no error
      } else {
        callback('The input data is syntax error.') // Value is not numeric, return error
      }
    } else {
      callback() // No value, no error
    }
  },
  validateTrigger: 'onBlur'
}

export const validatePoint1 = {
  validator: (_: any, value: number, callback: any) => {
    if (value) {
      if (value.toString().length > 9) {
        callback('Maximum 9 characters allowed')
      }
      if (+value > 9999) {
        callback('Range is 0-9999!')
      } else {
        callback()
      }
    } else {
      callback() // No value, no error
    }
  }
}

export const validatePoint = {
  validator: (_: any, value: number, callback: any) => {
    if (value || value === 0) {
      if (value < 1 || value > 9999) {
        callback('Range is 1-9999!')
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}

export const isWebsiteHaveHttp = (website: string) => {
  const hasHttpOrHttps =
    website.toLowerCase().startsWith('http') ||
    website.toLowerCase().startsWith('https')

  return hasHttpOrHttps
}

export const validateUsername = {
  validator: (_: any, value: any, callback: any) => {
    if (value) {
      const regex = /^[0-9a-z]+$/
      if (regex.test(value)) {
        callback()
      } else {
        callback('Allow numeric digits and lowercase letters!')
      }
    } else {
      callback()
    }
  },
  validateTrigger: 'onBlur'
}

export const maxLengthRule = (max: number) => ({
  message: `Please do not enter more than ${max} characters!`,
  max: max
})

export const validateDuplicate = ({
  data,
  key,
  uuidExisted
}: {
  data: any
  key: string
  uuidExisted?: string | null
}) => ({
  validator: (_: any, value: any, callback: any) => {
    const ClientsListFilter = data?.filter(
      (item: any) => item.uuid !== uuidExisted
    )

    if (value === undefined) {
      return callback()
    } else {
      const upperCase = key?.charAt(0).toUpperCase() + key?.slice(1)
      const lowercaseValue = value.toLowerCase()

      const isDuplicate = ClientsListFilter?.some(
        (item: any) =>
          item?.[key]?.toLowerCase()?.replace(/\s+/g, ' ')?.trim() ===
          lowercaseValue?.replace(/\s+/g, ' ')?.trim()
      )

      if (isDuplicate) {
        return callback(`${upperCase} already exists!`)
      }
    }

    return callback()
  }
})

interface CheckDuplicateProps {
  value: string
  dataExited: any
  keyCompare: string
  setDuplicateInfo: any
}

export const handleCheckDuplicate = ({
  value,
  dataExited,
  keyCompare,
  setDuplicateInfo
}: CheckDuplicateProps) => {
  const lowercaseValue = value && clearSpaceString(value.toLowerCase())

  const lowercasedData = dataExited?.map((item: any) => ({
    id: item.uuid,
    name: item.fullname,
    value: item?.[keyCompare]?.toLowerCase()
  }))

  const duplicateItem = lowercasedData.find(
    (item: any) => item.value === lowercaseValue
  )

  const newDuplicateInfo = duplicateItem
    ? {
        isDuplicate: true,
        duplicateId: duplicateItem.id,
        duplicateName: duplicateItem.name
      }
    : {
        isDuplicate: false,
        duplicateId: null,
        duplicateName: null
      }

  setDuplicateInfo(newDuplicateInfo)
}
