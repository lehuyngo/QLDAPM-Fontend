import { Input, Select } from 'antd'
import { FiSearch } from 'react-icons/fi'
import debounce from 'lodash/debounce'

import { PointTableToolbarStyle } from '../style'
interface PointTableToolbarProps {
  onSearch: (value: string) => void
  onSort: (value: string) => void
}

const PointTableToolbar = ({ onSearch, onSort }: PointTableToolbarProps) => {
  const debouncedSearch = debounce((value: string) => {
    onSearch(value)
  }, 500)

  const handleSearch = (value: string) => {
    debouncedSearch(value)
  }

  const handleSort = (value: string) => {
    onSort(value)
  }

  return (
    <PointTableToolbarStyle>
      <Input
        className='btn-search'
        placeholder='Search by name'
        allowClear
        suffix={<FiSearch style={{ fontSize: '20px', color: '#ccc' }} />}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Select
        className='btn-sort'
        defaultValue='1'
        onChange={(value) => handleSort(value)}
      >
        <Select.Option value='1'>Point: High to Low</Select.Option>
        <Select.Option value='2'>Point: Low to High</Select.Option>
      </Select>
    </PointTableToolbarStyle>
  )
}

export default PointTableToolbar
