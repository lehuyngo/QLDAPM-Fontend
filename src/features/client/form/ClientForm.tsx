import { Col, Form, Row, Spin, Typography, Upload } from 'antd'
import { FormInstance } from 'antd/lib/form'
import React, { useEffect, useRef, useState } from 'react'
import { FiEdit2, FiXCircle } from 'react-icons/fi'

import {
  useGetClientDetail,
  useGetClientsList
} from '../../../api/reactQuery/Client'
import {
  StyledButton,
  StyledForm,
  StyledInput
} from '../../../component/componentOfForm/ComponentOfForm.style'
import DeleteForm from '../../../component/deleteForm/DeleteForm'
import { ImageWithAuth } from '../../../component/getImageWithAuth/ImageWithAuth'
import UploadImageDefault from '../../../resources/images/image-default.jpg'
import { CrmModal } from '../../../theme/crm.style'
import { useCheckUploadFile } from '../../../utils/BeforeUploadFile'
import { clearSpaceString } from '../../../utils/FunctionsShare'
import {
  validateDuplicate,
  handleCheckDuplicate,
  maxLengthRule,
  validationWebsite
} from '../../../utils/validate'
import useAutoFocus from '../../../utils/autoFocus'

interface CreateFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  clientId?: string | null
  onUpdate?: (data: any, onChangeLoading: any) => void
  onCreate?: (data: FormData, onChangeLoading: any) => void
  resetForm: boolean
}

