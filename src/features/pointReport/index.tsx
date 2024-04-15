import { useMutation } from '@tanstack/react-query'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import debounce from 'lodash/debounce'

import { useGetPointReport } from '../../api/reactQuery/Point'
import { toTimestamp } from '../../utils/convertTimestamp'
import CrmPageLayout from '../layout'
import SettingPointList from './settingPoint/SettingPointList'
import SettingPointToolbar from './settingPoint/SettingPointToolbar'
import PointTable from './table'
import { IContactPoint } from '../../interfaces/IPoint'

interface DataType {
  contacts: IContactPoint[] | []
  activities: any[]
}

const PointReport = () => {
  const [data, setData] = useState<DataType>({
    contacts: [],
    activities: []
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [sortPoint, setSortPoint] = useState<string>('1')
  const [filteredData, setFilteredData] = useState<IContactPoint[] | []>(
    data?.contacts
  )

  //toolbar function
  const handleSearch = React.useMemo(() => {
    return (keyword: string) => {
      setSearchKeyword(keyword)
    }
  }, [])

  const handleSort = React.useMemo(() => {
    return (keyword: string) => {
      setSortPoint(keyword)
    }
  }, [])

  const { mutate: GetPointReport } = useMutation({
    mutationFn: useGetPointReport
  })

  useEffect(() => {
    handleGetDataFirstLoad()
  }, [])

  useEffect(() => {
    if (data?.contacts) {
      const updatedFilteredData = data?.contacts.filter(
        (item: IContactPoint) => {
          const itemName = item.shortname || item.fullname
          const itemNameWithoutSpaces = itemName.replace(/\s+/g, ' ')

          const matchesSearch = itemNameWithoutSpaces
            ?.toLowerCase()
            ?.includes(searchKeyword.toLowerCase())

          return matchesSearch
        }
      )

      if (sortPoint === '2') {
        updatedFilteredData.sort((a, b) => a.point - b.point)
      } else {
        updatedFilteredData.sort((a, b) => b.point - a.point)
      }

      setFilteredData(updatedFilteredData)
    }
  }, [data, searchKeyword, sortPoint])

  const debouncedHandleChangeDate = debounce((value: Dayjs[]) => {
    const start_date = toTimestamp(value?.[0]?.startOf('day') || dayjs(1000))
    const end_date = toTimestamp(
      value?.[1]?.endOf('day') || dayjs('2100-01-01')
    ) // fake future day

    const datePick = {
      start_date,
      end_date
    }
    setLoading(true)
    GetPointReport(datePick, {
      onSuccess(data) {
        if (Object.keys(data).length === 0) {
          setData({
            contacts: [],
            activities: []
          })
        } else {
          setData({
            contacts: data.contacts,
            activities: data.activities
          })
        }
        setLoading(false)
      },
      onError() {
        setLoading(false)
      }
    })
  }, 500)

  const handleGetDataFirstLoad = () => {
    const start_date = toTimestamp(dayjs().subtract(6, 'day').startOf('day'))
    const end_date = toTimestamp(dayjs())

    const datePick = {
      start_date,
      end_date
    }
    setLoading(true)
    GetPointReport(datePick, {
      onSuccess(data, variables, context) {
        setData(data)
        setLoading(false)
      },
      onError(error, variables, context) {
        setLoading(false)
      }
    })
  }

  return (
    <CrmPageLayout>
      <SettingPointToolbar handleChangeDate={debouncedHandleChangeDate} />

      <SettingPointList data={data?.activities} />

      <PointTable
        filteredData={filteredData}
        loading={loading}
        handleSearch={handleSearch}
        handleSort={handleSort}
      />
    </CrmPageLayout>
  )
}

export default PointReport
