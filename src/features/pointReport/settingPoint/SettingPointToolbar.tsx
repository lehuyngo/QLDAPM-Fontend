import React, { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { FiPlusCircle } from 'react-icons/fi'
import { Button } from 'antd'

import { RangePickerLocale } from '../../../component/datePicker/RangePicker'
import SettingPointForm from '../form/SettingPointForm'

import { SettingPointToolbarStyle } from '../style'

function disabledEndDate(current: any) {
  return current && current > dayjs().endOf('day')
}

interface PointToolbarProps {
  handleChangeDate: (value: Dayjs[]) => void
}

const SettingPointToolbar = ({ handleChangeDate }: PointToolbarProps) => {
  const [isOpenningSettingPointForm, setOpenSettingPointForm] =
    useState<boolean>(false)

  return (
    <SettingPointToolbarStyle>
      <Button
        className='btn-setting-point'
        type='primary'
        icon={<FiPlusCircle style={{ fontSize: '16px' }} />}
        onClick={() => setOpenSettingPointForm(true)}
      >
        Settings Point
      </Button>
      <div className='filter-range'>
        <RangePickerLocale
          // disabledDate={disabledEndDate}
          onChange={handleChangeDate}
          defaultValue={[dayjs().subtract(6, 'day'), dayjs()]}
        />
      </div>
      <SettingPointForm
        visible={isOpenningSettingPointForm}
        onClose={() => {
          setOpenSettingPointForm(false)
        }}
      />
    </SettingPointToolbarStyle>
  )
}

export default SettingPointToolbar
