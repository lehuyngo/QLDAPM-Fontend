import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar, Badge, Tooltip } from 'antd'
import React, { useRef, useState } from 'react'
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd'
import { FiCalendar, FiTrash } from 'react-icons/fi'

import {
  useDeleteTask,
  useTaskChangeStatus
} from '../../../api/reactQuery/Task'
import ImageDefault from '../../../resources/images/image-default.jpg'
import { timestampToDate } from '../../../utils/convertTimestamp'
import { COLUMN_NAME, COLUMN_NAMES } from './Constants'
import { MovableTaskProps, Task } from './Types'
import dayjs from 'dayjs'
import { PRIORITY } from '../commom'
import TextWithTooltip from '../../../component/textWithTooltip'
import { NotificationCustom } from '../../../component/notification/Notification'
import DeleteForm from '../../../component/deleteForm/DeleteForm'

const MovableTask: React.FC<MovableTaskProps> = ({
  name,
  index,
  currentColumnName,
  moveCardHandler,
  setItems,
  task,
  onclick
}) => {
  const [openDeleteTask, setOpenDeleteTask] = useState<boolean>(false)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  const ref = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { mutate: mutateUpdateTask } = useMutation({
    mutationFn: useTaskChangeStatus
  })
  const { mutate: mutateDeleteTask } = useMutation({
    mutationFn: useDeleteTask
  })

  const handleDeleteTask = () => {
    setDeleteLoading(true)
    mutateDeleteTask(task.uuid, {
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

  const changeItemColumn = (currentItem: any, columnName: string | number) => {
    if (currentItem.currentColumnName === columnName) {
      return
    } else {
      setItems((prevState: Task[]) => {
        return prevState.map((e) => {
          return {
            ...e,
            status: e.uuid === currentItem?.task?.uuid ? columnName : e.status
          }
        })
      })

      const dataUpdate = {
        taskId: currentItem.task.uuid,
        status: { status: columnName }
      }
      mutateUpdateTask(dataUpdate, {
        onSuccess(data, variables, context) {}
      })
    }
  }

  const [, drop] = useDrop({
    accept: 'Our first type',
    hover(item: any, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset: any = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveCardHandler && moveCardHandler(dragIndex, hoverIndex)

      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'Our first type',
    item: { task, currentColumnName, type: 'Our first type' },
    // canDrag: currentColumnName !== 4,
    end: (item: any, monitor) => {
      const dropResult = monitor.getDropResult()

      if (dropResult) {
        const { name }: any = dropResult
        const { TODO, DOING, TESTING, DONE } = COLUMN_NAMES
        switch (name) {
          case COLUMN_NAME[DOING]:
            changeItemColumn(item, DOING)
            break
          case COLUMN_NAME[TESTING]:
            changeItemColumn(item, TESTING)
            break
          case COLUMN_NAME[DONE]:
            changeItemColumn(item, DONE)
            break
          case COLUMN_NAME[TODO]:
            changeItemColumn(item, TODO)
            break
          default:
            break
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const { assignees, deadline, priority, status } = task || {}

  const formatDeadline = deadline && dayjs.unix(deadline).startOf('day')

  const getBackgroundColorByDeadline = () => {
    if (status !== 4 && formatDeadline) {
      const today = dayjs().startOf('day')
      const daysUntilDeadline = formatDeadline.diff(today, 'days')

      if (daysUntilDeadline < 0) {
        return 'miss-deadline'
      } else if (daysUntilDeadline < 3) {
        return 'at-deadline'
      }
    }

    return ''
  }

  const opacity = isDragging ? 0.7 : 1

  drag(drop(ref))

  const priorityValue = PRIORITY[priority as keyof typeof PRIORITY]
  return (
    <>
      <div
        onClick={(e: any) => {
          onclick(task.uuid)
        }}
        ref={ref}
        className={`movable-item ${getBackgroundColorByDeadline()} `}
        style={{ opacity }}
      >
        <div
          className='trash-icon'
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setOpenDeleteTask(true)
          }}
        >
          <FiTrash />
        </div>
        <p className='task-title'>
          {TextWithTooltip({ text: name, lineNumber: 2 })}
        </p>
        {deadline && (
          <p>
            <FiCalendar /> {timestampToDate(deadline)}
          </p>
        )}
        {priorityValue && (
          <Badge
            style={{ color: priorityValue.color }}
            color={priorityValue.color}
            text={priorityValue.label}
          />
        )}

        <div className='assignee-wrapper'>
          {assignees?.slice(0, 1).map((user: any, index: number) => (
            <div className='assignee-first-user' key={index}>
              <Avatar size={'small'} src={user.avatar || ImageDefault} />
              &nbsp; {user.displayname}
            </div>
          ))}
          {assignees && assignees.length > 2 && (
            <Tooltip
              title={
                <ul>
                  {assignees.slice(1).map((assignee: any) => (
                    <li key={assignee.uuid}>
                      <Avatar
                        size={24}
                        style={{ marginRight: 8 }}
                        src={assignee.avatar || ImageDefault}
                      />
                      {assignee.displayname}
                    </li>
                  ))}
                </ul>
              }
              placement='bottom'
            >
              <div className='assignee-wrapper--more'>
                +{assignees.length - 1}
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      {openDeleteTask && (
        <DeleteForm
          visible={openDeleteTask}
          loading={deleteLoading}
          question='Do you want to delete this task?'
          onClose={() => setOpenDeleteTask(false)}
          onDelete={handleDeleteTask}
        />
      )}
    </>
  )
}

export default MovableTask
