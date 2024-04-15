import { Button, Form, Input, Spin, Upload } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { FiEdit2, FiPaperclip, FiXCircle } from 'react-icons/fi'

import { StyledSelect } from '../../../component/componentOfForm/ComponentOfForm.style'
import { ImageWithAuth } from '../../../component/getImageWithAuth/ImageWithAuth'
import { convertTimestamp, toTimestamp } from '../../../utils/convertTimestamp'
import { ContactModalStyle } from '../style'
import { DatePickerLocale } from '../../../component/datePicker'
import UploadImageDefault from '../../../resources/images/image-default.jpg'
import useAutoFocus from '../../../utils/autoFocus'
import {
  validateDuplicate,
  handleCheckDuplicate,
  maxLengthRule,
  validateEmail
} from '../../../utils/validate'
import { useCheckUploadFile } from '../../../utils/BeforeUploadFile'
import { clearSpaceString } from '../../../utils/FunctionsShare'
import {
  useGetContactDetail,
  useGetContactsList
} from '../../../api/reactQuery/Contact'
import DeleteForm from '../../../component/deleteForm/DeleteForm'
interface CreateFormProps {
  visible: boolean
  loading?: boolean
  contactId?: string | null
  onUpdate?: (data: any, onChangeLoading?: any) => void
  onCreate?: (data: any, onChangeLoading?: any) => void
  resetForm: boolean
  loadingData?: boolean
  onClose: () => void
}

