import { Spin } from 'antd'
import { useState } from 'react'
import CrmPageLayout from '../layout'
import MailDayPicker from './DayPicker'
import ColumnChart from './MailChart'
import { TableBoardMail } from './Table'
import { MailRecord } from './types'

const BoardMail = () => {
  const [dataChart, setDataChart] = useState<any>()
  const [selectedData, setSelectedData] = useState<MailRecord[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCallChartData = (values: any) => {
    setDataChart(values)
  }

  const handleSelectChartColumn = (values: MailRecord[]) => {
    setSelectedData(values)
  }

  const handleLoading = (value: boolean) => {
    setIsLoading(value)
  }

  return (
    <CrmPageLayout>
      <div
        style={{
          margin: '0px 12px 12px'
        }}
      >
        <div style={{ width: '100%' }}>
          <MailDayPicker
            changeDate={handleCallChartData}
            setLoading={handleLoading}
          />

          {isLoading && (
            <Spin style={{ position: 'absolute', top: '15vh', left: '50%' }} />
          )}

          <ColumnChart
            dataMail={dataChart}
            handleSelectChartColumn={handleSelectChartColumn}
          />

          <TableBoardMail tableData={selectedData} />
        </div>
      </div>
    </CrmPageLayout>
  )
}

export default BoardMail
