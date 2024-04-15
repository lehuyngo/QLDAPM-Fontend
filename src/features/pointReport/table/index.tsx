import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'

import { IContact } from '../../../interfaces/IContact'
import PointTableToolbar from './PointTableToolbar'
import TableDefaultLayout from '../../layout/tableLayout/defaultLayout'
import { IPagination } from '../../../interfaces/IPagination'
import PointItem from './PointItem'
import EmptyData from '../../../component/emptyData'

import { CrmTable, CrmTableInnerStyle } from '../../../theme/crm.style'
import { PointListStyle } from '../style'
import { IContactPoint } from '../../../interfaces/IPoint'

function handleChangePagination(
  page: number,
  pageSize: number,
  pagination: IPagination,
  setPagination: React.Dispatch<React.SetStateAction<IPagination>>
) {
  setPagination({
    ...pagination,
    skip: (page - 1) * pagination.take,
    take: pageSize
  })
}

interface PointTableProps {
  filteredData: IContactPoint[] | []
  loading: boolean
  handleSearch: (val: string) => void
  handleSort: (val: string) => void
}

const PointTable: React.FC<PointTableProps> = ({
  filteredData,
  loading,
  handleSearch,
  handleSort
}) => {
  const [pagination, setPagination] = useState<IPagination>({
    skip: 0,
    take: 20
  })
  // const [searchKeyword, setSearchKeyword] = useState('')
  // const [sortPoint, setSortPoint] = useState<string>('1')
  // const [filteredData, setFilteredData] = useState<IContactPoint[]>(data)

  // //toolbar function
  // const handleSearch = React.useMemo(() => {
  //   return (keyword: string) => {
  //     setSearchKeyword(keyword)
  //   }
  // }, [])

  // const handleSort = React.useMemo(() => {
  //   return (keyword: string) => {
  //     setSortPoint(keyword)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (data) {
  //     const updatedFilteredData = data.filter((item: IContactPoint) => {
  //       const itemName = item.shortname || item.fullname
  //       const itemNameWithoutSpaces = itemName.replace(/\s+/g, ' ')

  //       const matchesSearch = itemNameWithoutSpaces
  //         ?.toLowerCase()
  //         ?.includes(searchKeyword.toLowerCase())

  //       return matchesSearch
  //     })

  //     if (sortPoint === '2') {
  //       updatedFilteredData.sort((a, b) => a.point - b.point)
  //     } else {
  //       updatedFilteredData.sort((a, b) => b.point - a.point)
  //     }

  //     setFilteredData(updatedFilteredData)
  //   }
  // }, [data, searchKeyword, sortPoint])

  const columnsCard: ColumnsType<any> = [
    {
      title: '',
      dataIndex: 'card',
      render: () => {
        return <></>
      }
    }
  ]

  useEffect(() => {
    if (filteredData?.length > 0) {
      setPagination({ ...pagination, skip: 0 })
    }
  }, [filteredData])

  return (
    <CrmTable className='point-report-table-management'>
      <PointTableToolbar onSearch={handleSearch} onSort={handleSort} />
      <CrmTableInnerStyle className='crm-table point-report'>
        {loading ? (
          <div
            style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
          >
            <Spin />
          </div>
        ) : filteredData?.length > 0 ? (
          <>
            <PointListStyle>
              {filteredData
                ?.slice(pagination.skip, pagination.skip + pagination.take)
                ?.map((item: any) => {
                  return <PointItem key={item.uuid} item={item} />
                })}
            </PointListStyle>
            <TableDefaultLayout
              className='crm-table'
              columns={columnsCard}
              rowKey={(record) => record.uuid}
              dataSource={filteredData}
              pageSize={pagination.take}
              onChangePagination={(page: number, pageSize: number) =>
                handleChangePagination(
                  page,
                  pageSize,
                  pagination,
                  setPagination
                )
              }
              total={filteredData?.length}
              loading={loading}
              current={pagination.skip / pagination.take + 1}
            />
          </>
        ) : (
          <EmptyData className='no-shadow' />
        )}
      </CrmTableInnerStyle>
    </CrmTable>
  )
}

export default PointTable
