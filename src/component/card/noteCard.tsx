import React from 'react'
import { Card } from 'antd'
import styled from 'styled-components'

const NoteCard = styled(Card)`
  &.ant-card {
    margin-top: 12px;
  }
  &.ant-card .ant-card-head {
    border-bottom: none !important;
    height: 30px !important;
    padding: 12px !important;
    min-height: 10px;
  }
  &.ant-card .ant-card-body {
    padding: 0px 12px 4px 12px !important;
  }

  .icon-more-actions {
    margin-left: 20px;
  }
`
export { NoteCard }
