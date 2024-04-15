import { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'

import { ImageWithAuth } from '../../../component/getImageWithAuth/ImageWithAuth'
import TextWithTooltip from '../../../component/textWithTooltip'
import { BATCH_MAIL_STATUS } from '../../../constants/common'
import DefaultAvatar from '../../../resources/images/image-default.jpg'
import { CrmTable, CrmTableInnerStyle } from '../../../theme/crm.style'
import { sortDataBySendTime } from '../../../utils/SortData'
import { timestampToDateTime } from '../../../utils/convertTimestamp'
import TableDefaultLayout from '../../layout/tableLayout/defaultLayout'

type Props = {
  tableData: any
  loading: boolean
}
const TableDetailContent: React.FC<Props> = ({ tableData, loading }) => {
  const [pagination, setPagination] = useState<{ skip: number; take: number }>({
    skip: 0,
    take: 20
  })

  useEffect(() => {
    if (tableData?.length > 0) {
      setPagination({ ...pagination, skip: 0 })
    }
  }, [tableData])

  const columnsMailDetail: ColumnsType<any> = [
    {
      title: 'No.',
      className: 'table-first-col',
      render: (_, record, idx) => {
        return (
          <span className='table--numOfRow'>
            {!pagination.skip && idx < 9 && '0'}
            {!pagination.skip ? idx + 1 : idx + pagination.skip + 1}
          </span>
        )
      },
      width: 50
    },

    {
      title: 'Receiver',
      dataIndex: 'contact',

      render: (contact) => {
        const { fullname, avatar, email } = contact

        return (
          <div className='person-info'>
            <ImageWithAuth
              url={avatar?.url ? avatar.url : DefaultAvatar}
              preview={false}
            />
            <div style={{ width: '100%' }}>
              <span className='main-text'>
                <TextWithTooltip text={fullname} />
              </span>
              <div>
                <span className='sub-text'>
                  <TextWithTooltip text={email} />
                </span>
              </div>
            </div>
          </div>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: '25%',
      render: (status) => {
        return (
          <div
            className={`status ${
              status === -1 ? BATCH_MAIL_STATUS[0] : BATCH_MAIL_STATUS[status]
            }`}
          >
            {status === -1 ? BATCH_MAIL_STATUS[0] : BATCH_MAIL_STATUS[status]}
          </div>
        )
      }
    },
    {
      title: 'Send Time',
      dataIndex: 'send_time',
      width: '25%',
      render: (send_time) => {
        return <div className='sent_time'>{timestampToDateTime(send_time)}</div>
      }
    }
  ]

  const sortedData = sortDataBySendTime(tableData)

  const onChangePagination = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      skip: (page - 1) * pagination.take,
      take: pageSize
    })
  }

  return (
    <CrmTable>
      <CrmTableInnerStyle className='crm-table mail mail-detail'>
        <TableDefaultLayout
          columns={columnsMailDetail}
          rowKey={(record) => record.uuid}
          dataSource={sortedData}
          pageSize={pagination.take}
          onChangePagination={onChangePagination}
          total={sortedData?.length}
          loading={loading}
          current={pagination.skip / pagination.take + 1}
        />
      </CrmTableInnerStyle>
    </CrmTable>
  )
}

export { TableDetailContent }
