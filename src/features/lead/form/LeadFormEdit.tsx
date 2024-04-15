import { Col, Form, Row, Select, Tooltip, Typography } from 'antd'
import { FormInstance } from 'antd/lib/form'
import React, { useEffect, useRef, useState } from 'react'
import { FiXCircle } from 'react-icons/fi'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  useGetLeadDetail,
  useGetLeadList,
  useGetLeadStatus,
  useUpdateLead
} from '../../../api/reactQuery/Lead'
import {
  StyledButton,
  StyledForm,
  StyledInput,
  StyledSelect
} from '../../../component/componentOfForm/ComponentOfForm.style'
import { NotificationCustom } from '../../../component/notification/Notification'
import { CrmModal } from '../../../theme/crm.style'
import { clearSpaceString } from '../../../utils/FunctionsShare'
import { validateDuplicate, maxLengthRule } from '../../../utils/validate'

const { Text } = Typography

interface FormProps {
  visible: boolean
  title: String
  onCloseModal: () => void
  isCreate: boolean
  oldData?: any
  uuid?: string | null
}

const LeadFormEdit: React.FC<FormProps> = ({
  title,
  visible,
  onCloseModal,
  isCreate,
  oldData,
  uuid = null
}) => {
  const [status, setStatus] = useState<number>(1)
  const [isProjectReceived, setIsProjectReceived] = useState<boolean>(false)
  const [isDisableChangeStatus, setIsDisableChangeStatus] =
    useState<boolean>(false)

  const [form] = Form.useForm<FormInstance>()
  const fullNameInputRef = useRef<any>(null)
  const queryClient = useQueryClient()

  const { data: leadStatus } = useGetLeadStatus()
  const { data: leadList } = useGetLeadList()
  const { data: leadDetailApi } = useGetLeadDetail(uuid)

  const leadDetail = uuid ? leadDetailApi : oldData

  const dataFilter = leadList?.data?.filter(
    (item: any) => item.uuid !== leadDetail?.uuid
  )

  const ValidateDuplicateFullName = validateDuplicate({
    data: dataFilter,
    key: 'fullname'
  })

  useEffect(() => {
    if (!visible) {
      form.resetFields()
    }

    if (leadDetail && visible && leadStatus) {
      form.setFieldsValue(leadDetail)

      setStatus(leadDetail.project_status)

      if (leadDetail.project_status == 5) {
        setIsDisableChangeStatus(true)
      }
    }
  }, [visible, leadDetail])

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

  const { mutate: mutateUpdateLead } = useMutation({
    mutationFn: useUpdateLead
  })

  const handleCreate = () => {
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
    const dataSend: any = {
      fullname: clearSpaceString(values.fullname),
      project_status: status || 1
    }

    if (values.shortname) {
      dataSend.shortname = clearSpaceString(values.shortname)
    }

    if (values.oldClient) {
      dataSend.client = { uuid: values.oldClient }
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
      dataSend.contact = [
        {
          fullname: clearSpaceString(values.newContactName),
          email: values.newContactMail
        }
      ]
    }

    mutateUpdateLead(
      { dataUpdate: dataSend, uuid: leadDetail.uuid },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['GetLeadList'] })
          NotificationCustom({
            type: 'success',
            message: 'Create success',
            description: 'The lead has been created successfully!'
          })
          onCloseModal()
          form.resetFields()
        }
      }
    )
  }

  return (
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
        <StyledButton key='cancel' onClick={onCloseModal}>
          Cancel
        </StyledButton>,
        <StyledButton
          onClick={handleCreate}
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
          />
        </Form.Item>

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
            className='project_status--select-box'
            disabled={isDisableChangeStatus}
            onChange={(value: number) => {
              setStatus(value)
              setIsProjectReceived(value === 5)
            }}
            value={status}
          >
            {leadStatus?.map((item: any) => (
              <Select.Option key={item.value} value={item.value}>
                {isDisableChangeStatus ? (
                  <Tooltip title='Unable to change the status when the lead is in the "Project received" state'>
                    {item.name}
                  </Tooltip>
                ) : (
                  item.name
                )}
              </Select.Option>
            ))}
          </StyledSelect>
        </Form.Item>
        {isProjectReceived && (
          <Text type='secondary' style={{ fontSize: '12px', color: '#FC7634' }}>
            If you select this status, the project will be moved to the PIMS
            Page. <br />
            You can not change the status again.
          </Text>
        )}
      </StyledForm>
    </CrmModal>
  )
}

export default LeadFormEdit
