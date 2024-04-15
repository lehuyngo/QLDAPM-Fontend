import React, { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import styled from 'styled-components'

import { useGetTaskDetail } from '../../../api/reactQuery/Task'
import OverlayFetching from '../../../component/overlayLoading/TaskLoadingOverlay'
import TaskDetail from '../detail/TaskDetail'
import ColumnTaskKanban from './Column'
import { COLUMN_NAME, COLUMN_NAMES } from './Constants'
import MovableTask from './MoveTask'
import { Task } from './Types'

const { TODO, DOING, TESTING, DONE } = COLUMN_NAMES

interface KanbanTaskProp {
  taskList: Task[]
  isFetching: boolean
}

export const KanbanTask: React.FC<KanbanTaskProp> = ({
  taskList,
  isFetching
}) => {
  const [openTaskDetail, setOpenTaskDetail] = useState<boolean>(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [items, setItems] = useState<Task[]>(taskList)

  const { data: taskDetail, isLoading: taskDetailLoading } =
    useGetTaskDetail(taskId)

  useEffect(() => {
    setItems(taskList)
  }, [taskList])

  const returnItemsForColumn = (columnName: string | number) => {
    return items
      .filter((item) => item.status == columnName)
      .map((item, index) => (
        <MovableTask
          key={item.uuid}
          name={item.title}
          currentColumnName={item.status}
          setItems={setItems}
          index={index}
          task={item}
          onclick={handleClickTask}
        />
      ))
  }

  const handleCloseTaskDetail = () => {
    setOpenTaskDetail(false)
  }

  const handleClickTask = (taskId: string | null) => {
    setTaskId(taskId)
    setOpenTaskDetail(true)
  }

  return (
    <>
      {isFetching && <OverlayFetching />}
      <KanbanContainer className='container'>
        <DndProvider backend={HTML5Backend}>
          <ColumnTaskKanban
            title={COLUMN_NAME[TODO]}
            className='column todo-column'
            defaulStatus={1}
          >
            {returnItemsForColumn(TODO)}
          </ColumnTaskKanban>
          <ColumnTaskKanban
            title={COLUMN_NAME[DOING]}
            className='column doing-column'
            defaulStatus={2}
          >
            {returnItemsForColumn(DOING)}
          </ColumnTaskKanban>
          <ColumnTaskKanban
            title={COLUMN_NAME[TESTING]}
            className='column testing-column'
            defaulStatus={3}
          >
            {returnItemsForColumn(TESTING)}
          </ColumnTaskKanban>
          <ColumnTaskKanban
            title={COLUMN_NAME[DONE]}
            className='column done-column'
            defaulStatus={4}
          >
            {returnItemsForColumn(DONE)}
          </ColumnTaskKanban>
        </DndProvider>
      </KanbanContainer>

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

const KanbanContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-around;
  flex-direction: row;

  padding: 0 16px;
  width: 100%;
  /* position: relative; */

  /* height: calc(100vh - 64px - (12px * 2) - 52px - 26px); */
  /* overflow-y: hidden; */

  .column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;

    border-radius: 8px;
    margin-bottom: 12px;

    .column-title-wrapper {
      position: sticky;
      top: 64px;
      background: #fff;
      z-index: 20;

      padding: 8px 12px 24px 12px;
      margin-bottom: 8px;
      box-shadow: 0px 2px 4px 4px #fff;

      font-size: 16px;

      @media only screen and (min-width: 1366px) {
        font-size: 14px;
      }

      @media only screen and (min-width: 1440px) {
        font-size: 16px;
      }

      .column-title--icon {
        position: absolute;
        right: 12px;

        font-size: 20px;
        color: #8d8d8d;
        cursor: pointer;
      }

      .column-title--total {
        padding: 4px 12px;
        background-color: #fff4e8;
        border-radius: 6px;
        margin-left: 6px;
        /* font-size: 16px; */
      }

      .column-title--text {
        text-align: center;
        width: 60px;
        border-radius: 4px;
        text-transform: capitalize;
        padding: 4px 6px;

        width: fit-content;
        padding: 4px 10px;
      }
    }
  }

  .todo-column {
    .column-title-wrapper {
      border-bottom: 1px solid #e4e4e6;
    }
    .column-title--text {
      border: 1px solid #e4e4e6;
      background-color: #e4e4e6;
    }
  }

  .doing-column {
    .column-title-wrapper {
      border-bottom: 1px solid #c9bdff;
    }
    .column-title--text {
      border: 1px solid #c9bdff;
      background-color: #c9bdff;
    }
  }

  .testing-column {
    .column-title-wrapper {
      border-bottom: 1px solid #ffd88d;
    }
    .column-title--text {
      border: 1px solid #ffd88d;
      background-color: #ffd88d;
    }
  }

  .done-column {
    .column-title-wrapper {
      border-bottom: 1px solid #b5e4ca;
    }
    .column-title--text {
      border: 1px solid #b5e4ca;
      background-color: #b5e4ca;
    }
  }

  .movable-item {
    padding: 12px 16px 12px 16px;
    border-radius: 4px;
    height: 170px;
    min-height: 170px;
    margin-bottom: 8px;

    display: flex;
    gap: 8px;
    justify-content: space-between;
    flex-direction: column;

    box-shadow: 0px 4px 4px 0px #0000001a;
    position: relative;

    &:hover {
      background: #fffaf7;
      cursor: pointer;
    }

    .movable-item:hover .assignee-first-user {
      background-color: #ffffff !important;
    }

    .trash-icon {
      position: absolute;
      padding: 2px;
      top: 10px;
      right: 10px;

      z-index: 10;

      &:hover {
        cursor: pointer;
        background: #eceaca;
        border-radius: 4px;
      }
    }

    &.miss-deadline {
      background: #f6f6f6;

      &:hover {
        background: #fffaf7;
      }
    }

    &.at-deadline {
      background: #faf3ef;
      &:hover {
        background: #fffaf7;
      }
    }

    .task-title {
      color: #3b5bd5;
      font-size: 12px;
      font-weight: 700;
      margin-right: 12px;

      @media only screen and (min-width: 1366px) {
        font-size: 14px;
      }

      @media only screen and (min-width: 1440px) {
        font-size: 16px;
      }
    }

    .assignee-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;

      .assignee-first-user {
        padding: 4px 8px 4px 0px;
        background-color: #ffffff;
        border-radius: 8px;
      }

      .assignee-wrapper--more {
        padding: 4px;
        background-color: #f5f5f5;
        border-radius: 50%;
      }
    }
  }
`
