import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Badge, Popover } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import { useDeleteLead } from '../../../api/reactQuery/Lead'
import DeleteForm from '../../../component/deleteForm/DeleteForm'
import MoreAction from '../../../component/moreAction/moreAction'
import MoreActionPopup from '../../../component/moreAction/moreActionPopup'
import { NotificationCustom } from '../../../component/notification/Notification'
import TextWithTooltip from '../../../component/textWithTooltip'
import { CrmTable, CrmTableInnerStyle } from '../../../theme/crm.style'
import { useGetScreenWidth } from '../../../utils/FunctionsShare'
import { sortDataByActiveTime } from '../../../utils/SortData'
import { timestampToDateTime } from '../../../utils/convertTimestamp'
import { getStatusDetails } from '../../../utils/getLeadStatus'
import TableDefaultLayout from '../../layout/tableLayout/defaultLayout'
import LeadFormEdit from '../form/LeadFormEdit'

interface tableData {
  leadList: any
  loading: boolean
}

const TableContent: React.FC<tableData> = ({ leadList, loading }) => {
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false)
  const [isEditLead, setIsEditLead] = useState(false)
  const [leadSelected, setLeadSelected] = useState<string | null>(null)
  const [pagination, setPagination] = useState<{ skip: number; take: number }>({
    skip: 0,
    take: 20
  })
  const [oldData, setOldData] = useState(null)

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const SCREEN_WIDTH = useGetScreenWidth()

  useEffect(() => {
    if (leadList?.length > 0) {
      setPagination({ ...pagination, skip: 0 })
    }
  }, [leadList])

  const { mutate: mutateCreateLead } = useMutation({
    mutationFn: useDeleteLead
  })

  const handleDelete = (onChangeLoading: any) => {
    onChangeLoading(true)
    mutateCreateLead(leadSelected, {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ['GetLeadList'] })
        queryClient.invalidateQueries({ queryKey: ['GetTaskList'] })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The lead has been deleted successfully!'
        })
        onChangeLoading(false)
        setIsOpenDelete(false)
      },
      onError: (error: any) => {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        onChangeLoading(false)
      }
    })
  }

  const columns: ColumnsType<any> = [
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
      title: SCREEN_WIDTH < 1280 ? '' : 'Action',
      width: SCREEN_WIDTH < 1280 ? 40 : 100,

      render: (_: any, record: any) =>
        SCREEN_WIDTH < 1280 ? (
          <Popover
            content={
              <MoreActionPopup
                onOpenMEdit={() => {
                  setLeadSelected(record?.uuid)
                  setIsEditLead(true)
                  setOldData(record)
                }}
                onOpenMDelete={() => {
                  setLeadSelected(record?.uuid)
                  setIsOpenDelete(true)
                }}
              />
            }
            trigger={['hover']}
            placement='right'
          >
            <div
              className='icon-more-actions'
              onClick={(e) => e.stopPropagation()}
            >
              <FiMoreVertical style={{ fontSize: '16px', color: '#999' }} />
            </div>
          </Popover>
        ) : (
          <MoreAction
            onOpenMEdit={() => {
              setLeadSelected(record?.uuid)
              setIsEditLead(true)
              setOldData(record)
            }}
            onOpenMDelete={() => {
              setLeadSelected(record?.uuid)
              setIsOpenDelete(true)
            }}
          />
        )
    },
    {
      title: 'Lead Name',
      className: 'lead-name',
      dataIndex: 'shortname',

      render: (name: string, record: any) => {
        return (
          <div>
            <span className='lead-name--name'>
              <TextWithTooltip text={name || record.fullname} />
            </span>

            {record.last_meeting_start_time &&
              dayjs(record.last_meeting_start_time).isValid() && (
                <p className='lead-name--meeting'>
                  {`Meting at ${timestampToDateTime(
                    record.last_meeting_start_time
                  )}`}
                </p>
              )}
          </div>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'project_status',
      render: (val: any) => {
        const { name, color } = getStatusDetails(val)

        return (
          <Badge
            color={color}
            text={
              <span
                style={{
                  color: color
                }}
              >
                {name}
              </span>
            }
          />
        )
      },

      width: 140
    },
    {
      title: 'Client Name',
      dataIndex: 'client',
      width: '20%',
      render: (val: any) => {
        return (
          <span className='table-client-name'>
            <TextWithTooltip text={val?.shortname || val?.fullname} />
          </span>
        )
      }
    },
    {
      title: 'Contact Name',
      dataIndex: 'contacts',
      width: '20%',
      render: (val: any) => {
        const names = val
          ?.map((item: any) => item.shortname || item.fullname)
          .join(', ')

        return (
          <span className='table-contact-name'>
            <TextWithTooltip text={names} lineNumber={2} />
          </span>
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
    <CrmTable>
      <CrmTableInnerStyle className='crm-table lead'>
        <TableDefaultLayout
          columns={columns}
          rowKey={(record) => record.uuid}
          dataSource={sortDataByActiveTime(leadList)}
          pageSize={pagination.take}
          onChangePagination={onChangePagination}
          total={sortDataByActiveTime(leadList)?.length}
          loading={loading}
          current={pagination.skip / pagination.take + 1}
          onRow={(record: any) => {
            return {
              onClick: () => {
                navigate(`/lead/${record?.uuid} `, {
                  state: { page: 'detail' }
                })
              }
            }
          }}
        />
      </CrmTableInnerStyle>
      {isEditLead && (
        <LeadFormEdit
          visible={isEditLead}
          title={'Edit Lead'}
          onCloseModal={() => setIsEditLead(false)}
          isCreate={false}
          oldData={oldData}
        />
      )}
      {isOpenDelete && (
        <DeleteForm
          visible={isOpenDelete}
          onClose={() => setIsOpenDelete(false)}
          onDelete={handleDelete}
          question={
            <span>
              Do you want to delete this lead?
              <br />
              All meeting notes will also be deleted!
            </span>
          }
        />
      )}
    </CrmTable>
  )
}

export { TableContent }
