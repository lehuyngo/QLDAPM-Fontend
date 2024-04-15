export interface MailRecord {
  sender: {
    uuid: string
    displayname: string
  }
  receiver: {
    uuid: string
    fullname: string
  }
  mail: {
    uuid: string
    subject: string
  }
  send_time: number
  read_time: number
  url: string
}

export interface TimeRange {
  start_time: number
  end_time: number
}

export interface ChartDataItem {
  x: string
  y: number
}

export interface ChartProps {
  dataMail: {
    time_range: TimeRange
    records: MailRecord[]
  }[]

  handleSelectChartColumn: (values: MailRecord[]) => void
}

export type TableProps = {
  tableData: any
  loading?: boolean
}
