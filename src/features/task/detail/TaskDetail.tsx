// External dependencies
import {
  Avatar,
  Badge,
  Card,
  Descriptions,
  DescriptionsProps,
  Spin,
  Tabs,
  Tag
} from 'antd'
import DOMPurify from 'dompurify'
import { useState } from 'react'
import { FiCalendar, FiClock, FiEdit, FiXCircle } from 'react-icons/fi'
import Slider from 'react-slick'
import styled from 'styled-components'

// Internal dependencies
import CustomShowAssignee from '../../../component/customShowTags/CustomShowAssignee'
import { ImageWithAuth } from '../../../component/getImageWithAuth/ImageWithAuth'
import TextWithTooltip from '../../../component/textWithTooltip'
import ImageDefault from '../../../resources/images/image-default.jpg'
import { CrmModal, CrmTaskStatus } from '../../../theme/crm.style'
import { timestampToDate } from '../../../utils/convertTimestamp'
import { LABEL_OPTIONS, PRIORITY, TASK_STATUS } from '../commom'
import TaskFormEdit from '../form/TaskFormEdit'
import TaskComment from './TaskComment'

// StyleSheets
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

// Assets

// Props type declaration
interface DetailProps {
  visible: boolean
  onClose: () => void
  taskDetail: any
  taskDetailLoading?: boolean
}

const TaskDetail: React.FC<DetailProps> = ({
  visible,
  onClose,
  taskDetail,
  taskDetailLoading
}) => {
  // State logic
  const [isOpeningToEditTask, setOpeningToEditTask] = useState<boolean>(false)

  // Ref

  // Variables

  const sanitizer = DOMPurify.sanitize
  const {
    creator,
    description,
    deadline,
    label,
    priority,
    status,
    title,
    estimated_hours,
    project,
    assignees,
    attach_files,
    uuid
  } = taskDetail || {}
  const labelValue = LABEL_OPTIONS[label as keyof typeof LABEL_OPTIONS]
  const priorityValue = PRIORITY[priority as keyof typeof PRIORITY]

  const settings = {
    infinite: false,
    swipe: false,
    variableWidth: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  }

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Assignee',
      children: <CustomShowAssignee dataTags={assignees} />
    },
    {
      key: '2',
      label: 'Deadline',
      children: (
        <>
          {deadline && (
            <>
              <FiCalendar /> {timestampToDate(deadline)}
            </>
          )}
        </>
      )
    },
    {
      key: '3',
      label: 'Time',
      children: (
        <>
          {estimated_hours && (
            <>
              <FiClock />
              {estimated_hours % 24 === 0
                ? `${estimated_hours / 24} day`
                : `${estimated_hours} hour`}
            </>
          )}
        </>
      )
    },
    {
      key: '3',
      label: 'Status',
      children: (
        <>
          <CrmTaskStatus className='task-detail-status' $status={status}>
            {TASK_STATUS[status - 1]}
          </CrmTaskStatus>
        </>
      )
    },
    {
      key: '4',
      label: 'Lead',
      children: <>{project && <p>{project.shortname || project.fullname}</p>}</>
    },
    {
      key: '5',
      label: 'Label',
      children: (
        <>
          {labelValue && (
            <Tag style={{ color: '#333' }} color={labelValue.color}>
              {labelValue.label}
            </Tag>
          )}
        </>
      )
    },
    {
      key: '5',
      label: 'Priority',
      children: (
        <>
          {priorityValue && (
            <Badge
              style={{ color: priorityValue.color }}
              color={priorityValue.color}
              text={priorityValue.label}
            />
          )}
        </>
      )
    },
    {
      key: '5',
      label: 'Created by',
      children: (
        <>
          {/* <StyledTag> */}
          <Avatar size={'small'} src={creator?.avatar || ImageDefault} />
          {creator?.displayname}
          {/* </StyledTag> */}
        </>
      )
    }
  ]

  // Custom hooks

  // Higher-order functions

  // Component life-cycle methods (useEffect)
  function SampleNextArrow(props: any) {
    const { className, style, onClick } = props
    return <div className={className} onClick={onClick} />
  }

  function SamplePrevArrow(props: any) {
    const { className, style, onClick } = props
    return <div className={className} onClick={onClick} />
  }

  // Component render
  return (
    <CrmModal
      className='modal-task-detail'
      open={visible}
      title={
        <div className='modal-title'>
          <div
            style={{ display: 'flex', justifyContent: 'flex-start' }}
            className='title'
          >
            <TextWithTooltip text={title} />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <FiEdit
              style={{
                fontSize: '20px',
                color: '#fc7634',
                cursor: 'pointer'
              }}
              onClick={() => {
                setOpeningToEditTask(true)
              }}
            />

            <div className='btn-title close-modal' onClick={onClose}>
              <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
            </div>
          </div>
        </div>
      }
      closeIcon={
        <FiXCircle
          style={{ fontSize: '20px', color: '#999', display: 'block' }}
        />
      }
      onCancel={onClose}
      footer={null}
    >
      {taskDetailLoading && (
        <Spin style={{ position: 'absolute', left: '50%' }} />
      )}

      <StyledDescriptions items={items} column={1} />

      <Tabs
        defaultActiveKey='1'
        items={[
          {
            label: 'Description',
            key: '1',
            children: (
              <>
                {description && (
                  <Card
                    bordered={true}
                    style={{ width: '100%', backgroundColor: '#F5F5F5' }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizer(description)
                      }}
                    ></div>
                  </Card>
                )}
                <div className='description-task-img'>
                  {attach_files?.length > 0 && (
                    <SliderStyled {...settings}>
                      {attach_files.map((fileItem: any) => (
                        <ImageWithAuth
                          url={fileItem.url}
                          preview={true}
                          key={fileItem.uuid}
                        />
                      ))}
                    </SliderStyled>
                  )}
                </div>
              </>
            )
          },
          {
            label: 'Comment',
            key: '2',
            children: <TaskComment taskId={uuid} />
          }
        ]}
      />

      {isOpeningToEditTask && (
        <TaskFormEdit
          title='Edit Task'
          visible={isOpeningToEditTask}
          setVisible={setOpeningToEditTask}
          taskId={uuid}
        />
      )}
    </CrmModal>
  )
}

export default TaskDetail

const StyledDescriptions = styled(Descriptions)`
  font-size: 12px !important;

  &.ant-descriptions {
    .ant-descriptions-item {
      padding-bottom: 8px;
    }

    .ant-descriptions-item-label {
      width: 100px !important;
      text-align: left;
      color: black;
    }

    .ant-descriptions-item-content {
      gap: 8px;
      align-items: center;
      width: 50% !important;
      display: flex;
    }

    .ant-descriptions-item-container {
      align-items: center;
    }
  }
`

const SliderStyled = styled(Slider)`
  .slick-arrow {
    &.slick-prev {
      z-index: 100;
      position: absolute;
      left: -8px;

      &::before {
        color: #f98d6c;
        padding: 8px;
      }
    }

    &.slick-next {
      z-index: 100;
      position: absolute;
      right: 4px;

      &::before {
        color: #f98d6c;
        padding: 8px 0px 8px 8px;
      }
    }
  }
`
