import { useState } from 'react'
import { useDrop } from 'react-dnd'
import { FiPlusCircle } from 'react-icons/fi'
import TaskForm from '../form/TaskForm'
import { ColumnProps } from './Types'

const ColumnTaskKanban: React.FC<ColumnProps> = ({
  children,
  className,
  title,
  defaulStatus
}) => {
  const [isOpenCreateTask, setIsOpenCreateTask] = useState<boolean>(false)

  const [{ isOver }, dropRef] = useDrop({
    accept: 'Our first type',

    drop: () => ({ name: title }),

    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  })

  const getBackgroundColor = () => {
    if (isOver) {
      return '#fcfcfc'
    } else {
      return ''
    }
  }

  return (
    <>
      <div
        ref={dropRef}
        className={className}
        style={{ backgroundColor: getBackgroundColor() }}
      >
        <div className='column-title-wrapper'>
          <span className='column-title--text'>{title}</span>
          <span className='column-title--total'>{children?.length}</span>

          <FiPlusCircle
            className='column-title--icon'
            onClick={() => setIsOpenCreateTask(true)}
          />
        </div>
        {children}
      </div>
      {isOpenCreateTask && (
        <TaskForm
          setVisible={setIsOpenCreateTask}
          visible={isOpenCreateTask}
          title={'Create Task'}
          defaulStatus={defaulStatus}
        />
      )}
    </>
  )
}

export default ColumnTaskKanban
