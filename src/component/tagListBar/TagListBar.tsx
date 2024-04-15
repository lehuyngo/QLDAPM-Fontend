import React from 'react'
import { TagListBarStyle } from './style'
import TagListItem from './TagListItem'
import { sortDataByCreatedTime } from '../../utils/SortData'

const TagListBar: React.FC<Props> = ({ data, onClickDelete }) => {
  const dataSorted = sortDataByCreatedTime(data)
  return (
    <TagListBarStyle>
      {dataSorted.map((t: any) => (
        <TagListItem
          key={t.uuid}
          value={t.name ? t.name : ''}
          backgroundColor={t.color ? t.color : '#ffffff'}
          onClickOpenDelete={() => onClickDelete(t.uuid)}
        />
      ))}
    </TagListBarStyle>
  )
}

export default TagListBar

type Props = {
  data: any
  onClickDelete: (uuid: string) => void
}
