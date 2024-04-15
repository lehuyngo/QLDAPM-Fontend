import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Popover } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import { useDeleteTask } from '../../../api/reactQuery/Task'
import CustomShowAssignee from '../../../component/customShowTags/CustomShowAssignee'
import DeleteForm from '../../../component/deleteForm/DeleteForm'
import MoreAction from '../../../component/moreAction/moreAction'
import MoreActionPopup from '../../../component/moreAction/moreActionPopup'
import { NotificationCustom } from '../../../component/notification/Notification'
import TextWithTooltip from '../../../component/textWithTooltip'
import { useGetScreenWidth } from '../../../utils/FunctionsShare'
import { sortDataByCreatedTime } from '../../../utils/SortData'
import { timestampToDate } from '../../../utils/convertTimestamp'
import TableDefaultLayout from '../../layout/tableLayout/defaultLayout'
import { TASK_PRIORITY, TASK_STATUS } from '../commom'
import TaskFormEdit from '../form/TaskFormEdit'

import {
  CrmTaskPriority,
  CrmTaskStatus,
  CrmTaskTable
} from '../../../theme/crm.style'
interface TableContentProps {
  taskList: any
  dataLoading: boolean
}

const TableContent: React.FC<TableContentProps> = ({
  taskList,
  dataLoading
}) => {
  const [pagination, setPagination] = useState<{ skip: number; take: number }>({
    skip: 0,
    take: 20
  })
  const [openDeleteTask, setOpenDeleteTask] = useState<boolean>(false)
  const [openTaskEdit, setOpenTaskEdit] = useState<boolean>(false)
  const [taskSelect, setTaskSelect] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  const navigate = useNavigate()
  const SCREEN_WIDTH = useGetScreenWidth()
  const queryClient = useQueryClient()

  const { mutate: mutateDeleteTask } = useMutation({
    mutationFn: useDeleteTask
  })

  useEffect(() => {
    if (taskList?.length > 0) {
      setPagination({ ...pagination, skip: 0 })
    }
  }, [taskList])

  const handleDeleteTask = () => {
    setDeleteLoading(true)
    mutateDeleteTask(taskSelect, {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({ queryKey: ['GetTaskList'] })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The Task has been deleted successfully!'
        })
        setOpenDeleteTask(false)
        setDeleteLoading(false)
      },
      onError(error) {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        setDeleteLoading(false)
      }
    })
  }

  const onChangePagination = (page: number, pageSize: number) => {
    setPagination({
      ...pagination,
      skip: (page - 1) * pagination.take,
      take: pageSize
    })
  }

  const columnsTask: ColumnsType<any> = [
    {
      title: 'No.',
      className: 'table-first-col',
      align: 'center',
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
      key: 'more-action',

      render: (_, record) => {
        return SCREEN_WIDTH < 1280 ? (
          <Popover
            content={
              <MoreActionPopup
                onOpenMEdit={() => {
                  setOpenTaskEdit(true)
                  setTaskSelect(record?.uuid)
                }}
                onOpenMDelete={() => {
                  setOpenDeleteTask(true)
                  setTaskSelect(record?.uuid)
                }}
                // isDisabled={record.status === 4}
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
              setOpenTaskEdit(true)
              setTaskSelect(record?.uuid)
            }}
            onOpenMDelete={() => {
              setOpenDeleteTask(true)
              setTaskSelect(record?.uuid)
            }}
            // isDisabled={record.status === 4}
          />
        )
      }
    },

    {
      title: 'Task Name',
      dataIndex: 'title',
      width: '36%',
      render: (title, record) => {
        // const scope = record.project.projectName

        return (
          <div className='task-name-scope'>
            <div className='task-name'>{title}</div>
            <div className='task-scope'>
              <TextWithTooltip
                text={record.project?.shortname || record.project?.fullname}
              />
            </div>
          </div>
        )
      }
    },

    {
      title: 'Deadline',
      dataIndex: 'deadline',
      width: '10%',
      sorter: {
        compare: (a, b) => {
          if (a.deadline === undefined && b.deadline === undefined) {
            return 0
          }

          if (a.deadline === undefined) {
            return -1
          }

          if (b.deadline === undefined) {
            return 1
          }

          const dateA = dayjs(a.deadline)
          const dateB = dayjs(b.deadline)

          return dateA.diff(dateB)
        },
        multiple: 2
      },

      render: (date) => {
        return (
          date && <span className='task-deadline'>{timestampToDate(date)}</span>
        )
      }
    },

    {
      title: 'Status',
      dataIndex: 'status',

      width: '10%',

      render: (status) => (
        <CrmTaskStatus $status={status}>
          {TASK_STATUS[status - 1]}
        </CrmTaskStatus>
      )
    },

    {
      title: 'Priority',
      dataIndex: 'priority',

      width: 120,
      sorter: {
        compare: (a, b) => {
          const priorityA = a.priority || 0
          const priorityB = b.priority || 0

          return priorityA - priorityB
        },
        multiple: 1
      },

      render: (priority) => (
        <CrmTaskPriority $priority={priority}>
          <div className='priority-icon'></div>
          <div className='priority-name'>{TASK_PRIORITY[priority - 1]}</div>
        </CrmTaskPriority>
      )
    },

    {
      title: 'Assignees',
      dataIndex: 'assignees',
      // width: '20%',
      render: (assignees) => {
        return (
          assignees && (
            <CustomShowAssignee
              dataTags={assignees}
              isHideAvatar
              className='table-task-list'
            />
          )
        )
      }
    }
  ]

  return (
    <CrmTaskTable>
      <TableDefaultLayout
        className='crm-table'
        columns={columnsTask}
        rowKey={(record) => record.uuid}
        dataSource={sortDataByCreatedTime(taskList)}
        pageSize={pagination.take}
        onChangePagination={onChangePagination}
        total={taskList?.length}
        loading={dataLoading}
        current={pagination.skip / pagination.take + 1}
        onRow={(record: any) => {
          return {
            onClick: () => {
              navigate(`/tasks/${record?.uuid} `)
            }
          }
        }}
        setScrollY={260}
      />

      {openDeleteTask && (
        <DeleteForm
          visible={openDeleteTask}
          loading={deleteLoading}
          question='Do you want to delete this task?'
          onClose={() => setOpenDeleteTask(false)}
          onDelete={handleDeleteTask}
        />
      )}

      {openTaskEdit && (
        <TaskFormEdit
          title='Edit Task'
          visible={openTaskEdit}
          setVisible={setOpenTaskEdit}
          taskId={taskSelect}
        />
      )}
    </CrmTaskTable>
  )
}

export { TableContent }
