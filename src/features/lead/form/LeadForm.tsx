import { Col, Form, Row, Select, Typography } from 'antd'
import { FormInstance } from 'antd/lib/form'
import React, { useEffect, useRef, useState } from 'react'
import { FiXCircle } from 'react-icons/fi'
import validator from 'validator'
import {
  StyledButton,
  StyledForm,
  StyledInput,
  StyledSelect
} from '../../../component/componentOfForm/ComponentOfForm.style'

import { CrmModal } from '../../../theme/crm.style'
import {
  useCreateLead,
  useGetLeadList,
  useGetLeadStatus
} from '../../../api/reactQuery/Lead'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NotificationCustom } from '../../../component/notification/Notification'
import { useGetContactsList } from '../../../api/reactQuery/Contact'
import { useGetClientsList } from '../../../api/reactQuery/Client'
import {
  validateDuplicate,
  maxLengthRule,
  validateEmail,
  validationWebsite,
  handleCheckDuplicate
} from '../../../utils/validate'
import {
  clearSpaceString,
  customFilterOption
} from '../../../utils/FunctionsShare'
import LeadFormEdit from './LeadFormEdit'

const { Text, Link } = Typography

interface FormProps {
  visible: boolean
  title: String
  onCloseModal: () => void
  isCreate: boolean
  oldData?: any
}

