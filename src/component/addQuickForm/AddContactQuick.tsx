import { Form, Select, Typography } from 'antd'
import { FormInstance } from 'antd/lib/form'
import React, { useEffect, useRef, useState } from 'react'

import {
  MiniCrmModal,
  StyledButton,
  StyledForm,
  StyledInput,
  StyledSelect
} from '../componentOfForm/ComponentOfForm.style'
import { FiX, FiXCircle } from 'react-icons/fi'
import { BaseSelectRef } from 'rc-select/lib/BaseSelect'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useAddContactsToClient,
  useCreateQuickContact
} from '../../api/reactQuery/QuickForm'
import { NotificationCustom } from '../notification/Notification'
import {
  clearSpaceString,
  customFilterOption
} from '../../utils/FunctionsShare'
import { maxLengthRule } from '../../utils/validate'

interface AddFormProps {
  clientID: string | null
  visible: boolean
  setVisible: (visible: boolean) => void
  data?: any
  dataExisted?: any
}

const { Text, Link } = Typography

const AddContactQuick: React.FC<AddFormProps> = ({
  visible,
  setVisible,
  clientID,
  data,
  dataExisted
}) => {
  const [isCreateContact, setIsCreateContact] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [form] = Form.useForm<FormInstance>()
  const selectRef = useRef<BaseSelectRef>(null)
  const queryClient = useQueryClient()

  const { mutate: mutateAddQuickContact } = useMutation({
    mutationFn: useCreateQuickContact
  })
  const { mutate: mutateAddContacts } = useMutation({
    mutationFn: useAddContactsToClient
  })

  //quick contact
  const onCreateQuickContact = (values: any) => {
    const data = { ...values, fullname: clearSpaceString(values.fullname) }

    setIsLoading(true)
    const dataForCreate = {
      contactInfo: { new_contact: data },
      clientUuid: clientID
    }
    mutateAddQuickContact(dataForCreate, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['GetContactsForClient']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientContactActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The contact has been created successfully!'
        })
        setIsLoading(false)
        setVisible(false)
        form.resetFields()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        setIsLoading(false)
        console.error('Error posting data')
      }
    })
  }

  const onAddContacts = (data: any) => {
    setIsLoading(true)
    const dataForAdd = { clientUuid: clientID, contactsList: data }
    mutateAddContacts(dataForAdd, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['GetContactsForClient']
        })
        NotificationCustom({
          type: 'success',
          message: 'Add contacts success',
          description: 'The contact has been created successfully!'
        })
        setIsLoading(false)
        setVisible(false)
        form.resetFields()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Add contacts fail',
          description: error.message
        })
        setIsLoading(false)
        console.error('Error posting data')
      }
    })
  }

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        isCreateContact ? onCreateQuickContact(values) : onAddContacts(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  useEffect(() => {
    if (visible) {
      const timeOut = setTimeout(() => {
        selectRef.current?.focus()
      }, 400)

      return () => {
        clearTimeout(timeOut)
      }
    }
  }, [visible])

  const filteredData = data?.filter(
    (item: any) =>
      !dataExisted?.some((existingItem: any) => existingItem.uuid === item.uuid)
  )

  return (
    <MiniCrmModal
      open={visible}
      title={
        <div className='modal-title'>
          <div className='btn-title'></div>
          <div className='title'>Add Contact</div>
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
      okText='Add'
      closeIcon={<></>}
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
          onClick={handleCreate}
          loading={isLoading}
          type='primary'
          style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
        >
          Add
        </StyledButton>
      ]}
    >
      <StyledForm form={form} layout='vertical' requiredMark={false}>
        {isCreateContact ? (
          <>
            <Form.Item
              label={
                <>
                  Name&nbsp; <span style={{ color: 'red' }}> (*)</span>
                </>
              }
              name='fullname'
              rules={[
                {
                  required: true,
                  message: 'This field is required!'
                },
                maxLengthRule(255)
              ]}
            >
              <StyledInput placeholder='Fill contact name' />
            </Form.Item>
            <Form.Item
              label={
                <>
                  Email&nbsp; <span style={{ color: 'red' }}> (*)</span>
                </>
              }
              name='email'
              rules={[
                {
                  required: true,
                  message: 'This field is required!',
                  type: 'email'
                },
                maxLengthRule(255)
              ]}
            >
              <StyledInput placeholder='Fill mail info' />
            </Form.Item>
            <Text type='secondary' style={{ fontSize: '12px' }}>
              Select contact, please{' '}
              <Link onClick={() => setIsCreateContact(false)}>click here</Link>
            </Text>
          </>
        ) : (
          <>
            <Form.Item
              className='form-label'
              label={
                <div className='form-label--click-here'>
                  Contact name
                  <Text type='secondary' style={{ fontSize: '12px' }}>
                    Create new client, please{' '}
                    <Link onClick={() => setIsCreateContact(true)}>
                      click here
                    </Link>
                  </Text>
                </div>
              }
              name='uuids'
              style={{ marginBottom: '5px' }}
            >
              <StyledSelect
                disabled={isCreateContact}
                maxTagCount='responsive'
                maxTagTextLength={20}
                mode='multiple'
                style={{ width: '100%' }}
                placeholder='Select contacts'
                allowClear
                filterOption={customFilterOption}
                ref={selectRef}
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
                {filteredData?.map((item: any) => (
                  <Select.Option key={item.uuid} value={item.uuid}>
                    {item.shortname || item.fullname}
                    {item.email && ` - ${item.email}`}
                  </Select.Option>
                ))}
              </StyledSelect>
            </Form.Item>
          </>
        )}
      </StyledForm>
    </MiniCrmModal>
  )
}

export default AddContactQuick
