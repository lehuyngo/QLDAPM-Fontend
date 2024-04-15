import { Button, Input, Select } from 'antd'
import { ToolbarStyle } from './styled'
import { FiFilter, FiPlusCircle, FiSearch } from 'react-icons/fi'
import { useGetLeadStatus } from '../../api/reactQuery/Lead'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

type Props = {
  onOpenCreate: () => void
  onSearch: any
  onStatusChange: any
}

const ToolbarLead: React.FC<Props> = ({
  onOpenCreate,
  onSearch,
  onStatusChange
}) => {
  const [searchValue, setSearchValue] = useState<string | null>(null)

  const { data: leadStatus, isLoading } = useGetLeadStatus()

  const debouncedSearchValue = useDebounce(searchValue, 500)

  useEffect(() => {
    onSearch(debouncedSearchValue)
  }, [debouncedSearchValue, onSearch])

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handleStatusChange = (value: string | undefined) => {
    onStatusChange(value)
  }
  return (
    <ToolbarStyle className='lead'>
      <Button
        className='toolbar-create'
        icon={<FiPlusCircle />}
        onClick={onOpenCreate}
      >
        Create
      </Button>

      <Input
        className='toolbar-search-box'
        placeholder='Search by lead name & client name'
        allowClear
        suffix={<FiSearch style={{ fontSize: '20px', color: '#ccc' }} />}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <Select
        loading={isLoading}
        className='toolbar-select-box'
        placeholder='Select status'
        allowClear
        onChange={handleStatusChange}
        options={[
          {
            value: 1,
            label: 'Prospect'
          },
          {
            value: 2,
            label: 'Contacted'
          },
          {
            value: 3,
            label: 'Estimate'
          },
          {
            value: 4,
            label: 'Follow up'
          },
          {
            value: 5,
            label: 'Project received'
          }
        ]}
      ></Select>
    </ToolbarStyle>
  )
}

export { ToolbarLead }
