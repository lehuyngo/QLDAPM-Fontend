import { Button, Form, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { FiEdit2, FiPaperclip, FiXCircle } from 'react-icons/fi'

import { ImageWithAuth } from '../../../component/getImageWithAuth/ImageWithAuth'
import { ALLOW_FILE } from '../../../constants/common'
import { ContactModalStyle } from '../style'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUpdateContact } from '../../../api/reactQuery/Contact'
import { NotificationCustom } from '../../../component/notification/Notification'
import { useCheckUploadFile } from '../../../utils/BeforeUploadFile'
interface CreateFormProps {
  visible: boolean
  onClose: () => void
  title?: String
  uuid: string | null
  oldData: any
}

const QuickChangeNameCard: React.FC<CreateFormProps> = ({
  title,
  visible,
  onClose,
  uuid,
  oldData
}) => {
  const [imageNameCard, setImageNameCard] = useState<any>(null)

  const [form] = Form.useForm<any>()
  const queryClient = useQueryClient()
  const { beforeUploadFile, allowedFileExtensions } = useCheckUploadFile({
    typeAccept: ['image'],
    maxFiles: 1
  })

  const { mutate: mutateUpdate } = useMutation({ mutationFn: useUpdateContact })

  useEffect(() => {
    if (oldData?.name_card?.url) {
      setImageNameCard(oldData?.name_card?.url)
    } else {
      setImageNameCard(null)
    }
  }, [oldData])

  const handleQuickEdit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const onSubmit = (values: any) => {
    const formData = new FormData()

    if (oldData.birthday !== undefined) {
      formData.append('birthday', oldData.birthday)
    }

    if (
      imageNameCard &&
      imageNameCard.length > 0 &&
      imageNameCard[0].originFileObj
    ) {
      formData.append('name_card', imageNameCard[0].originFileObj)
    }

    formData.append('fullname', oldData.fullname || '')
    formData.append('shortname', oldData.shortname || '')
    formData.append('phone', oldData.phone || '')
    formData.append('email', oldData.email || '')
    formData.append('job_title', oldData.job_title || '')
    formData.append(
      'gender',
      [1, 2, 3].includes(oldData.gender) ? oldData.gender : ''
    ) //1=female

    const dataUpdate = { formData: formData, uuid: uuid }

    mutateUpdate(dataUpdate, {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({
          queryKey: ['GetContactsList']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetContactDetail', uuid]
        })
        NotificationCustom({
          type: 'success',
          message: 'Update success',
          description: 'The name card has been updated successfully!'
        })
        onClose()
        form.resetFields()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Edit name card fail',
          description: error.message
        })
        console.error('Error posting data', error)
      }
    })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <ContactModalStyle
      className='modal-contact create'
      open={visible}
      title={
        <div className='modal-title'>
          <div className='btn-title'></div>
          <div className='title'>{title}</div>
          <div className='btn-title close-modal' onClick={onClose}>
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      width={600}
      onCancel={onClose}
      onOk={handleQuickEdit}
      closeIcon={<></>}
      footer={false}
    >
      <Form
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={handleQuickEdit}
        onFinishFailed={onFinishFailed}
      >
        <div className='modal-content'>
          <div className='row-field f-1'>
            <Form.Item
              label='Name card'
              name='name_card'
              rules={[{ required: false, message: 'Please upload name card!' }]}
            >
              <Upload
                accept={allowedFileExtensions}
                customRequest={() => {}}
                showUploadList={false}
                name='name_card'
                className='upload-name-card'
                listType='picture-card'
                maxCount={1}
                beforeUpload={beforeUploadFile}
                onChange={(e) => {
                  if (e?.file?.originFileObj) {
                    setImageNameCard(e.fileList)
                  }
                }}
              >
                <div className='contact-upload-image-name-card'>
                  {imageNameCard && typeof imageNameCard === 'string' && (
                    <div className='img-name-card'>
                      <ImageWithAuth url={imageNameCard} preview={false} />
                    </div>
                  )}
                  {imageNameCard && typeof imageNameCard !== 'string' && (
                    <img
                      className='img-name-card'
                      src={URL.createObjectURL(imageNameCard[0]?.originFileObj)}
                      alt='upload img default'
                    />
                  )}
                  {!imageNameCard && (
                    <div>
                      <FiPaperclip
                        style={{ fontSize: '250%', color: '#FC7634' }}
                      />
                      <p>Drop Files here or click to upload</p>
                      <p>
                        Drop Files here or click browse through your machine
                      </p>
                    </div>
                  )}

                  <div className='edit-icon-name-card'>
                    <FiEdit2 style={{ fontSize: '14px', color: '#333' }} />
                  </div>
                </div>
              </Upload>
            </Form.Item>
          </div>
        </div>

        <Form.Item
          wrapperCol={{ offset: 0, span: 24 }}
          className='footer-actions'
        >
          <div className='btn-actions'>
            <Button
              htmlType='button'
              className='btn-footer cancel'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button htmlType='submit' className='btn-footer submit'>
              {title === 'Create Contact' ? 'Create' : 'Save'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </ContactModalStyle>
  )
}

export default QuickChangeNameCard
