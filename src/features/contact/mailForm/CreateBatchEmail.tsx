import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Checkbox, Form, Input, Select, Typography, Upload } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import React, { useEffect, useRef, useState } from 'react'
import { FiAlertCircle, FiUpload, FiX, FiXCircle } from 'react-icons/fi'
import 'react-quill/dist/quill.snow.css'
import { useNavigate } from 'react-router'

import { useGetContactsList } from '../../../api/reactQuery/Contact'
import { useSendBatchMail } from '../../../api/reactQuery/sendMail'
import { useGetUserList } from '../../../api/reactQuery/user'
import { StyledSelect } from '../../../component/componentOfForm/ComponentOfForm.style'
import { NotificationCustom } from '../../../component/notification/Notification'
import { useCheckUploadFile } from '../../../utils/BeforeUploadFile'
import useAutoFocus from '../../../utils/autoFocus'
import { maxLengthRule } from '../../../utils/validate'
import { CustomReactQuillCreateEmail, EmailModalStyle } from '../style'

interface pageProps {
  onCloseModal: any
  open: boolean
  selectedUserList?: any[]
}

const CreateBatchEmail: React.FC<pageProps> = ({
  onCloseModal,
  open,
  selectedUserList
}) => {
  const [content, setContent] = useState('')
  const [characterCount, setCharacterCount] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCcContact, setIsCcContact] = useState<boolean>(false)
  const [useShortenLink, setUseShortenLink] = useState<0 | 1>(0)
  const [files, setFiles] = useState<any[]>([])

  const [form] = Form.useForm()
  const contentEmailRef = useRef<any>()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const defaultContent = '<p><br></p>'

  const { beforeUploadFile, allowedFileExtensions } = useCheckUploadFile({
    typeAccept: ['image', 'pdf', 'video'],
    maxFiles: 5
  })

  useAutoFocus(contentEmailRef, open)

  useEffect(() => {
    form.setFieldsValue({
      to: selectedUserList?.map((item: any) => item?.uuid)
    })
  }, [selectedUserList, form])

  useEffect(() => {
    setCharacterCount(
      content === defaultContent || content.length < 7 ? 0 : content.length - 7
    )
  }, [content])

  const { data: contactList, isLoading: listLoading } = useGetContactsList()
  const { data: userList, isLoading: userLoading } = useGetUserList()

  const { mutate: mutateSendMail } = useMutation({
    mutationFn: useSendBatchMail
  })

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        onSend(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const onSend = (values: any) => {
    const { ccUser, content, title, to, attachFile } = values || {}

    const formData = new FormData()

    formData.append('subject', title)
    formData.append('receiver_contact_uuids', to.toString())
    formData.append('use_shorten_link', useShortenLink.toString())

    if (content) {
      formData.append('content', content)
    }

    if (ccUser) {
      formData.append('cc_user_uuids', ccUser.toString()?.trim())
    }

    if (files.length > 0) {
      files?.forEach((file: any, idx: number) => {
        formData.append(`attach_file_${idx + 1}`, file.originFileObj)
      })
    }

    setIsLoading(true)

    mutateSendMail(formData, {
      onSuccess: () => {
        NotificationCustom({
          type: 'success',
          message: 'Send mail successfully'
        })
        queryClient.invalidateQueries({
          queryKey: ['GetContactMailActivities']
        })
        setIsLoading(false)
        setIsCcContact(false)
        onCloseModal()
        form.resetFields()
        navigate('/mails')
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'send mail failed',
          description: error.message
        })
        setIsLoading(false)
      }
    })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const onCheckboxChangeEvent = (e: CheckboxChangeEvent) => {
    e.target.checked ? setUseShortenLink(1) : setUseShortenLink(0)
  }

  const handleOnchangeContentEmail = (value: string) => {
    setContent(value)
    form.setFieldsValue({ content: value })
  }

  const customFilterOption = (inputValue: string, option: any) => {
    return String(option.children)
      .toLowerCase()
      .includes(inputValue.toLowerCase())
  }

  const filterOption = (input: any, option: any) => {
    const contactName = option.children ? option.children.toLowerCase() : ''
    return contactName.includes(input.toLowerCase())
  }

  return (
    <EmailModalStyle
      className='modal-email create'
      title={
        <div className='modal-title'>
          <div className='btn-title'></div>
          <div className='title'>Create Batch Email</div>
          <div className='btn-title close-modal' onClick={onCloseModal}>
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      width={600}
      open={open}
      onCancel={onCloseModal}
      onOk={handleCreate}
      closeIcon={<></>}
      footer={false}
    >
      <Form
        name='FormCreateEmail'
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={handleCreate}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <div className='modal-content'>
          <div className='row-field f-1'>
            <Form.Item
              label='To'
              name='to'
              rules={[{ required: true, message: 'This field is required!' }]}
            >
              <StyledSelect
                maxTagCount='responsive'
                maxTagTextLength={20}
                mode='multiple'
                style={{ width: '100%' }}
                placeholder='Select contacts'
                allowClear
                filterOption={customFilterOption}
                tagRender={(props: any) => {
                  return (
                    <span className='ant-select-selection-item'>
                      <span className='ant-select-selection-item-content'>
                        {props?.label[0]}
                      </span>
                      <span
                        className='ant-select-selection-item-remove'
                        unselectable='on'
                        aria-hidden='true'
                        style={{ userSelect: 'none' }}
                        onClick={props.onClose}
                      >
                        <FiX style={{ fontSize: '14px' }} />
                      </span>
                    </span>
                  )
                }}
              >
                {contactList?.data?.map((item: any) => (
                  <Select.Option key={item.uuid} value={item.uuid}>
                    {item.shortname || item.fullname}
                    {item.email && ` - ${item.email}`}
                  </Select.Option>
                ))}
              </StyledSelect>
            </Form.Item>
          </div>

          <div className='row-field f-1'>
            <Form.Item label='Cc User' name='ccUser'>
              <StyledSelect
                maxTagCount='responsive'
                maxTagTextLength={20}
                mode='multiple'
                style={{ width: '100%' }}
                placeholder='Select user'
                allowClear
                filterOption={customFilterOption}
                loading={userLoading}
              >
                {userList?.data?.map((item: any) => (
                  <Select.Option key={item.uuid} value={item.uuid}>
                    {item.displayname}
                    {item.email && ` - ${item.email}`}
                  </Select.Option>
                ))}
              </StyledSelect>
            </Form.Item>
          </div>

          <div className='row-field f-1'>
            <Form.Item
              label='Title'
              name='title'
              rules={[
                { required: true, message: 'This field is required!' },
                maxLengthRule(100)
              ]}
            >
              <Input placeholder='Fill mail title' />
            </Form.Item>
          </div>

          <div className='row-field f-1'>
            <Form.Item name='content' rules={[maxLengthRule(4000)]}>
              <CustomReactQuillCreateEmail
                ref={contentEmailRef}
                style={{ height: 'auto' }}
                modules={{
                  toolbar: {
                    container: [
                      [
                        {
                          header: [1, 2, 3, 4, 5, 6, false]
                        }
                      ],
                      ['bold', 'italic', 'underline'],
                      [{ align: [] }],
                      ['link'],
                      ['clean']
                    ]
                  }
                }}
                formats={[
                  'header',
                  'font',
                  'size',
                  'bold',
                  'italic',
                  'underline',
                  'list',
                  'indent',
                  'link',
                  'color',
                  'background'
                ]}
                theme={'snow'}
                value={content}
                onChange={handleOnchangeContentEmail}
              />
              <i className='count-character'>{`${characterCount} / 4000`}</i>
            </Form.Item>
          </div>

          {/* <Form.List name='url'>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <div className='row-field f-1'>
                    <Form.Item label={`URL${index + 1} `} key={field.key}>
                      <Form.Item {...field} noStyle>
                        <Input
                          placeholder='input url'
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                      <MinusCircleOutlined
                        className='dynamic-delete-button'
                        onClick={() => remove(field.name)}
                      />
                    </Form.Item>
                  </div>
                ))}

                <div className='row-field f-1'>
                  <Form.Item>
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      style={{ width: '100%' }}
                      icon={<PlusOutlined />}
                    >
                      Add URL
                    </Button>
                  </Form.Item>
                </div>
              </>
            )}
          </Form.List> */}

          <div className='row-field f-1'>
            <Form.Item name='attachFile'>
              <Upload
                accept={allowedFileExtensions}
                multiple={true}
                name='mail_attach_file'
                className='mail_attach_file'
                listType='text'
                customRequest={() => {}}
                maxCount={5}
                beforeUpload={beforeUploadFile}
                fileList={files}
                onChange={(e) => {
                  const validFiles = e.fileList.filter((file) => file.status)

                  setFiles(validFiles)
                }}
              >
                <Button icon={<FiUpload />}>Attach file</Button>
              </Upload>
            </Form.Item>
          </div>
        </div>

        <Form.Item
          wrapperCol={{ offset: 0, span: 24 }}
          className='footer-actions'
        >
          <div className='footer-checkbox'>
            <Checkbox onChange={onCheckboxChangeEvent}>
              Use shorten link
            </Checkbox>
            <FiAlertCircle className='checkbox-warning-icon' />
          </div>
          <div className='btn-actions'>
            <Button
              disabled={isLoading}
              htmlType='button'
              className='btn-footer cancel'
              onClick={onCloseModal}
            >
              Cancel
            </Button>
            <Button
              loading={isLoading}
              htmlType='submit'
              className='btn-footer submit'
            >
              Send
            </Button>
          </div>
        </Form.Item>
      </Form>
    </EmailModalStyle>
  )
}

export default CreateBatchEmail
