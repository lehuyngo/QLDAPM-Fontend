// External dependencies
import { SendOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, Spin } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useState } from 'react'
import styled from 'styled-components'
import {
  useAddTaskComment,
  useGetTaskComment
} from '../../../api/reactQuery/Task'
import { NotificationCustom } from '../../../component/notification/Notification'
import { timestampToDateTime } from '../../../utils/convertTimestamp'

// Internal dependencies

// StyleSheets

// Assets

// Props type declaration
interface TaskCommentProps {
  taskId: string
}

const TaskComment: React.FC<TaskCommentProps> = ({ taskId }) => {
  // State logic
  const [comment, setComment] = useState<string>('')
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  // Ref
  const queryClient = useQueryClient()

  // Variables
  const { data, isLoading } = useGetTaskComment(taskId)
  const { mutate } = useMutation({
    mutationFn: useAddTaskComment
  })

  // console.log('content', content)

  // Custom hooks

  // Higher-order functions

  // Component life-cycle methods (useEffect)

  const handleComment = () => {
    if (comment) {
      setSubmitLoading(true)
      mutate(
        { content: { content: comment }, taskId },
        {
          onSuccess(data, variables, context) {
            NotificationCustom({
              type: 'success',
              message: 'Add comment successfully'
            })
            queryClient.invalidateQueries({
              queryKey: ['GetTaskComment', taskId]
            })
            setSubmitLoading(false)
            setComment('')
          },
          onError(error, variables, context) {
            NotificationCustom({
              type: 'error',
              message: 'Add comment failed',
              description: error.message
            })
            setSubmitLoading(false)
          }
        }
      )
    }
  }

  return (
    <CardStyled
      bordered={true}
      style={{
        width: '100%',
        backgroundColor: '#F5F5F5'
      }}
    >
      {isLoading ? (
        <Spin />
      ) : (
        data?.data?.map((comment: any) => (
          <div key={comment.uuid} className='task-comment'>
            <strong>{comment.creator.displayname}</strong>{' '}
            <span className='task-comment-time'>
              {timestampToDateTime(comment.created_time)}
            </span>
            <div>
              <p className='task-comment--content'>{comment.content}</p>
            </div>
          </div>
        ))
      )}
      <div className='comment-input-wrapper'>
        <TextArea
          className='comment-input'
          autoSize={{ minRows: 1, maxRows: undefined }}
          placeholder='Add comment'
          showCount
          maxLength={250}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />

        <SendOutlined
          className={`send-icon ${comment && 'show'}`}
          onClick={handleComment}
        />
      </div>
    </CardStyled>
  )
}
export default TaskComment

const CardStyled = styled(Card)`
  .ant-card-body {
    padding: 12px;
  }

  .task-comment {
    margin-bottom: 8px;

    .task-comment-time {
      font-size: 12px;
      color: #888;
    }

    .task-comment--content {
      white-space: pre-line;
    }
  }

  .comment-input-wrapper {
    position: relative;
    margin-bottom: 12px;

    .comment-input {
      margin-right: 12px;
    }

    .send-icon {
      display: none;
      z-index: 10;

      color: #fc7634;
      font-size: 16px;
      padding: 4px;

      position: absolute;
      right: 12px;
      bottom: 0.2rem;

      &.show {
        display: block;
        opacity: 0.8;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
`
