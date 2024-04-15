import { useState, useEffect } from 'react'
import { Button, Input, Select } from 'antd'
import { FiPlusCircle, FiSearch, FiSend } from 'react-icons/fi'

import { useGetTags } from '../../api/reactQuery/Tag'
import { ToolbarStyle } from './styled'
import { useDebounce } from '../../hooks/useDebounce'

type Props = {
  onOpenCreateContact: () => void
  onOpenCreateBatchEmail: () => void
  onSearch: any
  onTagChange: any
}

const ToolbarContact: React.FC<Props> = ({
  onOpenCreateContact,
  onOpenCreateBatchEmail,
  onSearch,
  onTagChange
}) => {
  const [searchValue, setSearchValue] = useState<string>('')

  const { data: listTag, isLoading: tagsLoading } = useGetTags('contact')

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

  return (
    <ToolbarStyle className='contact'>
      <Button
        className='toolbar-create'
        icon={<FiPlusCircle style={{ fontSize: '16px' }} />}
        onClick={onOpenCreateContact}
      >
        Create
      </Button>

      <Input
        className='toolbar-search-box'
        placeholder='Search by contact name'
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

      <div className='toolbar-send-email'>
        <Button
          className='btn-send-email-multi-user'
          icon={<FiSend style={{ fontSize: '14px' }} />}
          onClick={onOpenCreateBatchEmail}
        >
          Send Batch Mail
        </Button>
      </div>
    </ToolbarStyle>
  )
}

export { ToolbarContact }
