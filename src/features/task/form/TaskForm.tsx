// External dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Col, Form, Row, Select, Upload } from 'antd'
import { FormInstance } from 'antd/lib/form'
import 'dayjs/locale/ja'
import { useEffect, useRef, useState } from 'react'
import { FiUpload, FiXCircle } from 'react-icons/fi'
import styled from 'styled-components'

// Internal dependencies
import { useGetLeadList } from '../../../api/reactQuery/Lead'
import { useCreateTask } from '../../../api/reactQuery/Task'
import { useGetUserList } from '../../../api/reactQuery/user'
import { DatePickerLocale } from '../../../component/datePicker'
import { NotificationCustom } from '../../../component/notification/Notification'
import { ILead } from '../../../interfaces/ILead'
import { useCheckUploadFile } from '../../../utils/BeforeUploadFile'
import useAutoFocus from '../../../utils/autoFocus'
import { toTimestamp } from '../../../utils/convertTimestamp'
import { TASK_LABEL, TASK_PRIORITY, TASK_STATUS } from '../commom'

// StyleSheets
import 'react-quill/dist/quill.snow.css'
import {
  StyledButton,
  StyledForm,
  StyledInput,
  StyledSelect
} from '../../../component/componentOfForm/ComponentOfForm.style'
import CustomReactQuill from '../../../component/customReactQuill/CustomReactQuill.style'
import { CrmModal } from '../../../theme/crm.style'
import { maxLengthRule } from '../../../utils/validate'

// Assets

