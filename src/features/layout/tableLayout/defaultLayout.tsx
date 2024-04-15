import { Table } from 'antd'
import React from 'react'

interface TableProps {
  columns: object[]
  dataSource: object[] | []
  pageSize?: number
  loading?: boolean
  rowKey?: (record: any) => string
  onChangePagination?: (page: number, pageSize: number) => void
  current?: number
  total?: number
  onRow?: any
  className?: string
  rowSelection?: any
  setScrollY?: number
  pageSizeOptions?: number[]
  rowClassName?: any
}
const TableDefaultLayout: React.FC<TableProps> = ({
  columns,
  dataSource,
  pageSize,
  loading,
  rowKey,
  onChangePagination,
  current,
  total,
  onRow,
  className,
  rowSelection,
  setScrollY = 254,
  pageSizeOptions,
  rowClassName
}) => {
  return (
    <Table
      className={className}
      columns={columns}
      rowKey={rowKey}
      dataSource={dataSource || []}
      pagination={{
        pageSize: pageSize || 20,
        onChange: onChangePagination,
        current: current || 1,
        defaultCurrent: 1,
        total: total || 0,
        showSizeChanger: true,
        pageSizeOptions: pageSizeOptions || [10, 20, 50, 100]
      }}
      loading={loading}
      onRow={onRow}
      rowSelection={rowSelection || null}
      scroll={{ y: window.innerHeight - setScrollY }}
      rowClassName={rowClassName && rowClassName}
    />
  )
}

export default TableDefaultLayout
