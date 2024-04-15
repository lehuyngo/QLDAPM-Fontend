// External dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Col, Form, Row, Select, message } from 'antd'
import { FormInstance } from 'antd/lib/form'
import React, { useEffect, useState } from 'react'
import { FiX, FiXCircle } from 'react-icons/fi'

// Internal dependencies
import { useCreateMeeting } from '../../../api/reactQuery/Meeting'
import { DatePickerLocale } from '../../../component/datePicker'
import { TimePickerLocale } from '../../../component/datePicker/TimePicker'
import { NotificationCustom } from '../../../component/notification/Notification'
import { useLeadDetailContext } from '../../../hooks/useLeadDetailContext'
import { IContact } from '../../../interfaces/IContact'
import { IMeeting } from '../../../interfaces/IMeeting'
import { IUser } from '../../../interfaces/IUser'
import {
  customFilterOption,
  getNowTimeNearest
} from '../../../utils/FunctionsShare'
import { toTimestampFromDateAndMinute } from '../../../utils/convertTimestamp'
import { maxLengthRule, validationWebsite } from '../../../utils/validate'

// StyleSheets
import {
  StyledButton,
  StyledForm,
  StyledInput,
  StyledSelect
} from '../../../component/componentOfForm/ComponentOfForm.style'
import { CrmModal } from '../../../theme/crm.style'

// Assets

const MeetingDateForm: React.FC<MeetingDateFormProps> = ({
  title,
  visible,
  onCloseModal,
  userList,
  contactList,
  currentUser,
  existMeetingDateList
}) => {
  // State logic
  const [isCreating, setCreating] = useState<boolean>(false)

  // Ref

  // Variables

  // Custom hooks
  const { selectedLead, handleChangeSelectMeeting } = useLeadDetailContext()
  const [form] = Form.useForm<FormInstance>()
  const queryClient = useQueryClient()
  const { mutate: mutateCreateMeeting } = useMutation({
    mutationFn: useCreateMeeting
  })

  // Higher-order functions

  // Component life-cycle methods (useEffect)
  useEffect(() => {
    if (visible) {
      let now = getNowTimeNearest()
      form.setFieldValue('meeting_date', now)
      form.setFieldValue('meeting_time', now)
    }
  }, [visible, form])

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
    const { meeting_date, meeting_time, link, location, attendees, contacts } =
      values

    let data: any = {}
    if (meeting_date && meeting_time) {
      let startTime = toTimestampFromDateAndMinute(meeting_date, meeting_time)
      let matchedTimeMeetingDate = existMeetingDateList?.find(
        (item: IMeeting) =>
          item?.start_time === startTime &&
          item?.creator?.uuid === currentUser?.uuid
      )
      if (matchedTimeMeetingDate?.uuid) {
        message.error('This meeting date has already existed!')
        return
      } else {
        data['start_time'] = startTime
      }
    }

    if (link) {
      data['link'] = link
    }

    if (location) {
      data['location'] = location
    }

    if (attendees && attendees.length > 0) {
      data['user_uuids'] = attendees
    }

    if (contacts && contacts.length > 0) {
      data['contact_uuids'] = contacts
    }

    setCreating(true)
    const dataSend: any = {
      projectID: selectedLead?.uuid,
      bodyRequest: data
    }

    mutateCreateMeeting(dataSend, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['GetMeetingList', selectedLead?.uuid]
        })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The meeting has been created successfully!'
        })
        handleChangeSelectMeeting(null)
        setCreating(false)
        onCloseModal()
        form.resetFields()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        setCreating(false)
      }
    })
  }

  // Component render
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
            key='create'
            type='primary'
            loading={isCreating}
            style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
          >
            Create
          </StyledButton>
        ]}
      >
        <StyledForm
          form={form}
          layout='vertical'
          requiredMark={false}
          onFinish={handleCreate}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <>
                    Meeting Date &nbsp;{' '}
                    <span style={{ color: 'red' }}> (*)</span>
                  </>
                }
                name='meeting_date'
                rules={[
                  {
                    required: true,
                    message: 'This field is required!'
                  }
                ]}
              >
                <DatePickerLocale />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <>
                    Meeting Time &nbsp;{' '}
                    <span style={{ color: 'red' }}> (*)</span>
                  </>
                }
                name='meeting_time'
                rules={[
                  {
                    required: true,
                    message: 'This field is required!'
                  }
                ]}
              >
                <TimePickerLocale
                  changeOnBlur={true}
                  minuteStep={5}
                  format={'HH:mm'}
                  className='meeting-timer-picker'
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label='Link'
            name='link'
            rules={[maxLengthRule(255), validationWebsite]}
          >
            <StyledInput placeholder='Fill your info' />
          </Form.Item>

          <Form.Item
            label='Location'
            name='location'
            rules={[maxLengthRule(255)]}
          >
            <StyledInput placeholder='Fill your info' />
          </Form.Item>

          <Form.Item label='Attendees' name='attendees'>
            <StyledSelect
              maxTagCount='responsive'
              maxTagTextLength={20}
              mode='multiple'
              style={{ width: '100%' }}
              placeholder='Select attendees'
              allowClear
              filterOption={customFilterOption}
              tagRender={(props: any) => {
                return (
                  <span className='ant-select-selection-item'>
                    <span className='ant-select-selection-item-content'>
                      {props?.label[0] && props.label[0]}
                      {props?.label[1] && props.label[1]}
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
              {userList?.map((item: any) => (
                <Select.Option key={item.uuid} value={`${item.uuid}`}>
                  {item.code && `${item.code} - `}
                  {item.displayname}
                </Select.Option>
              ))}
            </StyledSelect>
          </Form.Item>
          <Form.Item label='Contacts' name='contacts'>
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
                      {props?.label[0] && props.label[0]}
                      {props?.label[1] && props.label[1]}
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
              {contactList?.map((item: any) => (
                <Select.Option key={item.uuid} value={`${item.uuid}`}>
                  {item.shortname || item.fullname}
                  {item.email && ` - ${item.email}`}
                </Select.Option>
              ))}
            </StyledSelect>
          </Form.Item>
        </StyledForm>
      </CrmModal>
    </>
  )
}

// Props types declaration
interface MeetingDateFormProps {
  visible: boolean
  title: string
  onCloseModal: () => void
  userList: IUser[]
  contactList: IContact[]
  currentUser: IUser
  existMeetingDateList: IMeeting[]
}

export default MeetingDateForm
