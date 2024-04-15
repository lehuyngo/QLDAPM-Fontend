import { Spin } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { useGetTaskDetail, useGetTaskList } from '../../../api/reactQuery/Task'
import TextWithTooltip from '../../../component/textWithTooltip'
import { timestampToDate } from '../../../utils/convertTimestamp'
import TaskDetail from '../../task/detail/TaskDetail'

function TaskList() {
  const [isOpeningToViewTask, setOpeningToViewTask] = useState<boolean>(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [sortedTasks, setSortedTasks] = useState<any>()

  const { data: taskList, isLoading: getTaskLoading } = useGetTaskList()
  const { data: taskDetail, isLoading: taskDetailLoading } =
    useGetTaskDetail(taskId)

  const today = dayjs()
  const getDeadline = (task: any) =>
    task.deadline ? dayjs.unix(task.deadline).startOf('day') : null

  useEffect(() => {
    if (taskList?.data) {
      setSortedTasks((prevSortedTasks: any) => {
        const taskNoteDone = taskList?.data?.filter(
          (task: any) => task.status !== 4
        )

        const sortedTasks = [...taskNoteDone]?.sort((a, b) => {
          const deadlineA = getDeadline(a)
          const deadlineB = getDeadline(b)

          if (deadlineA && deadlineB) {
            if (deadlineA.isSame(deadlineB)) {
              return a.priority - b.priority
            } else if (
              deadlineA.isSame(today, 'day') &&
              !deadlineB.isSame(today, 'day')
            ) {
              return -1
            } else if (
              !deadlineA.isSame(today, 'day') &&
              deadlineB.isSame(today, 'day')
            ) {
              return 1
            } else if (deadlineA.isAfter(today) && deadlineB.isAfter(today)) {
              return deadlineA.diff(deadlineB)
            } else if (deadlineA.isBefore(today) && deadlineB.isBefore(today)) {
              return deadlineB.diff(deadlineA)
            } else {
              return deadlineA.isAfter(today) ? -1 : 1
            }
          } else {
            return deadlineA ? -1 : 1
          }
        })
        return sortedTasks
      })
    }
  }, [taskList])

  const todayForGetTaskDeadline = dayjs().format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

  return (
    <>
      <div className='task-list'>
        <div className='task-list-header'>
          <span
            style={{
              display: 'block',
              width: 14,
              height: 24,
              background: '#B5E4CA',
              marginRight: 8,
              borderRadius: 4
            }}
          ></span>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Task List</span>
        </div>
        <div className='task-list-items'>
          {getTaskLoading ? (
            <Spin />
          ) : (
            sortedTasks?.map((item: any) => {
              const filteredTasks = sortedTasks?.filter((task: any) => {
                const taskDate = dayjs.unix(task.deadline).format('YYYY-MM-DD')
                return (
                  taskDate === todayForGetTaskDeadline || taskDate === tomorrow
                )
              })

              const isDeadline = filteredTasks?.includes(item)

              return (
                <div
                  className={`task-list-item ${
                    isDeadline ? 'deadline-background' : ''
                  }`}
                  key={item.uuid}
                  onClick={() => {
                    setTaskId(item.uuid)
                    setOpeningToViewTask(true)
                  }}
                >
                  <span className='task-list-item--content'>
                    <TextWithTooltip text={item.title} />
                  </span>
                  <span className='task-list-item--time'>
                    {item.deadline && timestampToDate(item.deadline)}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {isOpeningToViewTask && (
        <TaskDetail
          visible={isOpeningToViewTask}
          onClose={() => setOpeningToViewTask(false)}
          taskDetail={taskDetail}
          taskDetailLoading={taskDetailLoading}
        />
      )}
    </>
  )
}

export default TaskList
