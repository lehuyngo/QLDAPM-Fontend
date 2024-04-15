import type { TableColumnsType } from 'antd'
import { Table, Tooltip } from 'antd'
import DOMPurify from 'dompurify'
import React, { useEffect, useState } from 'react'
import { FiPlusCircle, FiStar } from 'react-icons/fi'
import styled from 'styled-components'

import { useGetThreadActivity } from '../../../api/reactQuery/ThreadActive'
import AddActive from '../../../component/pointForm'
import { timestampToDate } from '../../../utils/convertTimestamp'
import ActiveTimeLine from './ActiveTimeLine'
import { sortActivityThread } from '../../../utils/SortData'

interface ContactPointProps {
  contactId: string | null
}

interface DataType {
  key: number
  name: string
  started_at: number
  point: number
  note: string
  uuid: string
  total_point: number
  thread_active: {
    label: string
    children: React.ReactNode
  }[]
}

interface Activity {
  uuid: string
  point_config: {
    uuid: string
    name: string
    point: number
  }
  trace_uuid: string
  started_at: number
  note: string
  created_time: number
}

const ContactPoint: React.FC<ContactPointProps> = ({ contactId }) => {
  const [isOpenAddActive, setIsOpenAddActive] = useState<boolean>(false)
  const [traceUuid, setTraceUuid] = useState<string | null>(null)
  const [dataShorted, setDataShorted] = useState([])
  const sanitizer = DOMPurify.sanitize

  const { data: dataThreadActivity, isLoading } = useGetThreadActivity({
    contactId
  })

  useEffect(() => {
    if (!isLoading && dataThreadActivity?.data) {
      const dataShorted: any = sortActivityThread(dataThreadActivity.data)
      setDataShorted(dataShorted)
    } else {
      setDataShorted([])
    }
  }, [dataThreadActivity, isLoading, contactId])

  const myData: DataType[] = []

  dataShorted?.forEach((trace: any) => {
    const parentActivity = trace.activities.find(
      (activity: Activity) => activity.uuid === trace.trace_id
    )

    if (parentActivity) {
      const parent: DataType = {
        key: myData.length + 1,
        name: parentActivity.point_config.name,
        started_at: parentActivity.started_at,
        point: parentActivity.point_config?.point,
        note: parentActivity.note,
        uuid: parentActivity.uuid,
        total_point: 0,
        thread_active: []
      }

      trace.activities?.forEach((activity: Activity) => {
        parent.total_point += activity.point_config?.point

        if (activity.uuid !== trace.trace_id) {
          parent.thread_active.push({
            label: timestampToDate(activity.started_at),
            children: (
              <div className='activity-item'>
                {/* <Tooltip title={activity.note}> */}

                <span className='activity-item--name'>
                  {activity.point_config?.name}
                </span>
                <span className='activity-item--point'>
                  {activity.point_config?.point} Point
                </span>
                {activity.note && (
                  <div
                    className='activity-item--note'
                    dangerouslySetInnerHTML={{
                      __html: sanitizer(activity.note)
                    }}
                  />
                )}

                {/* </Tooltip> */}
              </div>
            )
          })
        }
      })

      myData.push(parent)
    }
  })

  const columns: TableColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',

      render: (val, record) => {
        return (
          <div className='row-container'>
            <Tooltip
              title={
                record.note ? (
                  <div
                    className='tooltip-activity-item--note'
                    dangerouslySetInnerHTML={{
                      __html: sanitizer(record.note)
                    }}
                  />
                ) : null
              }
            >
              <div className='active-title'>
                <div className='active-title-info'>
                  <span className='active-title--icon'></span>
                  <span className='active-title--name'>{record.name}</span>
                  <span className='active-title--point'>
                    {record.point} Point
                  </span>
                </div>
                <div className='active-time'>
                  <span className='active-time--text'>Start at:</span>
                  {timestampToDate(record.started_at)}
                </div>
              </div>
            </Tooltip>

            <div className='active-point'>
              <FiStar className='active-point--icon' />
              <span className='active-point--text'>
                {record.total_point} Point
              </span>
              <FiPlusCircle
                onClick={(e) => {
                  setIsOpenAddActive(!isOpenAddActive)
                  e.stopPropagation()
                  setTraceUuid(record.uuid)
                }}
                className='add-active--icon'
              />
            </div>
          </div>
        )
      }
    }
  ]

  return (
    <>
      <ContactPointStyled
        loading={isLoading}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <ActiveTimeLine dataActive={record.thread_active} />
          ),
          rowExpandable: (record) => record.thread_active?.length > 0,
          expandRowByClick: true
        }}
        dataSource={myData}
        rowClassName={(record) =>
          record.thread_active?.length > 0 ? 'cursor-pointer' : ''
        }
        pagination={false}
      />
      {isOpenAddActive && (
        <AddActive
          visible={isOpenAddActive}
          onClose={() => setIsOpenAddActive(!isOpenAddActive)}
          contactId={contactId}
          traceUuid={traceUuid}
        />
      )}
    </>
  )
}

export default ContactPoint

const ContactPointStyled = styled(Table)`
  .ant-table-thead {
    display: none;
  }

  .ant-table-cell {
    padding: 12px !important;
  }

  .row-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .active-title {
      flex: 1;
      .active-title-info {
        padding-bottom: 4px;

        .active-title--icon {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: #3b5bd5;
          border-radius: 50%;
          margin-right: 8px;
        }

        .active-title--name {
          font-size: 14px;
          font-weight: 700;
          margin-right: 12px;
        }

        .active-title--point {
          padding: 4px 8px;
          background: #fef8ec;
          color: #fc7634;
        }
      }

      .active-time {
        .active-time--text {
          margin: 0px 8px 0px 16px;
          font-weight: 700;
        }
      }
    }

    .active-point {
      display: flex;
      align-items: center;
      gap: 4px;

      .active-point--icon {
        border: 1px solid #ffc700;
        fill: #ffc700;
        color: #ffc700;
        padding: 2px;
        border-radius: 50rem;
        font-size: 20px;
      }

      .add-active--icon {
        margin-left: 12px;
        color: #3b5bd5;
        font-size: 24px;
        cursor: pointer;
      }
    }
  }

  .ant-table-expanded-row {
    .ant-table-cell {
      padding-bottom: 0px !important;
    }
  }

  .ant-timeline {
    padding-top: 8px;

    .ant-timeline-item {
      padding-bottom: 12px;

      .ant-timeline-item-label {
        width: calc(20% - 12px);
      }

      .ant-timeline-item-tail {
        inset-inline-start: 22%;
      }

      .ant-timeline-item-head-blue {
        inset-inline-start: 22%;
      }

      .ant-timeline-item-content {
        min-height: unset;
        inset-inline-start: 22%;
        width: calc(72% - 12px);
      }

      .ant-timeline-item-last {
        padding-bottom: unset;
      }
    }

    .activity-item {
      .activity-item--name {
        margin-right: 12px;
      }

      .activity-item--point {
        padding: 4px 8px;
        background: #fef8ec;
        color: #fc7634;
      }

      .activity-item--note {
        font-size: 12px;
        color: #999;
      }
    }
  }
`
