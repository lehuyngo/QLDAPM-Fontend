import { Input } from 'antd'
import { ToolbarStyle } from './styled'
import { useGetTags } from '../../api/reactQuery/Tag'
import { FiSearch } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { useGetContactReport } from '../../api/reactQuery/Contact'

type Props = {
  onSearch: any
}

const ToolbarCard: React.FC<Props> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState<string | null>(null)

  const debouncedSearchValue = useDebounce(searchValue, 500)
  const { data: cardReport, isLoading } = useGetContactReport()
  const {
    total = 0,
    resolved = 0,
    processing = 0
  } = !isLoading && cardReport ? cardReport : {}

  useEffect(() => {
    onSearch(debouncedSearchValue)
  }, [debouncedSearchValue, onSearch])

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  return (
    <ToolbarStyle className='card'>
      <Input
        className='toolbar-search-box'
        placeholder='Search by card name'
        allowClear
        suffix={<FiSearch style={{ fontSize: '20px', color: '#ccc' }} />}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className='total-card number'>
        <div className='text'>Total Card</div>
        <div className='value'>{total}</div>
      </div>
      <div className='resolved number'>
        <div className='text'>Resolved</div>
        <div className='value'>{resolved}</div>
      </div>
      <div className='remained number'>
        <div className='text'>Remained</div>
        <div className='value'>{processing}</div>
      </div>
    </ToolbarStyle>
  )
}

export { ToolbarCard }
