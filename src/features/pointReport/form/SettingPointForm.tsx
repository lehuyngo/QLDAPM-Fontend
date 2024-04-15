import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, FormInstance, Spin } from 'antd'
import React, { useState } from 'react'
import { FiPlusCircle, FiTrash, FiXCircle } from 'react-icons/fi'

import {
  useCreatePointActivity,
  useGetPointActivity
} from '../../../api/reactQuery/Point'
import { NotificationCustom } from '../../../component/notification/Notification'
import TextWithTooltip from '../../../component/textWithTooltip'
import { IPointActivity } from '../../../interfaces/IUser copy'
import {
  maxLengthRule,
  validateDuplicate,
  validatePoint
} from '../../../utils/validate'

import {
  StyledButton,
  StyledInput
} from '../../../component/componentOfForm/ComponentOfForm.style'
import { CrmModal } from '../../../theme/crm.style'
import { SettingPointFormStyle } from '../style'

const SettingPointForm: React.FC<SettingPointFormProps> = ({
  visible,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const [form] = Form.useForm<FormInstance>()
  const queryClient = useQueryClient()

  const { data, isLoading: getPointLoading } = useGetPointActivity()
  const { mutate } = useMutation({
    mutationFn: useCreatePointActivity,
    onSuccess(data, variables, context) {
      NotificationCustom({
        type: 'success',
        message: 'Create activity successfully!'
      })
    }
  })

  const handlePreSave = (form: FormInstance) => {
    form
      .validateFields()
      .then((values) => {
        if (values?.settings && values.settings?.length > 0) {
          handleCreatePoint(values)
        } else {
          NotificationCustom({
            type: 'warning',
            message: 'No changes detected.'
          })
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }

  const handleCreatePoint = async (values: any) => {
    const { settings } = values || {}
    setIsLoading(true)

    for (const element of settings) {
      const dataCreatePoint = {
        name: element.title,
        point: +element.point
      }

      try {
        await new Promise((resolve, reject) => {
          mutate(dataCreatePoint, {
            onSuccess(data, variables, context) {
              queryClient.invalidateQueries({ queryKey: ['GetPointActivity'] })
              form.resetFields()
              setIsLoading(false)
              resolve(null)
            },
            onError(error, variables, context) {
              NotificationCustom({
                type: 'error',
                message: 'Create failed',
                description: error.message
              })
              setIsLoading(false)
              reject(error)
            }
          })
        })
      } catch (error: any) {
        NotificationCustom({
          type: 'error',
          message: 'Create failed',
          description: error?.message
        })
        setIsLoading(false)
      }
    }
  }

  const handleInputBlur = (e: any, name: number) => {
    const extractedNumbers = e.target.value.match(/\d+/)
    form.setFieldValue(['settings', name, 'point'], extractedNumbers)
    form.validateFields()
  }

  const ValidateDuplicateName = validateDuplicate({
    data: data?.data,
    key: 'name'
  })

  return (
    <CrmModal
      open={visible}
      title={
        <div className='modal-title'>
          <div className='btn-title'></div>
          <div className='title'>Settings Point</div>
          <div className='btn-title close-modal' onClick={onClose}>
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      okText='Save'
      cancelText='Cancel'
      onOk={() => {}}
      onCancel={onClose}
      closeIcon={<></>}
      footer={[
        <StyledButton key='cancel' onClick={onClose}>
          Cancel
        </StyledButton>,
        <StyledButton
          autoFocus
          key='yes'
          onClick={() => {
            handlePreSave(form)
          }}
          loading={isLoading}
          type='primary'
          style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
        >
          Save
        </StyledButton>
      ]}
    >
      <SettingPointFormStyle>
        <div className='label-list'>
          <div className='activity'>Activity</div>
          <div className='space'></div>
          <div className='point'>Point</div>
        </div>

        {getPointLoading ? (
          <Spin />
        ) : (
          <>
            {data?.data?.length > 0 && (
              <div className='point-list-exist'>
                {data?.data?.map((item: IPointActivity, index: number) => (
                  <div
                    className={`point-item point-item${
                      data?.data?.length === 1
                        ? '-unique'
                        : index === 0
                          ? '-first'
                          : index === data?.data?.length - 1
                            ? '-last'
                            : '-middle'
                    }`}
                    key={item.uuid}
                  >
                    <div className='label-container'>
                      <div className='label'>
                        <TextWithTooltip text={item.name} />
                      </div>
                    </div>
                    <div className='equal-symbol'>=</div>
                    <div className='point'>
                      <div className='value'>{item.point}</div>
                      <div className='unit'>point</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <Form form={form} layout='vertical'>
          <Form.List name='settings'>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    style={{ display: 'flex' }}
                    className={`point-item-new point-item-new${
                      data?.data?.length === 1
                        ? '-unique'
                        : index === 0
                          ? '-first'
                          : index === data?.data?.length - 1
                            ? '-last'
                            : '-middle'
                    }`}
                  >
                    <Form.Item
                      className='label'
                      {...restField}
                      name={[name, 'title']}
                      rules={[
                        { required: true, message: 'This field is required!' },
                        ValidateDuplicateName,
                        maxLengthRule(100)
                      ]}
                    >
                      <StyledInput placeholder='Fill activity' />
                    </Form.Item>
                    <div className='equal-symbol'>=</div>
                    <Form.Item
                      className='point-field-container'
                      {...restField}
                      name={[name, 'point']}
                      rules={[
                        {
                          required: true,
                          message: 'This field is required!'
                        },
                        validatePoint
                      ]}
                    >
                      <StyledInput
                        placeholder='Fill point'
                        onBlur={(e) => {
                          handleInputBlur(e, name)
                        }}
                        maxLength={20}
                      />
                    </Form.Item>

                    <div className='btn-delete'>
                      <FiTrash onClick={() => remove(name)} />
                    </div>
                  </div>
                ))}
                <Form.Item className='field-add-activities'>
                  <Button
                    type='dashed'
                    className='field-add-activities--btn'
                    onClick={() => add()}
                    block
                    icon={<FiPlusCircle />}
                  >
                    Add activities
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </SettingPointFormStyle>
    </CrmModal>
  )
}

interface SettingPointFormProps {
  visible: boolean
  onClose: () => void
}

export default SettingPointForm
