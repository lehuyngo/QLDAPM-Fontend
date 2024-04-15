import { Button, Input, Select } from 'antd'
import { FiPlusCircle, FiSearch } from 'react-icons/fi'
import { useState, useEffect } from 'react'

import { useGetTags } from '../../api/reactQuery/Tag'
import { ToolbarStyle } from './styled'
import { useDebounce } from '../../hooks/useDebounce'

type Props = {
  onOpenCreate: () => void
  onSearch: any
  onTagChange: any
  onFilterByCode: any
}

const ToolbarClient: React.FC<Props> = ({
  onOpenCreate,
  onSearch,
  onTagChange,
  onFilterByCode
}) => {
  const [searchValue, setSearchValue] = useState<string>('')

  const { data: listTag, isLoading: tagsLoading } = useGetTags('client')

  const debouncedSearchValue = useDebounce(searchValue, 500)

  useEffect(() => {
    onSearch(debouncedSearchValue)
  }, [debouncedSearchValue, onSearch])

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handleTagChange = (value: string) => {
    onTagChange(value)
  }

  const handleFilterByCode = (value: string) => {
    onFilterByCode(value)
  }

  return (
    <ToolbarStyle className='client'>
      <Button
        className='toolbar-create'
        type='primary'
        icon={<FiPlusCircle style={{ fontSize: '16px' }} />}
        onClick={onOpenCreate}
      >
        Create
      </Button>

      <Input
        className='toolbar-search-box'
        style={{ height: '40px' }}
        placeholder='Search by client name'
        allowClear
        suffix={<FiSearch style={{ fontSize: '20px', color: '#ccc' }} />}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <Select
        mode='multiple'
        maxTagCount='responsive'
        maxTagTextLength={10}
        className='toolbar-select-box'
        placeholder='Select Tag'
        style={{ width: '100%' }}
        onChange={handleTagChange}
        loading={tagsLoading}
        allowClear
        showSearch
      >
        {listTag?.data?.map((tag: any) => (
          <Select.Option key={tag.uuid} value={tag.name}>
            {tag.name}
          </Select.Option>
        ))}
      </Select>

      <Select
        className='toolbar-filter'
        onChange={handleFilterByCode}
        defaultValue='all'
      >
        <Select.Option value='all'>All</Select.Option>
        <Select.Option value='hasCode'>Code</Select.Option>
        <Select.Option value='noCode'>No Code</Select.Option>
      </Select>
    </ToolbarStyle>
  )
}

export { ToolbarClient }