const LeadForm: React.FC<FormProps> = ({
  title,
  visible,
  onCloseModal,
  isCreate,
  oldData
}) => {
  const [isCreateContact, setIsCreateContact] = useState(false)
  const [isCreateClient, setIsCreateClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isProjectReceived, setIsProjectReceived] = useState<boolean>(false)
  const [status, setStatus] = useState<string | number>(1)
  const [clientSelected, setClientSelected] = useState<string | null>(null)
  // const [duplicateInfo, setDuplicateInfo] = useState({
  //   isDuplicate: false,
  //   duplicateId: null,
  //   duplicateName: null
  // })
  // const [isEdit, setIsEdit] = useState<boolean>(false)

  const [form] = Form.useForm<FormInstance>()
  const fullNameInputRef = useRef<any>(null)
  const contactNameInputRef = useRef<any>(null)
  const clientNameInputRef = useRef<any>(null)
  const queryClient = useQueryClient()

  const { data: leadStatus } = useGetLeadStatus()
  const { data: contactList } = useGetContactsList()
  const { data: clientList } = useGetClientsList()
  const { data: leadList } = useGetLeadList()

  const { mutate: mutateCreateLead } = useMutation({
    mutationFn: useCreateLead
  })

  const ValidateDuplicateFullName = validateDuplicate({
    data: leadList?.data,
    key: 'fullname'
  })

  // const handleInputBlur = (keyCompare: string) => {
  //   const value = form.getFieldValue(keyCompare)

  //   value &&
  //     handleCheckDuplicate({
  //       value,
  //       dataExited: leadList?.data,
  //       keyCompare,
  //       setDuplicateInfo
  //     })
  // }

  // const handleOkOpenEdit = () => {
  //   setIsEdit(true)
  // }

  useEffect(() => {
    if (visible && fullNameInputRef?.current) {
      const timeOut = setTimeout(() => {
        fullNameInputRef.current.focus()
      }, 300)
      return () => {
        clearTimeout(timeOut)
      }
    }
  }, [visible])

  useEffect(() => {
    if (visible && isCreateContact && contactNameInputRef?.current) {
      const timeOut = setTimeout(() => {
        contactNameInputRef.current.focus()
      }, 300)
      return () => {
        clearTimeout(timeOut)
      }
    }
  }, [isCreateContact, visible])

  useEffect(() => {
    if (visible && isCreateClient && clientNameInputRef?.current) {
      const timeOut = setTimeout(() => {
        clientNameInputRef.current.focus()
      }, 300)
      return () => {
        clearTimeout(timeOut)
      }
    }
  }, [isCreateClient, visible])

  const filteredContacts = clientSelected
    ? contactList?.data?.filter(
        (contact: any) =>
          contact.clients &&
          contact.clients.some((client: any) => client.uuid === clientSelected)
      )
    : contactList?.data

  const sortedContacts = [
    ...(filteredContacts || []),
    ...(contactList?.data?.filter(
      (contact: any) => !filteredContacts?.includes(contact)
    ) || [])
  ]

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const onCreate = (values: any) => {
    setIsLoading(true)
    const dataSend: any = {
      fullname: clearSpaceString(values.fullname),
      project_status: status || 1
    }

    if (values.shortname) {
      dataSend.shortname = clearSpaceString(values.shortname)
    }

    if (clientSelected) {
      dataSend.client = { uuid: clientSelected }
    }

    if (values.oldContact) {
      dataSend.contact = { uuid: values.oldContact }
    }

    if (values.newClientName) {
      dataSend.client = {
        fullname: clearSpaceString(values.newClientName),
        website: values.newClientWeb
      }
      if (values.newClientCode) {
        dataSend.client.code = values.newClientCode
      }
    }

    if (values.newContactName) {
      dataSend.contact = {
        fullname: clearSpaceString(values.newContactName),
        email: values.newContactMail
      }
    }
    mutateCreateLead(dataSend, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['GetLeadList'] })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The lead has been created successfully!'
        })
        setIsLoading(false)
        onCloseModal()
        form.resetFields()
        setClientSelected(null)
        setStatus(1)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        setIsLoading(false)
      }
    })
  }

  return (
    <>
      <CrmModal
        open={visible}
        title={
          <div className='modal-title'>
            <div className='btn-title'></div>
            <div className='title'>{title}</div>
            <div className='btn-title close-modal' onClick={onCloseModal}>
              <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
            </div>
          </div>
        }
        closeIcon={<></>}
        okText='Create'
        cancelText='Cancel'
        onOk={handleCreate}
        onCancel={onCloseModal}
        footer={[
          <StyledButton
            key='cancel'
            onClick={() => {
              form.resetFields()
              onCloseModal()
            }}
          >
            Cancel
          </StyledButton>,
          <StyledButton
            onClick={handleCreate}
            loading={isLoading}
            type='primary'
            style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
          >
            {isCreate ? 'Create' : 'Save'}
          </StyledButton>
        ]}
      >
        <StyledForm
          form={form}
          layout='vertical'
          requiredMark={false}
          onFinish={handleCreate}
        >
          <Form.Item
            label={
              <>
                Lead name&nbsp; <span style={{ color: 'red' }}> (*)</span>
              </>
            }
            name='fullname'
            rules={[
              {
                required: true,
                message: 'This field is required!'
              },
              maxLengthRule(100),
              ValidateDuplicateFullName
            ]}
          >
            <StyledInput
              ref={fullNameInputRef}
              autoFocus
              placeholder='Fill lead name'
              // onChange={() => handleInputBlur('fullname')}
            />
          </Form.Item>
          {/* {duplicateInfo.isDuplicate && (
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
          )} */}

          <Form.Item
            label={
              <>
                Status &nbsp; <span style={{ color: 'red' }}> (*)</span>
              </>
            }
            name='project_status'
          >
            <StyledSelect
              placeholder='Select lead status'
              onChange={(value: any) => {
                setStatus(value)
                setIsProjectReceived(value === 5)
              }}
              value={status}
              defaultValue={1}
            >
              {leadStatus?.map((item: any) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </StyledSelect>
          </Form.Item>
          {isProjectReceived && (
            <Text
              type='secondary'
              style={{ fontSize: '12px', color: '#FC7634' }}
            >
              If you select this status, the project will be moved to the PIMS
              Page. <br />
              You can not change the status again.
            </Text>
          )}

          <Form.Item
            className='lead-label'
            label={
              !isCreateClient && (
                <div className='lead-label--click-here'>
                  Client
                  <Text type='secondary' style={{ fontSize: '12px' }}>
                    Create new client, please{' '}
                    <Link onClick={() => setIsCreateClient(true)}>
                      click here
                    </Link>
                  </Text>
                </div>
              )
            }
            name='oldClient'
          >
            {isCreateClient ? (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <>
                          Client name&nbsp;
                          <span style={{ color: 'red' }}> (*)</span>
                        </>
                      }
                      name='newClientName'
                      rules={[
                        {
                          required: true,
                          message: 'This field is required!'
                        },
                        maxLengthRule(100)
                      ]}
                    >
                      <StyledInput
                        placeholder='Fill client name'
                        ref={clientNameInputRef}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {isProjectReceived ? (
                      <Form.Item
                        label={
                          <>
                            Client code &nbsp;
                            <span style={{ color: 'red' }}> (*)</span>
                          </>
                        }
                        name='newClientCode'
                        rules={[
                          {
                            required: true,
                            message: 'This field is required!'
                          },
                          maxLengthRule(100)
                        ]}
                      >
                        <StyledInput placeholder='Fill client code' />
                      </Form.Item>
                    ) : (
                      <Form.Item
                        label='Client code'
                        name='newClientCode'
                        rules={[maxLengthRule(100)]}
                      >
                        <StyledInput placeholder='Fill client code' />
                      </Form.Item>
                    )}
                  </Col>
                </Row>
                <Form.Item
                  label={<>Website &nbsp; </>}
                  name='newClientWeb'
                  rules={[validationWebsite, maxLengthRule(255)]}
                >
                  <StyledInput placeholder='Fill client website' />
                </Form.Item>

                <Text type='secondary' style={{ fontSize: '12px' }}>
                  Close creating new client, please{' '}
                  <Link onClick={() => setIsCreateClient(false)}>
                    click here
                  </Link>
                </Text>
              </>
            ) : (
              <>
                <StyledSelect
                  placeholder='Select client'
                  onChange={(value: string) => {
                    setClientSelected(value)
                  }}
                  value={clientSelected}
                  showSearch
                  disabled={isCreateClient}
                  allowClear
                  filterOption={customFilterOption}
                >
                  {clientList?.data?.map((item: any) => {
                    return (
                      <Select.Option key={item.uuid} value={item.uuid}>
                        {item.code && `[${item.code}] - `}
                        {item.shortname || item.fullname}
                      </Select.Option>
                    )
                  })}
                </StyledSelect>
              </>
            )}
          </Form.Item>

          <Form.Item
            className='lead-label'
            label={
              !isCreateContact && (
                <div className='lead-label--click-here'>
                  Contact
                  <Text type='secondary' style={{ fontSize: '12px' }}>
                    Create new contact, please{' '}
                    <Link onClick={() => setIsCreateContact(true)}>
                      click here
                    </Link>
                  </Text>
                </div>
              )
            }
            name='oldContact'
          >
            {isCreateContact ? (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label={
                        <>
                          Contact name&nbsp;
                          <span style={{ color: 'red' }}> (*)</span>
                        </>
                      }
                      name='newContactName'
                      rules={[
                        {
                          required: true,
                          message: 'This field is required!'
                        },
                        maxLengthRule(100)
                      ]}
                    >
                      <StyledInput
                        placeholder='Fill contact name'
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
                      name='newContactMail'
                      rules={[
                        {
                          required: true,
                          message: 'This field is required!'
                        },
                        maxLengthRule(255),
                        validateEmail
                      ]}
                    >
                      <StyledInput placeholder='Fill contact mail' />
                    </Form.Item>
                  </Col>
                </Row>
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  Close creating new contact, please{' '}
                  <Link onClick={() => setIsCreateContact(false)}>
                    click here
                  </Link>
                </Text>
              </>
            ) : (
              <>
                <StyledSelect
                  placeholder='Select contact'
                  onChange={(value: any) => {
                    form.setFieldValue('oldContact', value)
                  }}
                  disabled={isCreateContact}
                  showSearch
                  allowClear
                  filterOption={customFilterOption}
                >
                  {sortedContacts?.map((item: any) => (
                    <Select.Option key={item.uuid} value={item.uuid}>
                      {item.shortname || item.fullname}
                    </Select.Option>
                  ))}
                </StyledSelect>
              </>
            )}
          </Form.Item>
        </StyledForm>
      </CrmModal>

      {/* {isEdit && (
        <LeadFormEdit
          visible={isEdit}
          title={'Edit Lead'}
          onCloseModal={() => {
            setIsEdit(false)
            onCloseModal()
          }}
          isCreate={false}
          oldData={oldData}
          uuid={duplicateInfo.duplicateId}
        />
      )} */}
    </>
  )
}

export default LeadForm