const TaskForm: React.FC<FormProps> = ({
  title,
  visible,
  setVisible,
  selectedLead,
  titleTask,
  defaulStatus
}) => {
  // State logic
  const [creating, setCreating] = useState<boolean>(false)
  const [timeType, setTimeType] = useState<string>('hour')
  const [files, setFiles] = useState<any[]>([])
  const [status, setStatus] = useState<number>(defaulStatus ? defaulStatus : 1)
  // Ref

  // Variables
  const { Option } = Select
  const [form] = Form.useForm<FormInstance>()
  const queryClient = useQueryClient()

  // Custom hooks
  const { beforeUploadFile, allowedFileExtensions } = useCheckUploadFile({
    typeAccept: ['image'],
    maxFiles: 9
  })

  const titleRef = useRef<any>(null)
  useAutoFocus(titleRef, visible)

  // Higher-order functions
  const { data: leadList, isLoading: leadLoading } = useGetLeadList()
  const { data: userList } = useGetUserList()
  const { mutate: mutateCreateTask } = useMutation({
    mutationFn: useCreateTask
  })

  // Component life-cycle methods (useEffect)
  useEffect(() => {
    if (!leadLoading && selectedLead && selectedLead.uuid) {
      form.setFieldValue('lead', selectedLead.uuid)
    }
  }, [form, selectedLead, leadLoading])

  useEffect(() => {
    if (titleTask) {
      form.setFieldValue('title', titleTask)
    }
  }, [form, titleTask])

  const handleSelectChange = (value: string) => {
    setTimeType(value)
  }
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
    const {
      priority,
      title,

      lead,
      description,
      deadline,
      estimated_hours,
      label,
      assignees
    } = values

    const formData = new FormData()

    formData.append('title', title)
    formData.append('status', status.toString())
    formData.append('project_uuid', lead)

    if (priority) {
      formData.append('priority', priority)
    }

    if (description) {
      formData.append('description', description)
    }

    if (label) {
      formData.append('label', label)
    }

    if (deadline) {
      formData.append('deadline', toTimestamp(deadline)?.toString())
    }

    if (estimated_hours) {
      timeType === 'hour'
        ? formData.append('estimated_hours', Number(estimated_hours).toString())
        : formData.append('estimated_hours', (+estimated_hours * 24).toString())
    }

    if (assignees) {
      formData.append('assignee_uuids', assignees)
    }

    if (files.length > 0) {
      files?.forEach((file: any, idx: number) => {
        formData.append(`attach_file_${idx + 1}`, file.originFileObj)
      })
    }

    setCreating(true)
    mutateCreateTask(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['GetTaskList'] })
        queryClient.invalidateQueries({ queryKey: ['GetTaskListOfLead'] })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The task has been created successfully!'
        })
        setCreating(false)
        setVisible(false)
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

  const customFilterOption = (inputValue: string, option: any) => {
    return String(option.children)
      .toLowerCase()
      .includes(inputValue.toLowerCase())
  }

  const handleInputBlur = (e: any) => {
    const extractedNumbers = e.target.value.match(/\d+/)
    form.setFieldValue('estimated_hours', extractedNumbers)
  }
  // Component render
  return (
    <CrmModal
      open={visible}
      title={
        <div className='modal-title'>
          <div className='title'>{title}</div>
          <div
            className='btn-title close-modal'
            onClick={() => setVisible(false)}
          >
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      onOk={handleCreate}
      onCancel={() => {
        setVisible(false)
      }}
      footer={[
        <StyledButton
          key='cancel'
          onClick={() => setVisible(false)}
          disabled={creating}
        >
          Cancel
        </StyledButton>,
        <StyledButton
          loading={creating}
          onClick={handleCreate}
          type='primary'
          style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
        >
          Create
        </StyledButton>
      ]}
    >
      <StyledForm
        form={form}
        layout='vertical'
        onFinish={handleCreate}
        requiredMark={false}
      >
        <Form.Item
          label={
            <>
              Title&nbsp; <span style={{ color: 'red' }}> (*)</span>
            </>
          }
          name='title'
          rules={[
            {
              required: true,
              message: 'This field is required!'
            },
            maxLengthRule(100)
          ]}
        >
          <StyledInput ref={titleRef} placeholder='Fill task title' autoFocus />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Status' name='status'>
              <StyledSelect
                defaultValue={defaulStatus ? defaulStatus : 1}
                onChange={(value: number) => setStatus(value)}
                value={status}
              >
                {TASK_STATUS.map((item, index: number) => (
                  <Select.Option key={index} value={index + 1}>
                    {item}
                  </Select.Option>
                ))}
              </StyledSelect>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label='Priority' name='priority'>
              <StyledSelect listHeight={250} placeholder='Priority'>
                {TASK_PRIORITY.map((item, index: number) => (
                  <Select.Option key={index} value={index + 1}>
                    {item}
                  </Select.Option>
                ))}
              </StyledSelect>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label='Assignee' name='assignees'>
          <StyledSelect
            listHeight={250}
            listItemHeight={30}
            mode='multiple'
            maxTagCount={'responsive'}
            placeholder='Assignee'
            filterOption={customFilterOption}
            showSearch
          >
            {userList?.data?.map((item: any) => (
              <Select.Option key={item.uuid} value={item.uuid}>
                {item.displayname}
                {item.email && ` - ${item.email}`}
              </Select.Option>
            ))}
          </StyledSelect>
        </Form.Item>

        <Form.Item
          label={
            <>
              Lead&nbsp; <span style={{ color: 'red' }}> (*)</span>
            </>
          }
          name='lead'
          rules={[
            {
              required: true,
              message: 'This field is required!'
            }
          ]}
        >
          <StyledSelect
            placeholder='Select Lead'
            allowClear
            disabled={selectedLead?.uuid ? true : false}
            loading={leadLoading}
          >
            {leadList?.data?.map((item: any) => (
              <Select.Option key={item.uuid} value={item.uuid}>
                {item.shortname || item.fullname}
              </Select.Option>
            ))}
          </StyledSelect>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={<>Deadline</>} name='deadline'>
              <DatePickerLocale className='form-create-task' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<>Estimated Time</>} name='estimated_hours'>
              <StyledInput
                type='string'
                placeholder='Fill estimated hours'
                onBlur={handleInputBlur}
                addonAfter={
                  <Select defaultValue='hour' onChange={handleSelectChange}>
                    <Option value='hour'>hour</Option>
                    <Option value='day'>day</Option>
                  </Select>
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<>Description</>}
          name='description'
          rules={[maxLengthRule(4000)]}
        >
          <CustomReactQuill
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
          />
        </Form.Item>

        <Form.Item name='attachFile'>
          <UploadStyle
            accept={allowedFileExtensions}
            multiple={true}
            name='task_attach_file'
            className='task_attach_file'
            listType='text'
            customRequest={() => {}}
            maxCount={9}
            beforeUpload={beforeUploadFile}
            fileList={files}
            onChange={(e) => {
              const validFiles = e.fileList.filter((file) => file.status)

              setFiles(validFiles)
            }}
          >
            <Button icon={<FiUpload />}>Attach file</Button>
          </UploadStyle>
        </Form.Item>

        <Form.Item label={<>Label</>} name='label'>
          <StyledSelect placeholder='Select label' allowClear>
            {TASK_LABEL.map((item, index: number) => (
              <Select.Option key={index} value={index + 1}>
                {item}
              </Select.Option>
            ))}
          </StyledSelect>
        </Form.Item>
      </StyledForm>
    </CrmModal>
  )
}

// Props type declaration

interface FormProps {
  title: String
  visible: boolean
  setVisible: (visible: boolean) => void
  selectedLead?: ILead | null
  titleTask?: string | null
  defaulStatus?: number
}

export default TaskForm

const UploadStyle = styled(Upload)`
  &.task_attach_file {
    .ant-upload-list-item-progress {
      padding-inline-start: 0px !important;
    }
    .ant-upload-icon {
      display: none;
    }
    .ant-upload-list-item-name {
      cursor: default;
      color: #333;
    }
  }
`
