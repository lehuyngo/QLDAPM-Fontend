import React, { useEffect, useState } from 'react'
import { Button, Input, Segmented } from 'antd'
import { ToolbarStyle } from './styled'
import { FiGrid, FiList, FiPlusCircle, FiSearch } from 'react-icons/fi'
import styled from 'styled-components'
import { useDebounce } from '../../hooks/useDebounce'
import { MODE_VIEW } from '../../features/task/commom'

type Props = {
  onOpenCreate: () => void
  onChangeModeView: (val: string) => void
  onSearch: any
  viewKanban: string
}

const ToolbarTask: React.FC<Props> = ({
  onOpenCreate,
  onChangeModeView,
  onSearch,
  viewKanban
}) => {
  const [searchValue, setSearchValue] = useState<string | null>(null)

  const debouncedSearchValue = useDebounce(searchValue, 500)

  useEffect(() => {
    onSearch(debouncedSearchValue)
  }, [debouncedSearchValue, onSearch])

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  return (
    <ToolbarStyle className='task'>
      <Button
        className='toolbar-create'
        icon={<FiPlusCircle />}
        onClick={onOpenCreate}
      >
        Create
      </Button>

      <Input
        className='toolbar-search-box'
        placeholder='Search by task name'
        allowClear
        suffix={<FiSearch style={{ fontSize: '20px', color: '#ccc' }} />}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <div className='task-toolbar-right'>
        {viewKanban === MODE_VIEW.KANBAN && (
          <div className='group-right'>
            <div className='task-type deadline'>
              <div className='type-color'></div>
              <div className='type-name'>Deadline</div>
            </div>
            <div className='task-type toolate'>
              <div className='type-color'></div>
              <div className='type-name'>Too Late</div>
            </div>
          </div>
        )}
        <div className='group-right'>
          <SegmentedStyle
            value={viewKanban}
            options={[
              {
                label: <FiList className='task-view-mode-icon' />,
                value: 'list'
              },
              {
                label: <FiGrid className='task-view-mode-icon' />,
                value: 'kanban'
                // disabled: true
              }
            ]}
            onChange={(val: any) => onChangeModeView(val)}
          />
        </div>
      </div>
    </ToolbarStyle>
  )
}

export { ToolbarTask }

const SegmentedStyle = styled(Segmented)`
  .ant-segmented-item-label {
    display: flex;
    align-items: center;
  }

  .task-view-mode-icon {
    font-size: 20px;
    color: #999;
  }

  .ant-segmented-item-selected {
    .task-view-mode-icon {
      color: #fc7634;
    }
  }
`
