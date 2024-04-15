import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, Select, Typography } from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { FiXCircle } from 'react-icons/fi'

import { useGetPointActivity } from '../../api/reactQuery/Point'
import { useCreateActivity } from '../../api/reactQuery/ThreadActive'
import { customFilterOption } from '../../utils/FunctionsShare'
import { toTimestamp } from '../../utils/convertTimestamp'
import {
  maxLengthRule,
  validateDuplicate,
  validatePoint
} from '../../utils/validate'
import {
  MiniCrmModal,
  StyledButton,
  StyledForm,
  StyledInput,
  StyledSelect,
  StyledTextArea
} from '../componentOfForm/ComponentOfForm.style'
import { DatePickerLocale } from '../datePicker'
import { NotificationCustom } from '../notification/Notification'

interface AddActiveFormProps {
  visible: boolean
  onClose: () => void
  contactId: string | null
  traceUuid?: string | null
}

const { Text, Link } = Typography

const AddActive: React.FC<AddActiveFormProps> = ({
  visible,
  onClose,
  contactId,
  traceUuid
}) => {
  const [isCreateNewActive, setIsCreateNewActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [form] = Form.useForm<any>()
  const queryClient = useQueryClient()

  const { data, isLoading: getPointLoading } = useGetPointActivity()

  const { mutate: mutateCreateActive } = useMutation({
    mutationFn: useCreateActivity
  })

  const handleAddActive = () => {
    form
      .validateFields()
      .then((values) => {
        isCreateNewActive ? onCreateNewActive(values) : onAddActive(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const onAddActive = (values: any) => {
    setIsLoading(true)
    const { note, selectUuid, startedAt } = values || {}

    const dataSend: any = {
      point_config: { uuid: selectUuid },
      started_at: toTimestamp(startedAt)
    }

    if (note) {
      dataSend.note = note
    }

    if (traceUuid) {
      dataSend.trace_uuid = traceUuid
    }

    mutateCreateActive(
      { data: dataSend, contactId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['GetThreadActivity'] })
          NotificationCustom({
            type: 'success',
            message: 'Create success',
            description: 'The lead has been created successfully!'
          })
          setIsLoading(false)
          onClose()
          form.resetFields()
        },
        onError: (error) => {
          NotificationCustom({
            type: 'error',
            message: 'Create fail',
            description: error.message
          })
          setIsLoading(false)
        }
      }
    )
  }

  const onCreateNewActive = (values: any) => {
    setIsLoading(true)
    const { note, name, point, startedAt } = values || {}

    const dataSend: any = {
      point_config: { name: name, point: +point?.toString() },
      started_at: toTimestamp(startedAt)
    }

    if (note) {
      dataSend.note = note
    }

    if (traceUuid) {
      dataSend.trace_uuid = traceUuid
    }

    mutateCreateActive(
      { data: dataSend, contactId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['GetThreadActivity'] })
          NotificationCustom({
            type: 'success',
            message: 'Create success',
            description: 'The lead has been created successfully!'
          })
          setIsLoading(false)
          onClose()
          form.resetFields()
        },
        onError: (error) => {
          NotificationCustom({
            type: 'error',
            message: 'Create fail',
            description: error.message
          })
          setIsLoading(false)
        }
      }
    )
  }

  const handleInputBlur = (e: any) => {
    const extractedNumbers = e.target.value.match(/\d+/)

    form.setFieldValue('point', extractedNumbers)
  }

  const ValidateDuplicateName = validateDuplicate({
    data: data?.data,
    key: 'name'
  })

  return (
    <MiniCrmModal
      open={visible}
      title={
        <div className='modal-title'>
          <div className='title'>Create Activity</div>
          <div className='btn-title close-modal' onClick={onClose}>
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      onOk={handleAddActive}
      onCancel={onClose}
      footer={[
        <StyledButton key='cancel' onClick={onClose}>
          Cancel
        </StyledButton>,
        <StyledButton
          onClick={handleAddActive}
          // loading={isLoading}
          type='primary'
          style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
        >
          Create
        </StyledButton>
      ]}
    >
      <StyledForm form={form} layout='vertical' requiredMark={false}>
        {isCreateNewActive ? (
          <>
            <Form.Item
              label={
                <>
                  Activity name &nbsp;
                  <span style={{ color: 'red' }}>(*)</span>
                </>
              }
              name='name'
              rules={[
                {
                  required: true,
                  message: 'This field is required!'
                },
                ValidateDuplicateName,
                maxLengthRule(100)
              ]}
            >
              <StyledInput placeholder='Fill activity title' />
            </Form.Item>
            <Form.Item
              label={
                <>
                  Point&nbsp; <span style={{ color: 'red' }}> (*)</span>
                </>
              }
              name='point'
              rules={[
                {
                  required: true,
                  message: 'This field is required!'
                },
                validatePoint
              ]}
            >
              <StyledInput
                placeholder='Fill your info'
                onBlur={handleInputBlur}
                maxLength={20}
              />
            </Form.Item>

            <Text type='secondary' style={{ fontSize: '12px' }}>
              Close creating new activity, please{' '}
              <Link onClick={() => setIsCreateNewActive(false)}>
                click here
              </Link>
            </Text>
          </>
        ) : (
          <Form.Item
            className='point-label'
            label={
              <div className='point-label--click-here'>
                <span>
                  Activity name &nbsp;<span style={{ color: 'red' }}>(*)</span>
                </span>
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  Create new activity, please{' '}
                  <Link onClick={() => setIsCreateNewActive(true)}>
                    click here
                  </Link>
                </Text>
              </div>
            }
            name='selectUuid'
            rules={[
              {
                required: true,
                message: 'This field is required!'
              }
            ]}
          >
            <StyledSelect
              placeholder='Select activity'
              disabled={isCreateNewActive}
              showSearch
              allowClear
              filterOption={customFilterOption}
              loading={getPointLoading}
            >
              {data?.data?.map((item: any) => (
                <Select.Option key={item.uuid} value={item.uuid}>
                  {item.name}
                </Select.Option>
              ))}
            </StyledSelect>
          </Form.Item>
        )}

        <Form.Item
          label={
            <>
              Date&nbsp; <span style={{ color: 'red' }}> (*)</span>
            </>
          }
          name='startedAt'
        >
          <DatePickerLocale allowClear={false} defaultValue={dayjs} />
        </Form.Item>

        <Form.Item label='Note' name='note' rules={[maxLengthRule(255)]}>
          <StyledTextArea placeholder='Fill note' rows={4} />
        </Form.Item>
      </StyledForm>
    </MiniCrmModal>
  )
}

export default AddActive
