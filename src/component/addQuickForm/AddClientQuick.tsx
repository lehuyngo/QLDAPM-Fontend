import { Form, InputRef, Select, Typography } from 'antd'
import { FormInstance } from 'antd/lib/form'

import React, { useEffect, useRef, useState } from 'react'
import {
  MiniCrmModal,
  StyledButton,
  StyledForm,
  StyledInput,
  StyledSelect
} from '../componentOfForm/ComponentOfForm.style'
import { FiXCircle } from 'react-icons/fi'
import { BaseSelectRef } from 'rc-select/lib/BaseSelect'
import { NotificationCustom } from '../notification/Notification'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useAddClientsToContact,
  useCreateQuickClient
} from '../../api/reactQuery/QuickForm'
import { maxLengthRule, validationWebsite } from '../../utils/validate'
import { clearSpaceString } from '../../utils/FunctionsShare'

interface AddFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  contactID: string | null
  data?: any
  dataExisted?: any
}

const { Text, Link } = Typography

const AddClientQuick: React.FC<AddFormProps> = ({
  visible,
  setVisible,
  contactID,
  data,
  dataExisted
}) => {
  const [isCreateClient, setIsCreateClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm<FormInstance>()
  const selectRef = useRef<BaseSelectRef>(null)

  const inputRef = useRef<InputRef>()
  const queryClient = useQueryClient()

  const { mutate: mutateAddQuickClient } = useMutation({
    mutationFn: useCreateQuickClient
  })
  const { mutate: mutateAddClients } = useMutation({
    mutationFn: useAddClientsToContact
  })

  const onChangeLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        isCreateClient
          ? onCreateQuickClient(values, onChangeLoading)
          : onAddClients(values, onChangeLoading)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  //quick client
  const onCreateQuickClient = (values: any, onChangeLoading: any) => {
    const data = { ...values, fullname: clearSpaceString(values.fullname) }

    onChangeLoading(true)
    const dataForCreate = {
      clientInfo: { new_client: data },
      contactUuid: contactID
    }
    mutateAddQuickClient(dataForCreate, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetClientsForContact'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactClientActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The client has been created successfully!'
        })
        onChangeLoading(false)
        setVisible(false)
        form.resetFields()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }

  const onAddClients = (data: any, onChangeLoading: any) => {
    onChangeLoading(true)
    const dataForAdd = { contactUuid: contactID, clientsList: data }
    mutateAddClients(dataForAdd, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetClientsForContact'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactClientActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Add contacts success',
          description: 'The client has been created successfully!'
        })
        onChangeLoading(false)
        setVisible(false)
        form.resetFields()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Add client fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }

  useEffect(() => {
    if (visible) {
      const timeOut = setTimeout(() => {
        inputRef.current?.focus()
      }, 400)

      return () => {
        clearTimeout(timeOut)
      }
    }
  }, [visible])

  useEffect(() => {
    if (visible && selectRef?.current) {
      const timeOut = setTimeout(() => {
        selectRef.current?.focus()
      }, 300)
      return () => {
        clearTimeout(timeOut)
      }
    }
  }, [visible])

  const filterOption = (input: any, option: any) => {
    // Customize the search behavior based on both fullname and shortname
    const contactLabel = option.children?.toLowerCase()
    return contactLabel.includes(input.toLowerCase())
  }

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
          <div className='title'>Add Client</div>
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
      footer={[
        <StyledButton key='cancel' onClick={() => setVisible(false)}>
          Cancel
        </StyledButton>,
        <StyledButton
          onClick={() => {
            handleCreate()
          }}
          type='primary'
          loading={isLoading}
          style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
        >
          Add
        </StyledButton>
      ]}
    >
      <StyledForm form={form} layout='vertical' requiredMark={false}>
        {isCreateClient ? (
          <>
            <Form.Item
              label={
                <>
                  New client name&nbsp;
                  <span style={{ color: 'red' }}> (*)</span>
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
              <StyledInput placeholder='Fill client name' />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: '0px' }}
              label={<>Website&nbsp;</>}
              name='website'
              rules={[validationWebsite, maxLengthRule(255)]}
            >
              <StyledInput placeholder='Fill client website' />
            </Form.Item>
            <Text type='secondary' style={{ fontSize: '12px' }}>
              Select client, please{' '}
              <Link onClick={() => setIsCreateClient(false)}>click here</Link>
            </Text>
          </>
        ) : (
          <>
            <Form.Item
              className='form-label'
              label={
                <div className='form-label--click-here'>
                  Client Name
                  <Text type='secondary' style={{ fontSize: '12px' }}>
                    Create new client, please{' '}
                    <Link onClick={() => setIsCreateClient(true)}>
                      click here
                    </Link>
                  </Text>
                </div>
              }
              name='uuids'
              style={{ marginBottom: '5px' }}
              rules={[
                {
                  required: true,
                  message: 'This field is required!'
                }
              ]}
            >
              <StyledSelect
                disabled={isCreateClient}
                maxTagCount='responsive'
                maxTagTextLength={20}
                mode='multiple'
                style={{ width: '100%' }}
                placeholder='Select contacts'
                allowClear
                filterOption={filterOption}
                ref={selectRef}
              >
                {filteredData?.map((item: any) => (
                  <Select.Option key={item.uuid} value={item.uuid}>
                    {item.shortname || item.fullname}
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
AddClientQuick.defaultProps = {
  data: undefined
}
export default AddClientQuick