const { Text, Link } = Typography
const ClientForm: React.FC<CreateFormProps> = ({
  visible,
  setVisible,
  clientId,
  onCreate,
  onUpdate,
  resetForm
}) => {
  const [isCreateContact, setIsCreateContact] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateLead, setIsCreateLead] = useState(false)
  const [imageLogo, setImageLogo] = useState<any>(null)
  const [duplicateInfo, setDuplicateInfo] = useState({
    isDuplicate: false,
    duplicateId: null,
    duplicateName: null
  })
  const [idEdit, setIdEdit] = useState<string | null>(clientId || null)

  const [form] = Form.useForm<FormInstance>()
  const fullNameInputRef = useRef<any>(null)
  const contactNameInputRef = useRef<any>(null)
  const leadNameInputRef = useRef<any>(null)

  const { data: ClientsList } = useGetClientsList()
  const { data: clientData, isLoading: dataLoading } =
    useGetClientDetail(idEdit)

  const { beforeUploadFile, allowedFileExtensions } = useCheckUploadFile({
    typeAccept: ['image'],
    maxFiles: 1
  })

  useAutoFocus(fullNameInputRef, visible)
  useAutoFocus(contactNameInputRef, isCreateContact && visible)
  useAutoFocus(leadNameInputRef, isCreateContact && visible)

  const ClientsListFilter = ClientsList?.data?.filter(
    (item: any) => item.uuid !== clientData?.uuid
  )

  const handleOkOpenEdit = () => {
    setIdEdit(duplicateInfo.duplicateId)
    setDuplicateInfo((prevInfo) => ({ ...prevInfo, isDuplicate: false }))
    form.validateFields()
  }

  const ValidateDuplicateCode = validateDuplicate({
    data: ClientsListFilter,
    key: 'code',
    uuidExisted: idEdit ? duplicateInfo.duplicateId : null
  })
  const ValidateDuplicateFullName = validateDuplicate({
    data: ClientsListFilter,
    key: 'fullname',
    uuidExisted: idEdit ? duplicateInfo.duplicateId : null
  })
  const ValidateDuplicateShortname = validateDuplicate({
    data: ClientsListFilter,
    key: 'shortname',
    uuidExisted: idEdit ? duplicateInfo.duplicateId : null
  })

  const handleInputBlur = (keyCompare: string) => {
    const value = form.getFieldValue(keyCompare)

    !idEdit &&
      value &&
      handleCheckDuplicate({
        value,
        dataExited: ClientsListFilter,
        keyCompare,
        setDuplicateInfo
      })
  }

  useEffect(() => {
    if (resetForm) {
      form.resetFields()
    }

    if (clientData) {
      form.setFieldsValue(clientData)
    }
    if (clientData?.logo?.url) {
      setImageLogo(clientData?.logo?.url)
    } else {
      setImageLogo(null)
    }
  }, [clientData, form, resetForm])

  const onChangeLoading = (loading: boolean) => {
    setIsLoading(loading)
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
    const {
      fullname,
      shortname,
      code,
      phone,
      fax,
      website,
      email,
      company_size,
      address
    } = values || {}

    const formData = new FormData()
    if (imageLogo && imageLogo.length > 0) {
      formData.append('image', imageLogo[0].originFileObj)
    }

    fullname && formData.append('fullname', clearSpaceString(fullname))
    shortname && formData.append('shortname', clearSpaceString(shortname))
    code && formData.append('code', code)
    phone && formData.append('phone', phone)
    fax && formData.append('fax', fax)
    website && formData.append('website', website)
    email && formData.append('email', email)
    company_size && formData.append('company_size', company_size)
    address && formData.append('address', address)
    formData.append('force', 'true')

    const dataUpdate = { formData: formData, uuid: clientData?.uuid }

    idEdit
      ? onUpdate && onUpdate(dataUpdate, onChangeLoading)
      : onCreate && onCreate(formData, onChangeLoading)
  }

  return (
    <CrmModal
      open={visible}
      title={
        <div className='modal-title'>
          <div className='btn-title'></div>
          <div className='title'>
            {idEdit ? 'Update Client' : 'Create Client'}
          </div>
          <div
            className='btn-title close-modal'
            onClick={() => {
              setVisible(false)
            }}
          >
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      closeIcon={<></>}
      okText='Create'
      cancelText='Cancel'
      onOk={handleCreate}
      onCancel={() => {
        setVisible(false)
      }}
      footer={[
        <StyledButton key='cancel' onClick={() => setVisible(false)}>
          Cancel
        </StyledButton>,
        <StyledButton
          onClick={() => {
            handleCreate()
          }}
          type='primary'
          style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
          loading={isLoading}
        >
          {idEdit ? 'Save' : 'Create'}
        </StyledButton>
      ]}
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

      <StyledForm
        form={form}
        layout='vertical'
        requiredMark={false}
        disabled={dataLoading}
      >
        <Form.Item
          name='image'
          label='Logo'
          valuePropName='fileList'
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            accept={allowedFileExtensions}
            customRequest={() => {}}
            showUploadList={false}
            name='image'
            className='client-upload-logo'
            listType='picture-card'
            maxCount={1}
            beforeUpload={beforeUploadFile}
            onChange={(e) => {
              if (e?.file?.originFileObj) {
                setImageLogo(e.fileList)
              }
            }}
          >
            <div className='client-upload-image'>
              {imageLogo && typeof imageLogo === 'string' && (
                <div className='img-logo'>
                  <ImageWithAuth url={imageLogo} preview={false} />
                </div>
              )}
              {imageLogo && typeof imageLogo !== 'string' && (
                <img
                  className='img-logo'
                  src={URL.createObjectURL(imageLogo[0]?.originFileObj)}
                  alt='upload img default'
                />
              )}
              {!imageLogo && (
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
            {/* )} */}
          </Upload>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <>
                  Full name&nbsp; <span style={{ color: 'red' }}> (*)</span>
                </>
              }
              name='fullname'
              rules={[
                {
                  required: true,
                  message: 'This field is required!'
                },
                maxLengthRule(255),
                ValidateDuplicateFullName
              ]}
            >
              <StyledInput
                ref={fullNameInputRef}
                autoFocus
                placeholder='Fill client name'
                onChange={() => handleInputBlur('fullname')}
              />
            </Form.Item>
            {duplicateInfo.isDuplicate && (
              <Text type='secondary' style={{ fontSize: '12px' }}>
                To update information, please
                <Link
                  style={{ fontSize: '12px' }}
                  onClick={() => handleOkOpenEdit()}
                >
                  {' '}
                  click here
                </Link>
              </Text>
            )}
          </Col>
          <Col span={12}>
            <Form.Item
              label='Client Code'
              name='code'
              rules={[maxLengthRule(100), ValidateDuplicateCode]}
            >
              <StyledInput
                placeholder='Fill client code'
                onChange={() => handleInputBlur('code')}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: '0px' }}
              label='Short Name'
              name='shortname'
              rules={[maxLengthRule(255), ValidateDuplicateShortname]}
            >
              <StyledInput
                placeholder='Fill short name'
                onChange={() => handleInputBlur('shortname')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Company size'
              name='company_size'
              rules={[maxLengthRule(100)]}
            >
              <StyledInput placeholder='Fill company size' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Fax' name='fax'>
              <StyledInput placeholder='Fill client fax' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<>Website&nbsp;</>}
              name='website'
              rules={[maxLengthRule(255), validationWebsite]}
            >
              <StyledInput placeholder='Fill client website' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Hotline' name='phone' rules={[maxLengthRule(30)]}>
              <StyledInput placeholder='Fill client phone' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: '0px' }}
              label='Address'
              name='address'
              rules={[maxLengthRule(255)]}
            >
              <StyledInput placeholder='Fill client address' />
            </Form.Item>
          </Col>
        </Row>

        {/* <Form.Item label='Contact' name='contact'>
          <StyledSelect
            placeholder='Fill your info'
            onChange={(value: any) => {
              form.setFieldValue('status', value)
            }}
            disabled={isCreateContact}
            showSearch
          >
            {statusOption.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </StyledSelect>
          {isCreateContact ? (
            <Text type='secondary' style={{ fontSize: '12px' }}>
              Close creating new contact, please{' '}
              <Link onClick={() => setIsCreateContact(false)}>click here</Link>
            </Text>
          ) : (
            <Text type='secondary' style={{ fontSize: '12px' }}>
              Create new contact, please{' '}
              <Link onClick={() => setIsCreateContact(true)}>click here</Link>
            </Text>
          )}
        </Form.Item>
        {isCreateContact ? (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <>
                    Contact name&nbsp;
                    <span style={{ color: 'red' }}> (*)</span>
                  </>
                }
                name='contactName'
              >
                <StyledInput
                  placeholder='Fill your info'
                  ref={contactNameInputRef}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <>
                    Email&nbsp;
                    <span style={{ color: 'red' }}> (*)</span>
                  </>
                }
                name='email'
                rules={[validateEmail]}
              >
                <StyledInput placeholder='Fill your info' />
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <></>
        )}

        <Form.Item
          label={'Lead'}
          name='lead'
          // rules={[
          //   {
          //     required: true,
          //     message: 'Please StyledInput the title of collection!'
          //   }
          // ]}
        >
          <StyledSelect
            onChange={(value: any) => {
              form.setFieldValue('status', value)
              // if (value === 'Project recieved') setIsProjectRecived(true)
              // else setIsProjectRecived(false)
            }}
            placeholder='Fill your info'
            disabled={isCreateLead}
            showSearch
          >
            {statusOption.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </StyledSelect>
          {isCreateLead ? (
            <Text type='secondary' style={{ fontSize: '12px' }}>
              Close creating new lead, please{' '}
              <Link onClick={() => setIsCreateLead(false)}>click here</Link>
            </Text>
          ) : (
            <Text type='secondary' style={{ fontSize: '12px' }}>
              Crete new lead, please{' '}
              <Link onClick={() => setIsCreateLead(true)}>click here</Link>
            </Text>
          )}
        </Form.Item>

        {isCreateLead ? (
          <Form.Item
            label={
              <>
                Full Name&nbsp; <span style={{ color: 'red' }}> (*)</span>
              </>
            }
            name='fullName'
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please StyledInput the title of collection!'
            //   }
            // ]}
          >
            <StyledInput placeholder='Fill your info' ref={leadNameInputRef} />
          </Form.Item>
        ) : (
          <></>
        )} */}
      </StyledForm>
      {/* 
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
            <p>{`Client already exists with name: "${duplicateInfo.duplicateName}". Are you sure you want to update this client info?`}</p>
          }
        />
      )} */}
    </CrmModal>
  )
}

export default ClientForm
