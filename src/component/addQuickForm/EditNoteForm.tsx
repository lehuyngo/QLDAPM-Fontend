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
  id: string | null
  visible: boolean
  ownerID: string | undefined
  setVisible: (visible: boolean) => void
  onUpdate: (data: any, onChangeLoading: any) => void
  oldData?: any
}

const EditNoteForm: React.FC<FormProps> = ({
  id,
  visible,
  ownerID,
  setVisible,
  onUpdate,
  oldData
}) => {
  const [form] = Form.useForm()
  const [colorHex, setColorHex] = useState<string>(
    localStorage.getItem(LOCAL_STORAGE_ITEM.COLOR_TAG)?.toString() || '#ffe8d6'
  )
  const [formatHex, setFormatHex] = useState<ColorPickerProps['format']>('hex')
  const [noteTitle, setNoteTitle] = useState<string>('')
  const [noteContent, setNoteContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const titleRef = useRef<any>(null)

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

  useEffect(() => {
    if (!visible) {
      form.resetFields()
    }

    form.setFieldsValue(oldData)
    setNoteTitle(oldData?.title)
    setColorHex(oldData?.color)
  }, [oldData, visible, form])

  const validateForm = {
    validator: (_: any, value: any, callback: any) => {
      if (noteTitle === '' && noteContent === '')
        callback("Tilte and Content can't beboth empty! ")
      else callback()
    }
  }

  const onChangeLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const onSubmit = (values: any) => {
    const formData = {
      title: values.title,
      content: values.content,
      color: values.color
    }
    const dataPut = {
      ownerID: ownerID,
      uuid: id,
      formData: formData
    }
    onUpdate(dataPut, onChangeLoading)
  }
  const handleEdit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleInputColor = (value: string) => {
    console.log(value)

    localStorage.setItem(LOCAL_STORAGE_ITEM.COLOR_TAG, value)
    form.setFieldValue('color', value)
    setColorHex(value)
  }

  return (
    <MiniCrmModal
      open={visible}
      title={
        <div className='modal-title'>
          <div className='btn-title'></div>
          <div className='title'>Edit Note</div>
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
            handleEdit()
          }}
          type='primary'
          loading={isLoading}
          style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
        >
          Save
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
          rules={[validateForm, maxLengthRule(255)]}
        >
          <StyledInput
            ref={titleRef}
            placeholder='Fill note title'
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
        </Form.Item>
        <Form.Item label='Note' name='content' rules={[validateForm]}>
          <StyledTextArea
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
                  name={'color'}
                >
                  <StyledInput
                    value={colorHex}
                    style={{ marginLeft: '8px' }}
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

export default EditNoteForm
