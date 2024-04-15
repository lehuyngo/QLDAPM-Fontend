import React from 'react'
import { FiEdit, FiPlusCircle, FiTrash2 } from 'react-icons/fi'
import { ActionStyle } from './style'
import { Tooltip } from 'antd'

type Props = {
  onOpenCreateTag?: () => void
  onOpenMEdit: () => void
  onOpenMDelete: () => void
  isDisabled?: boolean
}

const MoreAction: React.FC<Props> = ({
  onOpenMDelete,
  onOpenMEdit,
  onOpenCreateTag,
  isDisabled = false
}) => {
  return (
    <ActionStyle>
      {onOpenCreateTag && (
        <Tooltip title='Create tag'>
          <div
            className='action'
            onClick={(e) => {
              e.stopPropagation()
              onOpenCreateTag()
            }}
          >
            <FiPlusCircle style={{ fontSize: '16px', color: '#333' }} />
          </div>
        </Tooltip>
      )}

      <Tooltip title='Edit'>
        <div
          className={`action ${isDisabled && 'disable'}`}
          onClick={(e) => {
            e.stopPropagation()
            if (!isDisabled) {
              onOpenMEdit()
            }
          }}
        >
          <FiEdit style={{ fontSize: '16px', color: '#333' }} />
        </div>
      </Tooltip>

      <Tooltip title='Delete'>
        <div
          className={`action ${isDisabled && 'disable'}`}
          onClick={(e) => {
            e.stopPropagation()
            if (!isDisabled) {
              onOpenMDelete()
            }
          }}
        >
          <FiTrash2 style={{ fontSize: '16px', color: '#333' }} />
        </div>
      </Tooltip>
    </ActionStyle>
  )
}

export default MoreAction
