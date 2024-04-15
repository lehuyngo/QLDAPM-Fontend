import { Input } from 'antd'
import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useDebounce } from '../../hooks/useDebounce'
import { ToolbarStyle } from './styled'

type Props = {
  onSearch: any
}

const ToolbarMail: React.FC<Props> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState<string | null>(null)

  const debouncedSearchValue = useDebounce(searchValue, 500)

  useEffect(() => {
    onSearch(debouncedSearchValue)
  }, [debouncedSearchValue, onSearch])

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }
  return (
    <ToolbarStyle className='mail'>
      <Input
        className='toolbar-search-box'
        placeholder='Search by sender name'
        allowClear
        suffix={<FiSearch style={{ fontSize: '20px', color: '#ccc' }} />}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </ToolbarStyle>
  )
}

export { ToolbarMail }
