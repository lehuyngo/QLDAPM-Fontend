import React, { useState, useEffect, useRef } from 'react'
import { Form, Row, Col, ColorPicker } from 'antd'

import type { ColorPickerProps } from 'antd/es/color-picker'
import {
  MiniCrmModal,
  StyledButton,
  StyledForm,
  StyledInput,
  StyledTextArea
} from '../componentOfForm/ComponentOfForm.style'
import { FiXCircle } from 'react-icons/fi'
import { getTextColor } from '../../utils/FunctionsShare'
import { LOCAL_STORAGE_ITEM } from '../../constants/common'
import { maxLengthRule } from '../../utils/validate'

interface FormProps {
  visible: boolean
  ownerID: string | undefined
  setVisible: (visible: boolean) => void
  onCreate: (data: FormData, onChangeLoading: any) => void
  oldData?: Object
  isResetForm: boolean
}

const CreateNoteForm: React.FC<FormProps> = ({
  visible,
  ownerID,
  setVisible,
  onCreate,
  isResetForm
}) => {
  const [form] = Form.useForm()

  const titleRef = useRef<any>(null)
  const [colorHex, setColorHex] = useState<string>(
    localStorage.getItem(LOCAL_STORAGE_ITEM.COLOR_TAG)?.toString() || '#FFE8D6'
  )
  const [formatHex, setFormatHex] = useState<ColorPickerProps['format']>('hex')
  const [noteTitle, setNoteTitle] = useState<string>('')
  const [noteContent, setNoteContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isResetForm) {
      form.resetFields()
      setNoteTitle('')
      setNoteContent('')
    }
    setColorHex(
      localStorage.getItem(LOCAL_STORAGE_ITEM.COLOR_TAG)?.toString() ||
        '#FFE8D6'
    )
  }, [visible, isResetForm])

  const validateForm = {
    validator: (_: any, value: any, callback: any) => {
      if (noteTitle === '' && noteContent === '')
        callback("Title and Content can't be both empty! ")
      else callback()
    }
  }

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
    const formData = new FormData()

    formData.append('title', values.title || '')
    formData.append('content', values.content || '')
    formData.append('color', colorHex)
    formData.append('ownerID', ownerID ? ownerID : '')
    onCreate(formData, onChangeLoading)
  }

  const handleInputColor = (value: string) => {
    localStorage.setItem(LOCAL_STORAGE_ITEM.COLOR_TAG, value)
    form.setFieldValue('color', value)
    setColorHex(value)
  }

  useEffect(() => {
    if (visible && titleRef?.current) {
      const timeOut = setTimeout(() => {
        titleRef.current.focus()
      }, 300)
      return () => {
        clearTimeout(timeOut)
      }
    }
  }, [visible])

  return (
    <MiniCrmModal
      open={visible}
      title={
        <div className='modal-title'>
          <div className='btn-title'></div>
          <div className='title'>Create Note</div>
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
      onCancel={() => {
        setVisible(false)
      }}
      footer={[
        <StyledButton key='cancel' onClick={() => setVisible(false)}>
          Cancel
        </StyledButton>,
        <StyledButton
          onClick={() => {
            form.submit()
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
      <StyledForm
        name='control-hooks'
        form={form}
        layout='vertical'
        requiredMark={false}
      >
        <Form.Item
          label='Title'
          name={'title'}
          rules={[validateForm, maxLengthRule(100)]}
        >
          <StyledInput
            ref={titleRef}
            placeholder='Fill note title'
            onChange={(e) => setNoteTitle(e.target.value)}
          />
        </Form.Item>
        <Form.Item label='Note' name='content' rules={[validateForm]}>
          <StyledTextArea
            placeholder='Fill note'
            autoSize={{ minRows: 2, maxRows: 6 }}
            onChange={(e) => setNoteContent(e.target.value)}
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: '0px' }}
              label='Color'
              colon={false}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ColorPicker
                  size='large'
                  format={formatHex}
                  value={colorHex}
                  disabledAlpha={true}
                  onChange={(e) =>
                    handleInputColor(e.toHexString().toUpperCase())
                  }
                  onFormatChange={setFormatHex}
                />
                <Form.Item
                  noStyle
                  rules={[{ required: true, message: 'Please enter color' }]}
                >
                  <StyledInput
                    style={{ marginLeft: '8px' }}
                    value={colorHex}
                    onChange={(e) =>
                      handleInputColor(e.target.value.toUpperCase())
                    }
                  />
                </Form.Item>
              </div>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              style={{ marginBottom: '0px' }}
              label='Preview'
              colon={false}
            >
              <div
                className='text-full'
                style={{
                  background: colorHex,
                  color: getTextColor(colorHex?.toString())
                }}
              >
                <div className='text-minimize'>{noteTitle}</div>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </StyledForm>
    </MiniCrmModal>
  )
}

export default CreateNoteForm
