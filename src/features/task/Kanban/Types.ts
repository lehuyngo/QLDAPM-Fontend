export interface ColumnProps {
  children: any[]
  className: string
  title: string | number
  defaulStatus: number
}

export interface Task {
  uuid: string
  title: string
  status: number | string
  priority?: number
  label?: number
  project?: Object
  deadline?: number
  estimated_hours?: number
  description?: string
  assignees?: any[]
}

export interface MovableTaskProps {
  name: string
  index: number
  currentColumnName: string | number
  moveCardHandler?: (dragIndex: number, hoverIndex: number) => void
  setItems: React.Dispatch<React.SetStateAction<Task[]>>
  task: Task
  onclick: (taskId: string | null) => void
}
