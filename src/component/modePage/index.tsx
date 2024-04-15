import React from 'react'
import { Segmented, Space } from 'antd'
import styled from 'styled-components'

type ModePageProps = {
  tab: string
  tabs: { label: string; value: string }[]
  onChangeTab: (tab: any) => void
}

const ModePage: React.FC<ModePageProps> = ({ tab, onChangeTab, tabs }) => {
  return (
    <Space direction='vertical'>
      <ModePageWrapper
        options={tabs}
        value={tab}
        onChange={(value) => onChangeTab(value)}
      />
    </Space>
  )
}

type ModeStatusLeadProps = {
  tab: number
  tabs: { label: string; value: number; note: string }[]
  onChangeTab: (tab: any) => void
  onOpenFormChange: (note: string) => void
  disabled?: boolean
}

const ModeStatusLead: React.FC<ModeStatusLeadProps> = ({
  tab,
  onChangeTab,
  tabs,
  disabled,
  onOpenFormChange
}) => {
  return (
    <ModeStatusLeadWrapper
      options={tabs}
      value={tab}
      onChange={(value) => {
        if (value === 5 && onOpenFormChange) {
          onOpenFormChange(tabs.find((item) => item.value === 5)?.note || '')
        } else {
          onChangeTab(value)
        }
      }}
      disabled={disabled}
    />
  )
}

export default ModePage
export { ModeStatusLead }

const ModePageWrapper = styled(Segmented)`
  &.ant-segmented {
    background: #0000000a;

    .ant-segmented-item-selected {
      color: #fc7634;
      font-weight: 700;
    }
    .ant-segmented-item {
      flex: 1 1 0px;
    }
    .ant-segmented-item-label {
      width: 90px;
    }
  }
`

const ModeStatusLeadWrapper = styled(Segmented)`
  width: 100%;
  &.ant-segmented {
    background: #fff4e8;

    .ant-segmented-item-selected {
      color: #fc7634;
      font-weight: 700;
    }
    .ant-segmented-item {
      border-radius: 50rem;
      width: calc(100% / 5);
    }
  }
  .ant-segmented-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
`
