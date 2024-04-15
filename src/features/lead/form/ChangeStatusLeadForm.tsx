// External dependencies
import { Button } from 'antd'
import React, { useRef } from 'react'
import { FiAlertCircle, FiXCircle } from 'react-icons/fi'

// Internal dependencies
import useAutoFocus from '../../../utils/autoFocus'

// Stylesheet
import { MiniCrmModal } from '../../../component/componentOfForm/ComponentOfForm.style'

// Assets

const ChangeStatusLeadForm: React.FC<ChangeStatusLeadFormProps> = ({
  visible,
  onClose,
  onChange,
  loading,
  note
}) => {
  // Stage logic

  // Ref
  const yesButtonRef = useRef<any>(null)

  // Variables

  // Custom hooks
  useAutoFocus(yesButtonRef, visible)

  // Component life-cycle methods (useEffect)

  // Component render
  return (
    <MiniCrmModal
      open={visible}
      title={
        <div className='modal-title delete'>
          <div className='title'>
            <div className='btn-title icon-warning'>
              <FiAlertCircle style={{ fontSize: '28px', color: '#faad14' }} />
            </div>
            Confirm
          </div>
          <div className='btn-title close-modal' onClick={onClose}>
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      okText='Yes'
      cancelText='Cancel'
      onOk={() => onChange(5)}
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
          onClick={() => onChange(5)}
          loading={loading}
          type='primary'
          style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
        >
          Yes
        </Button>
      ]}
    >
      {note}
    </MiniCrmModal>
  )
}

// Props type declaration
interface ChangeStatusLeadFormProps {
  visible: boolean
  loading: boolean
  onClose: () => void
  onChange: (onChangeLoading?: any) => void
  note: string
}

export default ChangeStatusLeadForm
