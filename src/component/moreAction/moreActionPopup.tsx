import React from 'react'
import { FiEdit, FiPlusCircle, FiTrash2 } from 'react-icons/fi'
import { MoreActionPopupStyle } from './style'

type Props = {
  onOpenCreateTag?: () => void
  onOpenMEdit: () => void
  onOpenMDelete: () => void
  isDisabled?: boolean
}

const MoreActionPopup: React.FC<Props> = ({
  onOpenMDelete,
  onOpenMEdit,
  onOpenCreateTag,
  isDisabled = false
}) => {
  return (
    <MoreActionPopupStyle>
      {onOpenCreateTag && (
        <div
          className='action'
          onClick={(e) => {
            e.stopPropagation()
            onOpenCreateTag()
          }}
        >
          <FiPlusCircle style={{ fontSize: '16px', color: '#333' }} />
          <span className='text'>Create Tags</span>
        </div>
      )}
      <div
        className={`action ${isDisabled ? 'disable' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          if (!isDisabled) {
            onOpenMEdit()
          }
        }}
      >
        <FiEdit style={{ fontSize: '16px', color: '#333' }} />
        <span className='text'>Edit</span>
      </div>
      <div
        className={`action ${isDisabled ? 'disable' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          if (!isDisabled) {
            onOpenMDelete()
          }
        }}
      >
        <FiTrash2 style={{ fontSize: '16px', color: '#333' }} />
        <span className='text'>Delete</span>
      </div>
    </MoreActionPopupStyle>
  )
}

export default MoreActionPopup