const CreateContact: React.FC<CreateFormProps> = ({
  visible,
  onClose,
  contactId,
  onCreate,
  onUpdate,
  resetForm,
  loading
}) => {
  const [openNClient, setOpenNClient] = useState(false)
  const [openNLead, setOpenNLead] = useState(false)
  const [imageAvatar, setImageAvatar] = useState<any>(null)
  const [imageNameCard, setImageNameCard] = useState<any>(null)
  const [duplicateInfo, setDuplicateInfo] = useState({
    isDuplicate: false,
    duplicateId: null,
    duplicateName: null
  })
  const [idEdit, setIdEdit] = useState<string | null>(contactId || null)

  const fullNameInputRef = useRef<any>(null)
  const fullNameLeadRef = useRef<any>(null)
  const fullNameClientRef = useRef<any>(null)

  const [form] = Form.useForm<any>()

  const { data: ContactsList } = useGetContactsList()
  const { data: contactData, isLoading: dataLoading } =
    useGetContactDetail(idEdit)

  const { beforeUploadFile, allowedFileExtensions } = useCheckUploadFile({
    typeAccept: ['image'],
    maxFiles: 1
  })

  useAutoFocus(fullNameLeadRef, openNLead && visible)
  useAutoFocus(fullNameClientRef, openNClient && visible)
  useAutoFocus(fullNameInputRef, visible)

  const ContactsListFilter = ContactsList?.data?.filter(
    (item: any) => item.uuid !== contactData?.uuid
  )

  const ValidateDuplicateEmail = validateDuplicate({
    data: ContactsListFilter,
    key: 'email'
  })

  // const handleInputBlur = (keyCompare: string) => {
  //   const value = form.getFieldValue(keyCompare)

  //   !idEdit &&
  //     value &&
  //     handleCheckDuplicate({
  //       value,
  //       dataExited: ContactsListFilter,
  //       keyCompare,
  //       setDuplicateInfo
  //     })
  // }

  useEffect(() => {
    if (resetForm) {
      form.resetFields()
    }

    if (contactData) {
      contactData.birthday
        ? form.setFieldsValue({
            ...contactData,
            birthday: convertTimestamp(contactData.birthday)
          })
        : form.setFieldsValue(contactData)
    }
    if (contactData?.avatar?.url) {
      setImageAvatar(contactData?.avatar?.url)
    } else {
      setImageAvatar(null)
    }

    if (contactData?.name_card?.url) {
      setImageNameCard(contactData?.name_card?.url)
    } else {
      setImageNameCard(null)
    }
  }, [contactData, form, resetForm])

  const handleOpenNClient = () => {
    setOpenNClient(true)
  }

  const handleCloseNClient = () => {
    setOpenNClient(false)
  }

  const handleOpenNLead = () => {
    setOpenNLead(true)
  }

  const handleCloseNLead = () => {
    setOpenNLead(false)
  }

  const onClientChange = (value: string) => {
    form.setFieldValue('client', value)
    return
  }

  const onLeadChange = (value: string) => {
    form.setFieldValue('lead', value)
    return
  }

  const handleOkOpenEdit = () => {
    setIdEdit(duplicateInfo.duplicateId)
    setDuplicateInfo((prevInfo) => ({ ...prevInfo, isDuplicate: false }))
  }

  const handleCreate = () => {
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
    const { fullname, shortname, phone, email, job_title } = values || {}

    const formData = new FormData()

    if (values.birthday !== undefined) {
      const birthdayTimestamps: number | string =
        toTimestamp(values.birthday) || ''
      formData.append('birthday', birthdayTimestamps.toString())
    }

    if (
      imageNameCard &&
      imageNameCard.length > 0 &&
      imageNameCard[0].originFileObj
    ) {
      formData.append('name_card', imageNameCard[0].originFileObj)
    }

    if (imageAvatar && imageAvatar.length > 0 && imageAvatar[0].originFileObj) {
      formData.append('avatar', imageAvatar[0].originFileObj)
    }

    fullname && formData.append('fullname', clearSpaceString(fullname))
    shortname && formData.append('shortname', clearSpaceString(shortname))
    phone && formData.append('phone', phone)
    email && formData.append('email', email)
    job_title && formData.append('job_title', job_title)
    formData.append(
      'gender',
      [1, 2, 3].includes(values.gender) ? values.gender : ''
    ) //1=female

    const dataUpdate = { formData: formData, uuid: contactData?.uuid }

    idEdit ? onUpdate && onUpdate(dataUpdate) : onCreate && onCreate(formData)
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
          <div className='title'>
            {idEdit ? 'Update Contact' : 'Create contact'}
          </div>
          <div className='btn-title close-modal' onClick={onClose}>
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      width={600}
      onCancel={onClose}
      onOk={handleCreate}
      closeIcon={<></>}
      footer={false}
    >
      {dataLoading && (
        <Spin
          style={{
            position: 'absolute',
            left: '30px',
            top: '30px'
          }}
        />
      )}
      <Form
        name='FormCreateContact'
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        onFinish={handleCreate}
        onFinishFailed={onFinishFailed}
        disabled={dataLoading}
      >
        <div className='modal-content'>
          <div className='row-field f-1'>
            <Form.Item
              label='Avatar'
              name='avatar'
              rules={[{ required: false, message: 'Please upload image!' }]}
            >
              <Upload
                accept={allowedFileExtensions}
                name='name_card'
                className='client-upload-logo'
                listType='picture-card'
                customRequest={() => {}}
                maxCount={1}
                beforeUpload={beforeUploadFile}
                onChange={(e) => {
                  if (e?.file?.originFileObj) {
                    setImageAvatar(e.fileList)
                  }
                }}
              >
                <div className='client-upload-image'>
                  {imageAvatar && typeof imageAvatar === 'string' && (
                    <div className='img-logo'>
                      <ImageWithAuth url={imageAvatar} preview={false} />
                    </div>
                  )}
                  {imageAvatar && typeof imageAvatar !== 'string' && (
                    <img
                      className='img-logo'
                      src={URL.createObjectURL(imageAvatar[0]?.originFileObj)}
                      alt='upload img default'
                    />
                  )}
                  {!imageAvatar && (
                    <img
                      className='img-logo'
                      src={UploadImageDefault}
                      alt='upload img default'
                    />
                  )}

                  <div className='edit-icon'>
                    <FiEdit2 style={{ fontSize: '14px', color: '#333' }} />
                  </div>
                </div>
              </Upload>
            </Form.Item>
          </div>

          <div className='row-field f-2'>
            <Form.Item
              label='Full Name'
              name='fullname'
              rules={[
                {
                  required: true,
                  message: 'Please input fullname!'
                },
                maxLengthRule(255)
              ]}
            >
              <Input
                ref={fullNameInputRef}
                placeholder='Fill contact name'
                // onBlur={() => handleInputBlur('fullname')}
              />
            </Form.Item>

            <Form.Item
              label='Short Name'
              name='shortname'
              rules={[maxLengthRule(255)]}
            >
              <Input
                placeholder='Fill short name'
                // onBlur={() => handleInputBlur('shortname')}
              />
            </Form.Item>
          </div>

          <div className='row-field f-2'>
            <Form.Item
              label='Job Title'
              name='job_title'
              rules={[maxLengthRule(255)]}
            >
              <Input placeholder='Fill job title' />
            </Form.Item>

            <Form.Item
              label='Birthday'
              name='birthday'
              rules={[{ required: false }]}
            >
              <DatePickerLocale
                placeholder='Select contact birthday'
                value={
                  form.getFieldValue('birthday') === ''
                    ? null
                    : form.getFieldValue('birthday')
                }
              />
            </Form.Item>
          </div>

          <div className='row-field f-2'>
            <Form.Item label='Gender' name='gender'>
              <StyledSelect
                placeholder='Gender'
                options={[
                  {
                    value: 1,
                    label: 'Female'
                  },
                  {
                    value: 2,
                    label: 'Male'
                  },
                  {
                    value: 3,
                    label: 'Other'
                  }
                ]}
              />
            </Form.Item>

            <Form.Item
              label='Email'
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please input email!'
                },
                maxLengthRule(255),
                validateEmail,
                ValidateDuplicateEmail
              ]}
            >
              <Input
                placeholder='Fill contact email'
                type='email'
                // onChange={() => handleInputBlur('email')}
              />
            </Form.Item>
          </div>

          <div className='row-field f-2'>
            <Form.Item
              label='Phone Number'
              name='phone'
              rules={[maxLengthRule(30)]}
            >
              <Input placeholder='Fill contact phone' />
            </Form.Item>
          </div>

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

          {/* {!openNClient && (
            <>
              <div className='row-field f-1'>
                <Form.Item label='Client Name' name='client'>
                  <Select
                    defaultValue='1'
                    onChange={onClientChange}
                    options={[
                      {
                        value: '1',
                        label: '1234 - Nguyen Van A - KTC Solutions'
                      },
                      {
                        value: '2',
                        label: '2369 - Nguyen Van B - KFC Solutions'
                      },
                      {
                        value: '3',
                        label: '2370 - Nguyen Van C - TTC Solutions'
                      }
                    ]}
                  />
                </Form.Item>
              </div>
              <div className='sub-form client'>
                <div className='text'>Create new client, please</div>
                <div className='action' onClick={handleOpenNClient}>
                  click here
                </div>
              </div>
            </>
          )} */}

          {/* {openNClient && (
            <>
              <div className='row-field f-1'>
                <Form.Item
                  label='New Client Name'
                  name='clientName'
                  rules={[
                    { required: true, message: 'This is field required!' }
                  ]}
                >
                  <Input placeholder='Fill your info' ref={fullNameClientRef} />
                </Form.Item>
              </div>
              <div className='row-field f-1'>
                <Form.Item
                  label='Website'
                  name='website'
                  rules={[
                    { required: true, message: 'This is field required!' }
                  ]}
                >
                  <Input placeholder='Fill your info' />
                </Form.Item>
              </div>
              <div className='sub-form client'>
                <div className='text'>Select client, please</div>
                <div className='action' onClick={handleCloseNClient}>
                  click here
                </div>
              </div>
            </>
          )} */}

          {/* {!openNLead && (
            <>
              <div className='row-field f-1'>
                <Form.Item
                  label={`Lead's Name`}
                  name='lead'
                  rules={[
                    { required: true, message: 'This is field required!' }
                  ]}
                >
                  <Select
                    defaultValue='1'
                    onChange={onLeadChange}
                    options={[
                      {
                        value: '1',
                        label: '1234 - Nguyen Van A - KTC Solutions'
                      },
                      {
                        value: '2',
                        label: '2369 - Nguyen Van B - KFC Solutions'
                      },
                      {
                        value: '3',
                        label: '2370 - Nguyen Van C - TTC Solutions'
                      }
                    ]}
                  />
                </Form.Item>
              </div>
              <div className='sub-form lead'>
                <div className='text'>Create new lead, please</div>
                <div className='action' onClick={handleOpenNLead}>
                  click here
                </div>
              </div>
            </>
          )} */}

          {/* {openNLead && (
            <>
              <div className='row-field f-1'>
                <Form.Item
                  label={`
                    New Lead's Name
                  `}
                  name='leadFullName'
                  rules={[
                    { required: true, message: 'This is field required!' }
                  ]}
                >
                  <Input placeholder='Fill your info' ref={fullNameLeadRef} />
                </Form.Item>
              </div>
              <div className='sub-form lead'>
                <div className='text'>Select lead, please</div>
                <div className='action' onClick={handleCloseNLead}>
                  click here
                </div>
              </div>
            </>
          )} */}
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
            <Button
              htmlType='submit'
              className='btn-footer submit'
              loading={loading}
            >
              {idEdit ? 'Save' : 'Create'}
            </Button>
          </div>
        </Form.Item>
      </Form>
      {duplicateInfo.isDuplicate && (
        <DeleteForm
          title='Duplicate Client'
          visible={duplicateInfo.isDuplicate}
          onClose={() => {
            setDuplicateInfo((prev) => ({ ...prev, isDuplicate: false }))
            setIdEdit(null)
          }}
          onDelete={handleOkOpenEdit}
          question={
            <p>{`Contact already exists with name: "${duplicateInfo.duplicateName}". Are you sure you want to update this contact info?`}</p>
          }
        />
      )}
    </ContactModalStyle>
  )
}

export default CreateContact
