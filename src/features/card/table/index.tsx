import type { ColumnsType } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'

import EmptyData from '../../../component/emptyData'
import TableDefaultLayout from '../../layout/tableLayout/defaultLayout'
import { sortDataByActiveTime } from '../../../utils/SortData'
import CardItem from './CardItem'

import { CrmTable, CrmTableInnerStyle } from '../../../theme/crm.style'
import { CardListStyle } from '../style'

type Props = {
  tableData: any
  loading: boolean
}

const TableContent: React.FC<Props> = ({ tableData, loading }) => {
  const [pagination, setPagination] = useState<{ skip: number; take: number }>({
    skip: 0,
    take: 12
  })

  useEffect(() => {
    if (tableData?.length > 0) {
      setPagination({ ...pagination, skip: 0 })
    }
  }, [tableData])

  const columnsCard: ColumnsType<any> = [
    {
      title: '',
      dataIndex: 'card',
      render: () => {
        return <></>
      }
    }
  ]

  const sortedData = sortDataByActiveTime(tableData)

  const onChangePagination = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      skip: (page - 1) * pagination.take,
      take: pageSize
    })
  }

  return (
    <CrmTable className='card-table-management'>
      <CrmTableInnerStyle className='crm-table card'>
        {loading ? (
          <div
            style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
          >
            <Spin />
          </div>
        ) : tableData?.length > 0 ? (
          <>
            <CardListStyle>
              {sortedData
                ?.slice(pagination.skip, pagination.skip + pagination.take)
                ?.map((item: any) => {
                  return <CardItem key={item.uuid} item={item} />
                })}
            </CardListStyle>
            <TableDefaultLayout
              className='crm-table'
              columns={columnsCard}
              rowKey={(record) => record.uuid}
              onChangePagination={onChangePagination}
              dataSource={sortedData}
              total={sortedData?.length}
              pageSize={pagination.take}
              current={pagination.skip / pagination.take + 1}
              pageSizeOptions={[12, 24, 48]}
            />
          </>
        ) : (
          <EmptyData className='no-shadow' />
        )}
      </CrmTableInnerStyle>
    </CrmTable>
  )
}

export { TableContent }
