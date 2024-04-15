import { Select, Space, Tag, Tooltip } from 'antd'
import React from 'react'
import { FiXCircle } from 'react-icons/fi'
import styled from 'styled-components'

import { getTextColor } from '../../utils/FunctionsShare'

interface dataType {
  uuid: string
  name: string
  color: string
}

interface TagsWrapperProps {
  dataTags: any[]
  onDelete?: (id: string) => void
}

const TagsWrapper = ({ dataTags, onDelete }: TagsWrapperProps) => {
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }
  const tagRender = (props: any) => {
    const { label } = props
    const tagData = dataTags.find((item: dataType) => item.name === label)

    return (
      <div
        onClick={onPreventMouseDown}
        className='tag-render'
        style={{ color: getTextColor(tagData.color || '#fff') }}
      >
        <Tag color={tagData ? tagData.color : '#999999'}>
          {label}
          <FiXCircle
            className='tag-render-icon-delete'
            onClick={(e) => {
              e.stopPropagation()
              onDelete && onDelete(tagData.uuid)
            }}
          />
        </Tag>
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
      return (
        <Tooltip
          zIndex={999}
          color='#fcfcfc'
          overlayInnerStyle={{
            overflow: 'auto',
            maxWidth: '400px',
            width: 'max-content'
          }}
          title={
            <TooltipStyle
              direction='vertical'
              onClick={(e) => e.stopPropagation()}
            >
              {omittedValues?.map((value: any) => {
                const tagData = dataTags?.find(
                  (item: dataType) => item.name === value?.value
                )

                return (
                  <Tag
                    key={value}
                    color={tagData?.color}
                    style={{ color: getTextColor(tagData?.color || '#fff') }}
                  >
                    <div className='tag-name-and-tag-icon'>
                      {tagData?.name}
                      <FiXCircle
                        className='tag-render-icon-delete'
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete && onDelete(tagData.uuid)
                        }}
                      />
                    </div>
                  </Tag>
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
    value: dataTags?.map((item: dataType) => item?.name),
    disabled: true
  }

  return (
    <TagWrapper>
      <Select {...selectProps} />
    </TagWrapper>
  )
}

export default TagsWrapper

const TagWrapper = styled.div`
  width: calc(100% - 48px);

  .ant-select-selector {
    background: unset !important;
    border: unset !important;
    cursor: pointer !important;
    padding-left: 0px !important;

    .ant-select-selection-search {
      display: none;
    }

    .ant-select-selection-overflow-item {
      cursor: default !important;

      .ant-select-selection-item {
        transform: translateY(2px);

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

          height: 30px;
          width: 30px;

          .omitted-values {
            padding: 14px;
          }
        }

        &:hover {
          background-color: #dddddb;
        }
      }
    }
  }

  .tag-render {
    margin-top: 4px;

    .ant-tag {
      border-radius: 4px;

      display: flex;
      align-items: center;
      gap: 8px;
      color: unset;
    }

    .tag-render-icon-delete {
      font-size: 14px;
      cursor: pointer !important;

      &:hover {
        color: #fc7634;
      }
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
    cursor: pointer !important;

    &:hover {
      color: #fc7634;
    }
  }
`
