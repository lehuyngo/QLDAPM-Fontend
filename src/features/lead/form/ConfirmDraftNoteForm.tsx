// External dependencies
import React, { useRef } from 'react'
import { FiXCircle } from 'react-icons/fi'

// Internal dependencies
import useAutoFocus from '../../../utils/autoFocus'
import { timestampToDateTime } from '../../../utils/convertTimestamp'
import ModeShowContent from '../leadDetail/ModeShowContent'

// Stylesheet
import { StyledButton } from '../../../component/componentOfForm/ComponentOfForm.style'
import { CrmModal } from '../../../theme/crm.style'

// Assets

const ConfirmDraftNoteForm: React.FC<ConfirmDraftNoteFormProps> = ({
  visible,
  onClose,
  onApply,
  onDelete,
  content,
  createdAt
}) => {
  // Stage logic

  // Ref
  const yesButtonRef = useRef<any>(null)

  // Variables
  let emptyNotes = ['<p><br></p>','']

  // Custom hooks
  useAutoFocus(yesButtonRef, visible)

  // Component life-cycle methods (useEffect)

  // Component render
  return (
    <CrmModal
      open={visible && !emptyNotes.includes(content)}
      className='modal-confirm-draft-note'
      title={
        <div className='modal-title'>
          <div className='btn-title'></div>
          <div className='title'>Confirm</div>
          <div className='btn-title close-modal' onClick={onClose}>
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      footer={[
        <StyledButton key='delete' onClick={onDelete}>
          Delete
        </StyledButton>,
        <StyledButton
          autoFocus
          key='apply'
          ref={yesButtonRef}
          onClick={onApply}
          type='primary'
          style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
        >
          Apply
        </StyledButton>
      ]}
    >
      <div className='modal-content'>
        <div className='modal-content-title'>
          <div className='title'>You have a draft!</div>
          <div className='notice'>
            Note: After {timestampToDateTime(createdAt)}, this draft will be
            removed from system.
          </div>
        </div>
        <div className='modal-content-body'>
          <ModeShowContent content={content} />
        </div>
        <div className='modal-content-footer'>
          Do you want to use this draft?
        </div>
      </div>
    </CrmModal>
  )
}

// Props type declaration
interface ConfirmDraftNoteFormProps {
  visible: boolean
  createdAt: number
  onClose: () => void
  onApply: () => void
  onDelete: () => void
  content: string
}

export default ConfirmDraftNoteForm
