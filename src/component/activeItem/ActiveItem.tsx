import React from 'react'
import { Card } from 'antd'
import styled from 'styled-components'
import TooltipActionUser from './../tooltipAction/TooltipActionUser'
import { ACTION_ACTIVITY, ACTIVITY_TYPE_COLOR } from '../../constants/common'
import { timestampToDateTime } from '../../utils/convertTimestamp'
import { capitalizeFirstLetter } from '../../utils/FunctionsShare'
interface Props {
  type: string
  action: number
  creator: any
  object: any
  contact?: any
  createdAt: number
}
const ActiveItem: React.FC<Props> = ({
  type,
  action,
  creator,
  object,
  contact,
  createdAt
}) => {
  type = type === 'project' ? 'lead' : type
  let backgroundColorItem =
    ACTIVITY_TYPE_COLOR[type.toUpperCase() as keyof typeof ACTIVITY_TYPE_COLOR]
  let actionTitle = `${capitalizeFirstLetter(
    ACTION_ACTIVITY[action]
  )} ${capitalizeFirstLetter(type)}`
  let actionDesc = `${capitalizeFirstLetter(ACTION_ACTIVITY[action])} ${
    action === 0 ? 'new ' + type : type
  }`
  let createdAtDateTime = timestampToDateTime(createdAt)
  let objectName = ''
  if (object) {
    if (object.name) objectName = '"' + object.name + '"'
    else if (object.title) objectName = '"' + object.title + '"'
    else if (object.subject) objectName = '"' + object.subject + '"'
    else if (object.fullname) objectName = '"' + object.fullname + '"'
    else if (object.shortname) objectName = '"' + object.shortname + '"'
  }

  return (
    <CardActive>
      <div className='active'>
        <div className='active-contain'>
          <div className='active-from'>
            <span
              className='icon'
              style={{ background: backgroundColorItem }}
            ></span>
            <span className='text-bold'>{actionTitle}</span>
            <span>from</span>
            <span>
              {' '}
              <TooltipActionUser
                id={creator?.uuid}
                name={creator?.displayname}
              />
            </span>
            {contact && contact.uuid && (
              <>
                <span>to</span>
                <span>
                  {' '}
                  <TooltipActionUser
                    id={contact?.uuid}
                    name={contact?.shortname || contact?.fullname}
                  />
                </span>
              </>
            )}
          </div>
        </div>
        <div className='active-time'>{createdAtDateTime}</div>
      </div>

      <div className='active'>
        <div className='active-contain'>
          <p className='active-des'>{actionDesc}</p>

          <span className='active-des text-bold'>{objectName}</span>
        </div>
      </div>
    </CardActive>
  )
}

export { ActiveItem }

const CardActive = styled(Card)`
  background-color: #fff;
  border: 1px solid #ccc;

  .active {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;

    .active-contain {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
      flex: 1;
    }

    .text-bold {
      font-weight: 700;
    }

    .active-from {
      display: flex;
      gap: 6px;
      align-items: center;

      .icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 999px;
      }
    }

    .active-to {
      display: flex;
      gap: 6px;
    }

    .active-time {
      color: #666666;
    }
  }

  .active-des {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 150%;
    font-size: 14px;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
`
