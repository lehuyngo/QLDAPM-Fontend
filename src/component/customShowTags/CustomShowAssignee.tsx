import { Avatar, Select, Space, Tooltip } from 'antd'
import React from 'react'
import styled from 'styled-components'

import ImageDefault from '../../resources/images/image-default.jpg'

interface dataType {
  uuid: string
  displayname: string
  avatar?: string
}

interface TagsWrapperProps {
  dataTags: any[]
  className?: string
  isHideAvatar?: boolean
}

const LABEL = 'displayname'

const CustomShowAssignee = ({
  dataTags,
  className,
  isHideAvatar
}: TagsWrapperProps) => {
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  let omittedLength: number = 0

  const tagRender = (props: any) => {
    const { label } = props

    const tagData = dataTags?.find((item: dataType) => item[LABEL] === label)
    const isLastTag = dataTags?.[dataTags?.length - omittedLength - 1]
    const checkLastTag = isLastTag === tagData

    return (
      <div
        className='tag-render'
        style={{ color: '#333' }}
        onClick={onPreventMouseDown}
      >
        {!isHideAvatar && (
          <Avatar size={'small'} src={tagData.avatar || ImageDefault} />
        )}

        {checkLastTag ? label : `${label},`}
      </div>
    )
  }

  const selectProps: any = {
    mode: 'multiple',
    style: { width: '100%' },
    maxTagCount: 'responsive',
    tagRender: tagRender,
    suffixIcon: false,

    maxTagPlaceholder: (omittedValues: string[]) => {
      omittedLength = omittedValues?.length
      return (
        <Tooltip
          zIndex={1024}
          overlayInnerStyle={{
            overflow: 'auto',
            maxWidth: '400px',
            width: 'max-content'
          }}
          placement='bottom'
          title={
            <TooltipStyle
              direction='vertical'
              onClick={(e) => e.stopPropagation()}
            >
              {omittedValues?.map((value: any, idx: number) => {
                const tagData = dataTags?.find(
                  (item: dataType) => item[LABEL] === value?.value
                )

                return (
                  <div className='tag-name-and-tag-icon' key={idx}>
                    {!isHideAvatar && (
                      <Avatar
                        size={'small'}
                        src={tagData.avatar || ImageDefault}
                      />
                    )}

                    {tagData[LABEL]}
                  </div>
                )
              })}
            </TooltipStyle>
          }
        >
          <span
            onClick={onPreventMouseDown}
            className='omitted-values'
          >{`+${omittedValues.length}`}</span>
        </Tooltip>
      )
    },
    value: dataTags?.map((item: dataType) => item[LABEL]),
    disabled: true
  }

  return (
    <TagWrapperStyled className={className}>
      <Select {...selectProps} />
    </TagWrapperStyled>
  )
}

export default CustomShowAssignee

const TagWrapperStyled = styled.div`
  width: calc(100% - 24px);

  .ant-select-selector {
    background: unset !important;
    border: unset !important;
    cursor: default !important;
    padding-left: 0px !important;

    .ant-select-selection-search {
      display: none;
    }

    .ant-select-selection-overflow {
      flex-wrap: nowrap;
    }

    .ant-select-selection-overflow-item {
      margin-right: 12px;
      .ant-select-selection-item {
        cursor: pointer !important;
        background: #fcfcfc;
        border: 1px solid #dddddb;
        color: #333;
        border-radius: 50rem;

        height: unset;
        font-size: 12px;

        .ant-select-selection-item-content {
          display: flex;
          align-items: center;
          justify-content: center;

          height: 20px;
          width: 24px;

          .omitted-values {
            width: 100%;
            text-align: center;
          }
        }

        &:hover {
          background-color: #dddddb;
        }
      }
    }
  }

  .tag-render {
    .ant-tag {
      border-radius: 50rem;

      display: flex;
      align-items: center;
      gap: 8px;
      color: unset;
    }

    .tag-render-icon-delete {
      font-size: 14px;

      &:hover {
        color: #fc7634;
      }
    }
  }

  &.table-task-list {
    .tag-render {
      font-size: 12px;
    }
  }
`

const TooltipStyle = styled(Space)`
  .tag-name-and-tag-icon {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .tag-render-icon-delete {
    font-size: 14px;

    &:hover {
      color: #fc7634;
      cursor: pointer;
    }
  }
`
