import { Popover, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { FiLink, FiMoreVertical } from 'react-icons/fi'

import { ImageWithAuth } from '../../../component/getImageWithAuth/ImageWithAuth'
import MoreAction from '../../../component/moreAction/moreAction'
import MoreActionPopup from '../../../component/moreAction/moreActionPopup'
import TagsWrapper from '../../../component/tagsWrapper'
import TextWithTooltip from '../../../component/textWithTooltip'
import DefaultAvatar from '../../../resources/images/image-default.jpg'
import { CrmTable, CrmTableInnerStyle } from '../../../theme/crm.style'
import { useGetScreenWidth } from '../../../utils/FunctionsShare'
import { sortDataByActiveTime } from '../../../utils/SortData'
import { calculateTimeDifference } from '../../../utils/convertTimestamp'
import { isWebsiteHaveHttp } from '../../../utils/validate'
import TableDefaultLayout from '../../layout/tableLayout/defaultLayout'

type Props = {
  onOpenCreateTag: () => void
  onOpenDeleteTag: (uuid: string) => void
  onOpenEditClient: () => void
  onOpenDeleteClient: () => void
  onSelect: any
  tableData: any
  loading: boolean
}

const TableContent: React.FC<Props> = ({
  onOpenCreateTag,
  onOpenDeleteTag,
  onOpenEditClient,
  onOpenDeleteClient,
  onSelect,
  tableData,
  loading
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

  const columnsClient: ColumnsType<any> = [
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
                  onOpenEditClient()
                  onSelect(record?.uuid)
                }}
                onOpenMDelete={() => {
                  onOpenDeleteClient()
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
              onOpenEditClient()
              onSelect(record?.uuid)
            }}
            onOpenMDelete={() => {
              onOpenDeleteClient()
              onSelect(record?.uuid)
            }}
          />
        )
    },
    {
      title: 'Client Name - Code',
      dataIndex: 'fullname',
      render: (fullname, record: any) => {
        const { code, website, logo, tags = null, shortname } = record

        const linkWeb =
          website && isWebsiteHaveHttp(website)
            ? website
            : website
              ? `https://${website}`
              : null

        return (
          <div className='client-name-code'>
            <ImageWithAuth
              url={logo?.url ? logo.url : DefaultAvatar}
              preview={false}
            />
            <div style={{ width: '100%' }}>
              <span
                className='client-name-code--name'
                style={{ fontSize: 14, fontWeight: 700 }}
              >
                {linkWeb ? (
                  <a
                    className='client-web'
                    onClick={(e) => e.stopPropagation()}
                    href={linkWeb}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <Tooltip title={linkWeb}>{shortname || fullname}</Tooltip>
                  </a>
                ) : (
                  <TextWithTooltip text={`${shortname || fullname} `} />
                )}
              </span>

              <div className='client-info'>
                {code && <TextWithTooltip text={code} />}
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
      title: 'Contact Name',
      dataIndex: 'contacts',
      width: '20%',
      render: (contacts) => {
        const ContactsNames = contacts
          ?.map((item: any) => item.shortname || item.fullname)
          .join(', ')

        return (
          <div className='client-connect-lead-name'>
            <TextWithTooltip text={ContactsNames} lineNumber={2} />
          </div>
        )
      }
    },

    {
      title: 'Lead Name',
      dataIndex: 'projects',
      width: '20%',
      render: (projects) => {
        const leadNames = projects
          ?.map((item: any) => item.shortname || item.fullname)
          .join(', ')

        return (
          <div className='client-connect-lead-name'>
            <TextWithTooltip text={leadNames} lineNumber={2} />
          </div>
        )
      }
    },

    {
      title: 'Last Activites',
      dataIndex: 'last_active_time',
      width: 130,
      render: (active) => (
        <span className='client-last-active'>
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

  return (
    <CrmTable>
      <CrmTableInnerStyle className='crm-table client'>
        <TableDefaultLayout
          columns={columnsClient}
          rowKey={(record) => record.uuid}
          dataSource={sortedData}
          onChangePagination={onChangePagination}
          total={sortedData?.length}
          loading={loading}
          pageSize={pagination.take}
          current={pagination.skip / pagination.take + 1}
          onRow={(record: any) => {
            return {
              onClick: () => {
                navigate(`/client/${record?.uuid} `, {
                  state: { page: 'detail' }
                })
              }
            }
          }}
        />
      </CrmTableInnerStyle>
    </CrmTable>
  )
}

export { TableContent }
