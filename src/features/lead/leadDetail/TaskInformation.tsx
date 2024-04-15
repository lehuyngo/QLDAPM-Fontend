// External dependencies
import { Select, Spin } from 'antd'
import React, { useState } from 'react'
import { FiPlusCircle } from 'react-icons/fi'

// Internal dependencies
import { StyledSelect } from '../../../component/componentOfForm/ComponentOfForm.style'
import EmptyData from '../../../component/emptyData'
import TextWithTooltip from '../../../component/textWithTooltip'
import { useLeadDetailContext } from '../../../hooks/useLeadDetailContext'
import { ITask } from '../../../interfaces/ITask'
import { sortDataByCreatedTime } from '../../../utils/SortData'
import { timestampToDate } from '../../../utils/convertTimestamp'
import { TASK_STATUS } from '../../task/commom'
import TaskDetail from '../../task/detail/TaskDetail'
import TaskForm from '../../task/form/TaskForm'

// StyleSheets
import { TaskInformationWrapper } from '../style'

// Assets

const TaskInformation: React.FC<TaskInformationProps> = ({
  taskList,
  isLoading
}) => {
  // State logic
  const [isOpeningToCreateTask, setOpeningToCreateTask] =
    useState<boolean>(false)
  const [isOpeningToEditTask, setOpeningToEditTask] = useState<boolean>(false)
  const [isOpeningToViewTask, setOpeningToViewTask] = useState<boolean>(false)
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null)
  const [filteredStatusTask, setFilteredStatusTask] = useState<number>(0)

  // Ref

  // Variables

  // Custom hooks
  const { selectedLead } = useLeadDetailContext()
  const taskData =
    taskList?.length > 0
      ? sortDataByCreatedTime(
          taskList.filter(
            (t: any) =>
              t.status === filteredStatusTask || filteredStatusTask === 0
          )
        )
      : []

  // Higher-order functions

  // Component life-cycle methods (useEffect)

  // Component render
  return (
    <>
      <TaskInformationWrapper>
        <div className='task-information-header'>
          <div className='title'>
            <FiPlusCircle
              style={{ fontSize: '24px', color: '#FC7634', cursor: 'pointer' }}
              onClick={() => setOpeningToCreateTask(true)}
            />
            <div className="text">Task Information</div>
          </div>
          <div className='filter'>
            <StyledSelect
              className='btn-filter-status'
              placeholder='Status'
              defaultValue={filteredStatusTask}
              onChange={setFilteredStatusTask}
            >
              <Select.Option key={'all'} value={0}>
                All
              </Select.Option>
              {TASK_STATUS.map((s: string, index: number) => (
                <Select.Option
                  key={s}
                  value={index + 1}
                  style={{ textTransform: 'capitalize' }}
                >
                  {s}
                </Select.Option>
              ))}
            </StyledSelect>
          </div>
        </div>
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Spin />
          </div>
        ) : taskData.length > 0 ? (
          <div className='task-information-body'>
            {taskData.map((t: any) => (
              <div
                className='task-item'
                key={t.uuid}
                onClick={() => {
                  setSelectedTask(t)
                  setOpeningToViewTask(true)
                }}
              >
                <div className='name'>{t.title}</div>
                {t.deadline && (
                  <div className='deadline'>{timestampToDate(t.deadline)}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyData className='no-shadow' />
        )}
      </TaskInformationWrapper>

      {isOpeningToCreateTask && (
        <TaskForm
          title='Create Task'
          visible={isOpeningToCreateTask}
          setVisible={setOpeningToCreateTask}
          selectedLead={selectedLead}
        />
      )}

      {isOpeningToViewTask && (
        <TaskDetail
          visible={isOpeningToViewTask}
          onClose={() => setOpeningToViewTask(false)}
          taskDetail={selectedTask}
        />
      )}
    </>
  )
}

interface TaskInformationProps {
  taskList: ITask[]
  isLoading: boolean
}

export default TaskInformation
