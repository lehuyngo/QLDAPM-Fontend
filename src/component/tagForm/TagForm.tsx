import { Col, ColorPicker, Form, Row } from 'antd'
import type { Color, ColorPickerProps } from 'antd/es/color-picker'
import { FormInstance } from 'antd/lib/form'
import { BaseSelectRef } from 'rc-select/lib/BaseSelect'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FiXCircle } from 'react-icons/fi'

import styled from 'styled-components'
import { useGetTags } from '../../api/reactQuery/Tag'
import { LOCAL_STORAGE_ITEM } from '../../constants/common'
import { getTextColor } from '../../utils/FunctionsShare'
import {
  MiniCrmModal,
  StyledButton,
  StyledForm,
  StyledInput,
  StyledSelect
} from '../componentOfForm/ComponentOfForm.style'

interface CreateFormProps {
  tagExisted?: any
  title: String
  visible: boolean
  onClose: () => void
  onCreate: (values: any, onChangeLoading: any) => void
  from: string
}

interface ITag {
  uuid: string
  name: string
  color: string
}

const TagForm: React.FC<CreateFormProps> = ({
  tagExisted,
  title,
  visible,
  onClose,
  onCreate,
  from
}) => {
  const [colorHex, setColorHex] = useState<Color | string>(
    localStorage.getItem(LOCAL_STORAGE_ITEM.COLOR_TAG)?.toString() || '#ffe8d6'
  )
  const [formatHex, setFormatHex] = useState<ColorPickerProps['format']>('hex')
  const [content, setContent] = useState<string>('')
  const [tagsData, setTagsData] = useState<ITag[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const tagRef = useRef<BaseSelectRef>(null)

  const [form] = Form.useForm<FormInstance>()

  const { data: listTag } = useGetTags(from)

  useEffect(() => {
    if (listTag?.data) {
      setTagsData(listTag.data)
    }
  }, [listTag])

  useEffect(() => {
    let color = localStorage.getItem(LOCAL_STORAGE_ITEM.COLOR_TAG)
    if (color && visible) {
      form.setFieldValue('color', color)
    }
  }, [form, visible])

  useEffect(() => {
    if (visible && tagRef?.current) {
      const timeOut = setTimeout(() => {
        tagRef.current?.focus()
      }, 300)
      return () => {
        clearTimeout(timeOut)
      }
    }
  }, [visible])

  const hexString = useMemo(
    () =>
      typeof colorHex === 'string'
        ? colorHex
        : colorHex.toHexString().toUpperCase(),
    [colorHex]
  )

  const onChangeLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const handleSearchTagName = (value: any) => {
    if (value) {
      const tagNamesSet = new Set(listTag?.data?.map((e: ITag) => e.name))

      if (!tagNamesSet.has(value)) {
        let colorHex =
          localStorage.getItem(LOCAL_STORAGE_ITEM.COLOR_TAG) || '#FFFFFF'

        setContent(value)

        if (listTag?.data) {
          setTagsData([
            { name: value, color: colorHex, uuid: '' },
            ...listTag.data
          ])
        } else {
          setTagsData([{ name: value, color: colorHex, uuid: '' }])
        }
      } else {
        setTagsData(listTag?.data ? [...listTag?.data] : [])
      }
    }
  }

  const handleBlur = () => {
    form.setFieldValue('name', content)
  }

  const handleChangeTagName = (value: any) => {
    setContent(value)
    form.setFieldValue('name', value)
  }

  const handleChangeTagColor = (value: string | Color) => {
    form.setFieldValue('color', value)
    setColorHex(value)
  }

  const handleCreate = () => {
    localStorage.setItem(LOCAL_STORAGE_ITEM.COLOR_TAG, hexString)
    form
      .validateFields()
      .then((values) => {
        onCreate(values, onChangeLoading)
        form.resetFields()
        setContent('')
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <MiniCrmModal
      open={visible}
      title={
        <div className='modal-title'>
          <div className='btn-title'></div>
          <div className='title'>{title}</div>
          <div className='btn-title close-modal' onClick={onClose}>
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      okText='Add'
      closeIcon={<></>}
      cancelText='Cancel'
      onOk={handleCreate}
      onCancel={onClose}
      footer={[
        <StyledButton key='cancel' onClick={onClose}>
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Name Tags'
              name='name'
              rules={[{ required: true, message: 'This field is required!' }]}
            >
              <StyledSelect
                ref={tagRef}
                placeholder='Text'
                showSearch
                onChange={handleChangeTagName}
                onSearch={handleSearchTagName}
                onBlur={handleBlur}
                options={tagsData
                  .filter(
                    (tag) =>
                      !tagExisted?.find(
                        (existedTag: any) => existedTag.name === tag.name
                      )
                  )
                  .map((t) => ({
                    label: t.name,
                    value: t.name,
                    color: t.color
                  }))}
                optionRender={(option) => (
                  <TagOptionStyle
                    $color={getTextColor(option.data.color)}
                    $backgroundColor={option.data.color}
                    onClick={() => handleChangeTagColor(option.data.color)}
                  >
                    {option.data.label}
                  </TagOptionStyle>
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: '0px' }}
              label='Color'
              name='color'
              colon={false}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ColorPicker
                  size='large'
                  format={formatHex}
                  value={colorHex}
                  disabledAlpha={true}
                  onChange={(e) =>
                    handleChangeTagColor(e.toHexString().toUpperCase())
                  }
                  onFormatChange={setFormatHex}
                />
                <Form.Item
                  noStyle
                  rules={[{ required: true, message: 'Please enter color' }]}
                >
                  <StyledInput
                    style={{ marginLeft: '8px' }}
                    value={hexString}
                    onChange={(e) =>
                      handleChangeTagColor(e.target.value.toUpperCase())
                    }
                  />
                </Form.Item>
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              style={{ marginBottom: '0px' }}
              label='Preview'
              colon={false}
            >
              <div
                className='text-full'
                style={{
                  background: hexString,
                  color: getTextColor(colorHex.toString())
                }}
              >
                <div className='text-minimize'>{content}</div>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </StyledForm>
    </MiniCrmModal>
  )
}

export default TagForm

const TagOptionStyle = styled.div<{ $color: string; $backgroundColor: string }>`
  padding: 4px 8px 4px 8px;
  border-radius: 50rem;

  text-align: center;
  color: ${(props) => props.$color};
  background-color: ${(props) => props.$backgroundColor};

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
