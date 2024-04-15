import { Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { PATH } from '../../constants/common'
import { CrmTable, CrmTableInnerStyle } from '../../theme/crm.style'
import { sortDataByReadTime } from '../../utils/SortData'
import { timestampToDateTime } from '../../utils/convertTimestamp'
import DetailsEmail from '../contact/mailForm/DetailsEmail'
import TableDefaultLayout from '../layout/tableLayout/defaultLayout'
import { TableProps } from './types'

const TableBoardMail: React.FC<TableProps> = ({ tableData, loading }) => {
  const [pagination, setPagination] = useState<{ skip: number; take: number }>({
    skip: 0,
    take: 5
  })
  const [openMDetailsEmail, setOPpenMDetailsEmail] = useState<boolean>(false)
  const [mailId, setMailId] = useState<string | null>(null)
  const [receiver, setReceiver] = useState<string | null>(null)
  const [isBatchMail, setIsBatchMail] = useState<boolean>(false)

  useEffect(() => {
    if (tableData?.length > 0) {
      setPagination({ ...pagination, skip: 0 })
    }
  }, [tableData])

  const handleCancelDetailsEmail = () => {
    setOPpenMDetailsEmail(false)
  }

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
      dataIndex: 'receiver',
      className: 'cursor-pointer',
      render: (val: any) => {
        return (
          <Link to={`${PATH.CONTACT_DETAIL.replace(':contactID', val.uuid)}`}>
            {val?.fullname}
          </Link>
        )
      }
    },
    {
      title: 'Sender',
      dataIndex: 'sender',
      render: (val: any) => {
        return val?.displayname
      }
    },
    {
      title: 'Read time',
      dataIndex: 'read_time',
      render: (val: any) => {
        return timestampToDateTime(val)
      }
    },
    {
      title: 'Send Time',
      dataIndex: 'send_time',
      render: (val: any) => {
        return timestampToDateTime(val)
      }
    },
    {
      title: 'Url',
      dataIndex: 'url',
      // className: 'cursor-pointer',

      render: (val: any) => {
        const truncatedSubject =
          val.length > 20 ? val.substring(0, 20) + '...' : val

        return <Tooltip title={val}>{truncatedSubject}</Tooltip>
      }
    },
    {
      title: 'Mail',
      dataIndex: 'mail',
      className: 'cursor-pointer',
      // sorter: (a, b) => {
      //   const aMailSubject = a.mail.subject.toLowerCase()
      //   const bMailSubject = b.mail.subject.toLowerCase()
      //   const aBatchMailSubject = a.batch_mail.subject.toLowerCase()
      //   const bBatchMailSubject = b.batch_mail.subject.toLowerCase()

      //   // Compare mail.subject and batch_mail.subject
      //   if (aMailSubject !== bMailSubject) {
      //     return aMailSubject.localeCompare(bMailSubject)
      //   } else {
      //     return aBatchMailSubject.localeCompare(bBatchMailSubject)
      //   }
      // },

      render: (val: any, record: any) => {
        const useValue = val ? val : record.batch_mail

        const truncatedSubject =
          useValue.subject.length > 40
            ? useValue.subject.substring(0, 40) + '...'
            : useValue.subject

        return (
          <Tooltip title={useValue.subject}>
            <span
              className='title-mail'
              onClick={() => {
                setOPpenMDetailsEmail(true)
                setMailId(useValue.uuid)

                if (record.batch_mail) {
                  setIsBatchMail(true)
                  setReceiver(record.receiver?.uuid)
                } else {
                  setIsBatchMail(false)
                  setReceiver(null)
                }
              }}
            >
              {truncatedSubject}
            </span>
          </Tooltip>
        )
      }
    }
  ]

  const onChangePagination = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      skip: (page - 1) * pagination.take,
      take: pageSize
    })
  }

  return (
    <CrmTable className='mail-dashboard-table-management'>
      <CrmTableInnerStyle>
        <TableDefaultLayout
          className='table-board-mail'
          columns={columnsMailDetail}
          rowKey={(record) => record.uuid}
          dataSource={sortDataByReadTime(tableData)}
          pageSize={pagination.take}
          onChangePagination={onChangePagination}
          total={tableData?.length}
          loading={loading}
          current={pagination.skip / pagination.take + 1}
          setScrollY={-5000}
          pageSizeOptions={[5, 10, 20, 50, 100]}
        />
      </CrmTableInnerStyle>

      {openMDetailsEmail && (
        <DetailsEmail
          isOpen={openMDetailsEmail}
          onCloseModal={handleCancelDetailsEmail}
          mailId={mailId}
          receiverId={receiver}
          isBatch={isBatchMail}
        />
      )}
    </CrmTable>
  )
}

export { TableBoardMail }
