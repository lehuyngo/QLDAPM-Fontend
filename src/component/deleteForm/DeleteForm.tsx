import { Button } from 'antd'
import React, { useRef, useState } from 'react'
import { FiAlertCircle, FiXCircle } from 'react-icons/fi'

import useAutoFocus from '../../utils/autoFocus'
import { MiniCrmModal } from '../componentOfForm/ComponentOfForm.style'

interface DeleteFormProps {
  title?: string
  question?: any
  visible: boolean
  onClose: () => void
  onDelete: (onChangeLoading?: any) => void
  loading?: boolean
}

const DeleteForm: React.FC<DeleteFormProps> = ({
  title,
  question,
  visible,
  onClose,
  onDelete,
  loading
}) => {
  const yesButtonRef = useRef<any>(null)
  useAutoFocus(yesButtonRef, visible)

  const [isLoading, setIsLoading] = useState(false)

  const onChangeLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  return (
    <MiniCrmModal
      open={visible}
      title={
        <div className='modal-title delete'>
          <div className='title'>
            <div className='btn-title icon-warning'>
              <FiAlertCircle style={{ fontSize: '28px', color: '#faad14' }} />
            </div>
            {title ? title : 'Confirm'}
          </div>
          <div className='btn-title close-modal' onClick={onClose}>
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      okText='Delete'
      cancelText='Cancel'
      onOk={() => onDelete(onChangeLoading)}
      onCancel={onClose}
      closeIcon={<></>}
      footer={[
        <Button key='cancel' onClick={onClose}>
          No
        </Button>,
        <Button
          autoFocus
          key='yes'
          ref={yesButtonRef}
          onClick={() => onDelete(onChangeLoading)}
          loading={loading === undefined ? isLoading : loading}
          type='primary'
          style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
        >
          Yes
        </Button>
      ]}
    >
      {question}
    </MiniCrmModal>
  )
}

export default DeleteForm
