import React, { useEffect, useState } from 'react'

import { ToolbarTask } from '../../component/toolbar/toolbarTask'
import CrmPageLayout from '../layout'
import { MODE_VIEW } from './commom'
import TaskDetail from './detail/TaskDetail'
import TaskForm from './form/TaskForm'
import { TableContent } from './table'

import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetTaskDetail, useGetTaskList } from '../../api/reactQuery/Task'

import { SESSION_STORAGE_ITEM } from '../../constants/common'
import { KanbanTask } from './Kanban'
import { Task } from './Kanban/Types'

const TaskManagement: React.FC = () => {
  const [openTaskCreate, setOpenTaskCreate] = useState<boolean>(false)
  const [openTaskDetail, setOpenTaskDetail] = useState<boolean>(false)
  const [viewKanban, setViewKanban] = useState<string>(
    sessionStorage.getItem(SESSION_STORAGE_ITEM.MODE_VIEW_TASK) || 'list'
  )
  const [searchKeyword, setSearchKeyword] = useState<string | null>(null)
  const [filteredData, setFilteredData] = useState<any[]>([])

  const { taskId = null } = useParams()
  const navigate = useNavigate()

  const { data: taskDetail, isLoading: taskDetailLoading } =
    useGetTaskDetail(taskId)

  const { data: taskList, isLoading: taskListLoading } =
    useGetTaskList(viewKanban)

  const handleSearch = React.useMemo(() => {
    return (keyword: string) => {
      setSearchKeyword(keyword)
    }
  }, [])

  useEffect(() => {
    if (!taskDetailLoading && taskList) {
      const newFilteredData = taskList.data?.filter((item: any) => {
        const itemName = item.title?.replace(/\s+/g, ' ')
        const matchesSearch = searchKeyword
          ? itemName?.toLowerCase().includes(searchKeyword.toLowerCase())
          : true

        return matchesSearch
      })
      setFilteredData(newFilteredData)
    }
  }, [taskListLoading, taskList, searchKeyword])

  useEffect(() => {
    if (taskId) {
      setOpenTaskDetail(true)
    }
  }, [taskId])

  const handleCloseTaskDetail = () => {
    setOpenTaskDetail(false)
    if (taskId) {
      navigate('/tasks')
    }
  }

  const handleChangeModeView = (mode: string) => {
    sessionStorage.setItem(SESSION_STORAGE_ITEM.MODE_VIEW_TASK, mode)
    setViewKanban(mode)
  }

  const today = dayjs()
  const getDeadline = (task: any) =>
    task.deadline ? dayjs.unix(task.deadline).startOf('day') : null

  const sortTasksByDeadline = (tasksData: Task[]) => {
    const sortedTasks = tasksData?.sort((a: any, b: any) => {
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
  }

  return (
    <>
      <CrmPageLayout>
        <div className='layout-task-management'>
          <ToolbarTask
            onOpenCreate={() => setOpenTaskCreate(true)}
            onChangeModeView={handleChangeModeView}
            onSearch={handleSearch}
            viewKanban={viewKanban}
          />
          <div>
            {viewKanban === MODE_VIEW.KANBAN ? (
              <KanbanTask
                taskList={sortTasksByDeadline(filteredData)}
                isFetching={taskListLoading}
              />
            ) : (
              <TableContent
                taskList={filteredData}
                dataLoading={taskListLoading}
              />
            )}
          </div>
        </div>
      </CrmPageLayout>

      {openTaskCreate && (
        <TaskForm
          title='Create Task'
          visible={openTaskCreate}
          setVisible={setOpenTaskCreate}
        />
      )}

      {openTaskDetail && (
        <TaskDetail
          visible={openTaskDetail}
          onClose={handleCloseTaskDetail}
          taskDetail={taskDetail}
          taskDetailLoading={taskDetailLoading}
        />
      )}
    </>
  )
}

export default TaskManagement
