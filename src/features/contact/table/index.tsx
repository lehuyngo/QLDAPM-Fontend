import { Popover } from 'antd'
import { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import { ImageWithAuth } from '../../../component/getImageWithAuth/ImageWithAuth'
import MoreAction from '../../../component/moreAction/moreAction'
import MoreActionPopup from '../../../component/moreAction/moreActionPopup'
import TagsWrapper from '../../../component/tagsWrapper'
import TextWithTooltip from '../../../component/textWithTooltip'
import DefaultAvatar from '../../../resources/images/image-default.jpg'
import { CrmTable, CrmTableInnerStyle } from '../../../theme/crm.style'
import { useGetScreenWidth } from '../../../utils/FunctionsShare'
import { sortDataByActiveTime } from '../../../utils/SortData'
import {
  calculateTimeDifference,
  timestampToDate
} from '../../../utils/convertTimestamp'
import TableDefaultLayout from '../../layout/tableLayout/defaultLayout'

type Props = {
  onOpenCreateTag: () => void
  onOpenEditContact: () => void
  onOpenDeleteContact: () => void
  onOpenDeleteTag: (uuid: string) => void
  onSelect: any
  tableData: any
  loading: boolean
  onSelectedMultiUser: (data: any[]) => void
}

const TableContent: React.FC<Props> = ({
  onOpenCreateTag,
  onOpenEditContact,
  onOpenDeleteTag,
  onOpenDeleteContact,
  onSelect,
  tableData,
  loading,
  onSelectedMultiUser
}) => {
  const [pagination, setPagination] = useState<{ skip: number; take: number }>({
    skip: 0,
    take: 20
  })

  const navigate = useNavigate()
  const SCREEN_WIDTH = useGetScreenWidth()

  useEffect(() => {
    if (tableData?.length > 0) {
      setPagination({ ...pagination, skip: 0 })
    }
  }, [tableData])

  const columnsContact: ColumnsType<any> = [
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
      width: SCREEN_WIDTH < 1280 ? 40 : 120,

      render: (_, record) =>
        SCREEN_WIDTH < 1280 ? (
          <Popover
            content={
              <MoreActionPopup
                onOpenCreateTag={() => {
                  onOpenCreateTag()
                  onSelect(record?.uuid)
                }}
                onOpenMEdit={() => {
                  onOpenEditContact()
                  onSelect(record?.uuid)
                }}
                onOpenMDelete={() => {
                  onOpenDeleteContact()
                  onSelect(record?.uuid)
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
            onOpenCreateTag={() => {
              onOpenCreateTag()
              onSelect(record?.uuid)
            }}
            onOpenMEdit={() => {
              onOpenEditContact()
              onSelect(record?.uuid)
            }}
            onOpenMDelete={() => {
              onOpenDeleteContact()
              onSelect(record?.uuid)
            }}
          />
        )
    },

    {
      title: 'Contact Name',
      dataIndex: 'fullname',

      render: (fullname, record) => {
        const { code, email, avatar, tags = null, shortname } = record

        return (
          <div className='contact-name-code'>
            <ImageWithAuth
              url={avatar?.url ? avatar.url : DefaultAvatar}
              preview={false}
            />
            <div style={{ width: '100%' }}>
              <span className='contact-name-code--name'>
                <TextWithTooltip
                  text={`${shortname || fullname} ${code || ''}`}
                />
              </span>

              <div className='contact-info'>
                <span
                  style={{
                    fontSize: 12,
                    color: '#6d6d6d',
                    marginTop: 4,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {email}
                </span>

                {tags?.length > 0 && (
                  <TagsWrapper
                    dataTags={tags}
                    onDelete={(tagID: string) => {
                      onOpenDeleteTag(tagID)
                      onSelect(record?.uuid)
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )
      }
    },

    {
      title: 'Client Name',
      dataIndex: 'clients',
      width: '18%',
      render: (client) => {
        const names = client
          ?.map((item: any) => item.shortname || item.fullname)
          .join(', ')

        return (
          <div className='contact-connect-client-name'>
            <TextWithTooltip text={names} lineNumber={2} />
          </div>
        )
      }
    },

    {
      title: 'Date of birth',
      dataIndex: 'birthday',
      width: 110,
      align: 'center',
      render: (val) => {
        return (
          <span className='contact-birth'>
            {val ? timestampToDate(val) : ''}
          </span>
        )
      }
    },

    {
      title: 'Last Activities',
      dataIndex: 'last_active_time',
      width: 130,
      render: (active) => (
        <span className='contact-last-active'>
          {active ? calculateTimeDifference(active) : 'No info'}
        </span>
      )
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

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
    onSelectedMultiUser && onSelectedMultiUser(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  return (
    <CrmTable>
      <CrmTableInnerStyle className='crm-table contact'>
        <TableDefaultLayout
          columns={columnsContact}
          rowKey={(record) => record.uuid}
          dataSource={sortedData}
          pageSize={pagination.take}
          onChangePagination={onChangePagination}
          total={sortedData?.length}
          loading={loading}
          current={pagination.skip / pagination.take + 1}
          onRow={(record: any) => {
            return {
              onClick: (e: any) => {
                if (e.target?.cellIndex !== 0) {
                  navigate(`/contact/${record?.uuid} `)
                }
              }
            }
          }}
          rowSelection={rowSelection}
        />
      </CrmTableInnerStyle>
    </CrmTable>
  )
}

export { TableContent }
