import React from 'react'

import { getTextColor } from '../../utils/FunctionsShare'

import { TagListItemStyle } from './style'
import { FiXCircle } from 'react-icons/fi'

type Props = {
  value: string
  onClickOpenDelete: () => void
  backgroundColor: string
}

const TagListItem: React.FC<Props> = ({
  value,
  onClickOpenDelete,
  backgroundColor
}) => {
  return (
    <TagListItemStyle
      $backgroundColor={backgroundColor}
      $textColor={getTextColor(backgroundColor)}
    >
      <div className='text'>{value}</div>
      <div
        className='action delete'
        onClick={(e) => {
          e.stopPropagation()
          onClickOpenDelete()
        }}
      >
        <FiXCircle style={{ fontSize: '12px' }} />
      </div>
    </TagListItemStyle>
  )
}

export default TagListItem
