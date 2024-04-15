import { Form, Select, Typography } from 'antd'
import { FormInstance } from 'antd/lib/form'
import React, { useRef, useState } from 'react'
import { FiXCircle } from 'react-icons/fi'

import useAutoFocus from '../../utils/autoFocus'
import {
  MiniCrmModal,
  StyledButton,
  StyledForm,
  StyledInput,
  StyledSelect
} from '../componentOfForm/ComponentOfForm.style'
import { maxLengthRule } from '../../utils/validate'

interface AddFormProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onCreate: (values: any, onChangeLoading: any) => void
  onAdd: (values: any, onChangeLoading: any) => void
  data?: any
  dataExisted?: any
}

const { Text, Link } = Typography

const AddLeadQuick: React.FC<AddFormProps> = ({
  visible,
  setVisible,
  onCreate,
  onAdd,
  data,
  dataExisted
}) => {
  const [isCreateLead, setIsCreateLead] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const nameRef = useRef<any>(null)
  const newNameRef = useRef<any>(null)
  useAutoFocus(nameRef, visible && !isCreateLead)
  useAutoFocus(newNameRef, visible && isCreateLead)

  const [form] = Form.useForm<FormInstance>()

  const onChangeLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        isCreateLead
          ? onCreate(values, onChangeLoading)
          : onAdd(values, onChangeLoading)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const filterOption = (input: any, option: any) => {
    // Customize the search behavior based on both fullname and shortname
    const leadLabel = option.children.toLowerCase()
    return leadLabel.includes(input.toLowerCase())
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
          <div className='title'>Add Lead</div>
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
        {!isCreateLead ? (
          <Form.Item
            className='form-label'
            label={
              <div className='form-label--click-here'>
                Lead's Name
                <Text type='secondary' style={{ fontSize: '12px' }}>
                  Create new client, please{' '}
                  <Link onClick={() => setIsCreateLead(true)}>click here</Link>
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
              disabled={isCreateLead}
              maxTagCount='responsive'
              maxTagTextLength={20}
              mode='multiple'
              style={{ width: '100%' }}
              placeholder='Select leads'
              allowClear
              filterOption={filterOption}
              ref={nameRef}
            >
              {filteredData?.map((item: any) => (
                <Select.Option key={item.uuid} value={item.uuid}>
                  {item.shortname || item.fullname}
                </Select.Option>
              ))}
            </StyledSelect>
          </Form.Item>
        ) : (
          <>
            <Form.Item
              label={
                <>
                  New lead's Name&nbsp;
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
              <StyledInput ref={newNameRef} placeholder='Lead name' />
            </Form.Item>
            <Text type='secondary' style={{ fontSize: '12px' }}>
              Select lead, please{' '}
              <Link onClick={() => setIsCreateLead(false)}>click here</Link>
            </Text>
          </>
        )}
      </StyledForm>
    </MiniCrmModal>
  )
}

export default AddLeadQuick
