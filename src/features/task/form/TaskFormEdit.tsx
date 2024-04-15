// External dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Col, Form, Row, Select, Spin, Upload } from 'antd'
import { FormInstance } from 'antd/lib/form'
import 'dayjs/locale/ja'
import { useEffect, useRef, useState } from 'react'
import { FiUpload, FiXCircle } from 'react-icons/fi'
import styled from 'styled-components'

// Internal dependencies
import { useGetLeadList } from '../../../api/reactQuery/Lead'
import {
  useGetTaskDetail,
  useTaskAssignee,
  useTaskDeleteAssignee,
  useTaskDeleteFile,
  useTaskEditFile,
  useUpdateTask
} from '../../../api/reactQuery/Task'
import { useGetUserList } from '../../../api/reactQuery/user'
import { DatePickerLocale } from '../../../component/datePicker'
import DeleteForm from '../../../component/deleteForm/DeleteForm'
import { NotificationCustom } from '../../../component/notification/Notification'
import { useCheckUploadFile } from '../../../utils/BeforeUploadFile'
import useAutoFocus from '../../../utils/autoFocus'
import { convertTimestamp, toTimestamp } from '../../../utils/convertTimestamp'
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

const TaskFormEdit: React.FC<FormProps> = ({
  title,
  visible,
  setVisible,
  taskId = null
}) => {
  // State logic
  const [creating, setCreating] = useState<boolean>(false)
  const [timeType, setTimeType] = useState<string>('hour')
  const [files, setFiles] = useState<any[]>([])
  const [showMDeleteFile, setShowMDeleteFile] = useState<boolean>(false)
  const [deleteFileLoading, setDeleteFileLoading] = useState<boolean>(false)
  const [fileId, setFileId] = useState<string | null>(null)

  // Ref
  const titleRef = useRef<any>(null)

  // Variables
  const { Option } = Select
  const [form] = Form.useForm<FormInstance>()
  const queryClient = useQueryClient()
  const { beforeUploadFile, allowedFileExtensions } = useCheckUploadFile({
    typeAccept: ['image'],
    maxFiles: 9
  })

  // Custom hooks
  const { data: leadList, isLoading: leadLoading } = useGetLeadList()
  const { data: taskDetail, isLoading: taskDetailLoading } =
    useGetTaskDetail(taskId)
  const { data: userList, isLoading: userListLoading } = useGetUserList()

  const { mutate: mutateUpdateTask } = useMutation({
    mutationFn: useUpdateTask
  })
  const { mutate: mutateAddTaskAssignees } = useMutation({
    mutationFn: useTaskAssignee
  })
  const { mutate: mutateDeleteTaskAssignees } = useMutation({
    mutationFn: useTaskDeleteAssignee
  })
  const { mutate: mutateDeleteTaskFile } = useMutation({
    mutationFn: useTaskDeleteFile
  })
  const { mutate: mutateEditTaskFile } = useMutation({
    mutationFn: useTaskEditFile,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ['GetTaskDetail']
      })
      NotificationCustom({
        type: 'success',
        message: 'Upload successfully',
        description: 'The file has been upload successfully!'
      })
    }
  })

  // Higher-order functions
  useAutoFocus(titleRef, visible)

  // Component life-cycle methods (useEffect)
  useEffect(() => {
    if (taskDetail) {
      form.setFieldsValue({
        ...taskDetail,
        lead: taskDetail.project?.uuid,
        deadline: taskDetail.deadline
          ? convertTimestamp(taskDetail.deadline)
          : undefined
      })

      if (taskDetail.assignees) {
        const assigneeUuids = taskDetail.assignees.map((item: any) => item.uuid)

        form.setFieldValue('assignees', assigneeUuids)
      }

      if (taskDetail.estimated_hours % 24 === 0) {
        form.setFieldValue('estimated_hours', taskDetail?.estimated_hours / 24)
        setTimeType('day')
      }

      if (taskDetail.attach_files) {
        setFiles(taskDetail.attach_files)
      } else {
        setFiles([])
      }
    }
  }, [taskDetail, form])

  const handleEdit = () => {
    form
      .validateFields()
      .then((values) => {
        onEdit(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const onEdit = (values: any) => {
    const {
      priority,
      title,
      status = 1,
      lead,
      description,
      deadline,
      estimated_hours,
      label
    } = values || {}

    const formData = new FormData()

    formData.append('title', title)
    formData.append('status', status)
    formData.append('project_uuid', lead)

    const dataEdit: any = {
      title,
      status,
      project_uuid: lead
    }

    if (priority) {
      // formData.append('priority', priority)
      dataEdit.priority = priority
    }

    if (description && description !== '<p><br></p>') {
      // formData.append('description', description)
      dataEdit.description = description
    }

    if (label) {
      // formData.append('label', label)
      dataEdit.label = label
    }

    if (deadline) {
      // formData.append('deadline', toTimestamp(deadline)?.toString())
      dataEdit.deadline = toTimestamp(deadline)
    }

    if (estimated_hours) {
      timeType === 'hour'
        ? (dataEdit.estimated_hours = +estimated_hours[0])
        : (dataEdit.estimated_hours = +estimated_hours[0] * 24)
    }

    setCreating(true)
    mutateUpdateTask(
      { dataUpdate: dataEdit, uuid: taskId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['GetTaskList'] })
          queryClient.invalidateQueries({ queryKey: ['GetTaskDetail'] })
          queryClient.invalidateQueries({ queryKey: ['GetTaskListOfLead'] })
          setCreating(false)
          setVisible(false)
          form.resetFields()
          NotificationCustom({
            type: 'success',
            message: 'Create success',
            description: 'The task has been created successfully!'
          })
        },
        onError: (error: any) => {
          NotificationCustom({
            type: 'error',
            message: 'Create fail',
            description: error.message
          })
          setCreating(false)
        }
      }
    )
  }

  const onCloseModal = () => {
    setVisible(false)
  }

  const handleSelectChangeType = (value: string) => {
    setTimeType(value)
  }

  const handleDeselect = (userId: string) => {
    mutateDeleteTaskAssignees(
      { userId: userId, taskId: taskId },
      {
        onError: (error: any) => {
          queryClient.invalidateQueries({
            queryKey: ['GetTaskDetail']
          })
          queryClient.invalidateQueries({
            queryKey: ['GetTaskList']
          })
          NotificationCustom({
            type: 'error',
            message: 'Assignee removed failed',
            description: error.message
          })
        }
      }
    )
  }

  const handleAddSelect = (userId: string) => {
    const dataAssignee = { assignee_uuid: userId }

    mutateAddTaskAssignees(
      { data: dataAssignee, taskId: taskId },
      {
        onError: (error: any) => {
          queryClient.invalidateQueries({
            queryKey: ['GetTaskDetail']
          })
          queryClient.invalidateQueries({
            queryKey: ['GetTaskList']
          })
          NotificationCustom({
            type: 'error',
            message: 'Assignee addition failed',
            description: error.message
          })
        }
      }
    )
  }

  const handleInputBlur = (e: any) => {
    const extractedNumbers = e.target.value.match(/\d+/)

    form.setFieldValue('estimated_hours', extractedNumbers)
  }

  const handleChangeFile = (e: any) => {
    if (e.file.status === 'removed') {
      setFileId(e.file.uuid)
      setShowMDeleteFile(true)
    }

    if (e.file.status === 'uploading') {
      const formFile = new FormData()
      formFile.append('file', e.file.originFileObj)

      mutateEditTaskFile(
        { data: formFile, taskId },
        {
          onError(error, variables, context) {
            NotificationCustom({
              type: 'error',
              message: error.message
            })
          }
        }
      )
    }
  }

  const handleDeleteFile = () => {
    const fileInfo = {
      taskId,
      fileId
    }

    setDeleteFileLoading(true)

    mutateDeleteTaskFile(fileInfo, {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({
          queryKey: ['GetTaskDetail']
        })

        setShowMDeleteFile(false)
        setDeleteFileLoading(false)

        NotificationCustom({
          type: 'success',
          message: 'File removed!'
        })
      },

      onError(error, variables, context) {
        setShowMDeleteFile(false)
        setDeleteFileLoading(false)

        NotificationCustom({
          type: 'error',
          message: error.message
        })
      }
    })
  }

  // Component render
  return (
    <CrmModal
      open={visible}
      title={
        <div className='modal-title'>
          <div className='title'>{title}</div>
          <div className='btn-title close-modal' onClick={onCloseModal}>
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      onOk={handleEdit}
      onCancel={onCloseModal}
      footer={[
        <StyledButton key='cancel' onClick={onCloseModal} disabled={creating}>
          Cancel
        </StyledButton>,
        <StyledButton
          loading={creating}
          onClick={handleEdit}
          key='edit'
          type='primary'
          style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
        >
          Save
        </StyledButton>
      ]}
    >
      {taskDetailLoading && (
        <Spin style={{ position: 'absolute', left: '50%' }} />
      )}
      <StyledForm
        form={form}
        layout='vertical'
        onFinish={handleEdit}
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
              <StyledSelect defaultValue={1}>
                {TASK_STATUS.map((item, index: number) => (
                  <Select.Option key={index} value={index + 1}>
                    {item}
                  </Select.Option>
                ))}
              </StyledSelect>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={<>Priority</>} name='priority'>
              <StyledSelect listHeight={250} placeholder='Select priority'>
                {TASK_PRIORITY.map((item, index: number) => (
                  <Select.Option key={index} value={index + 1}>
                    {item}
                  </Select.Option>
                ))}
              </StyledSelect>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label={<>Assignee</>} name='assignees'>
          <StyledSelect
            listHeight={250}
            listItemHeight={30}
            mode='multiple'
            maxTagCount={'responsive'}
            placeholder='Assignee'
            loading={userListLoading}
            onDeselect={handleDeselect}
            onSelect={handleAddSelect}
          >
            {userList?.data?.map((item: any) => (
              <Select.Option key={item.uuid} value={item.uuid}>
                {item.displayname}
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
          <StyledSelect placeholder='Select Lead' allowClear>
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
                  <Select onChange={handleSelectChangeType} value={timeType}>
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
            onChange={handleChangeFile}
            onPreview={() => false}
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

      {showMDeleteFile && (
        <DeleteForm
          onClose={() => setShowMDeleteFile(false)}
          visible={showMDeleteFile}
          onDelete={handleDeleteFile}
          question={'Do you want to delete this file?'}
          loading={deleteFileLoading}
        />
      )}
    </CrmModal>
  )
}

// Props type declaration
interface FormProps {
  title: String
  visible: boolean
  setVisible: (visible: boolean) => void
  taskId?: string | null
}

export default TaskFormEdit

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
