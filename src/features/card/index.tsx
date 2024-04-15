import React, { useState } from 'react'

import CrmPageLayout from '../layout'
import { ToolbarCard } from '../../component/toolbar/toolbarCard'
import { TableContent } from './table'
import { useGetCardList } from '../../api/reactQuery/Card'

import { CardManagementWrapper } from './style'

const CardManagement = () => {
  const [searchKeyword, setSearchKeyword] = useState<string | null>(null)

  const {
    data: cardList,
    isLoading: cardLoading,
    isFetching: cardFetching
  } = useGetCardList()

  const handleSearch = React.useMemo(() => {
    return (keyword: string) => {
      setSearchKeyword(keyword)
    }
  }, [])

  let filteredData: any[] = []

  if (!cardLoading) {
    filteredData =
      cardList?.data?.filter((item: any) => {
        const itemName = item.client_name?.replace(/\s+/g, ' ')

        const matchesSearch = searchKeyword
          ? itemName?.toLowerCase().includes(searchKeyword.toLowerCase())
          : true

        return matchesSearch
      }) || []
  }

  return (
    <CrmPageLayout>
      <CardManagementWrapper>
        <ToolbarCard onSearch={handleSearch} />
        <TableContent
          tableData={filteredData}
          loading={cardLoading || cardFetching}
        />
      </CardManagementWrapper>
    </CrmPageLayout>
  )
}

export default CardManagement
