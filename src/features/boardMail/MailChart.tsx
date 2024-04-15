import React, { useCallback, useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import styled from 'styled-components'
import {
  useGetScreenHeight,
  useGetScreenWidth
} from '../../utils/FunctionsShare'
import { timestampToDateTime } from '../../utils/convertTimestamp'
import { ChartDataItem, ChartProps } from './types'

const ColumnChart: React.FC<ChartProps> = ({
  dataMail,
  handleSelectChartColumn
}) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([])

  const screenHeight = useGetScreenHeight()
  const screenWidth = useGetScreenWidth()
  const chartHeight = screenHeight - 64 - 64 - 350
  const maxChartWidth = screenWidth - 140

  const chartWidth = chartData.length * 40

  const handleClickOnkBar = useCallback(
    (idx: number) => {
      handleSelectChartColumn(dataMail?.[idx]?.records)
    },
    [dataMail]
  )

  useEffect(() => {
    if (dataMail && dataMail.length > 0) {
      const newChartData: ChartDataItem[] = dataMail.map(
        ({ time_range, records }) => ({
          x: timestampToDateTime(time_range.start_time).slice(0, 10),
          y: records?.length || 0
        })
      )
      setChartData(newChartData)
    }
  }, [dataMail])

  const options = {
    chart: {
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          handleClickOnkBar(config.dataPointIndex)
        }
      }
    },

    series: [{ data: chartData }],

    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: {
          position: 'top' // top, center, bottom
        },
        columnWidth: 20
      }
    },

    zoom: {
      enabled: false
    },

    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        formatter: function (val: any) {
          return val
        }
      }
    },

    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        return (
          '<div class="tooltip-chart-mail">' +
          series[seriesIndex][dataPointIndex] +
          '</div>'
        )
      }
    }
  }

  return (
    <ChartStyled
      options={options}
      series={[{ data: chartData }]}
      type='bar'
      height={chartHeight}
      width={chartWidth <= maxChartWidth ? maxChartWidth : chartWidth}
    />
  )
}

export default ColumnChart

const ChartStyled = styled(Chart)`
  margin-top: 12px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ccc;

  width: calc(100vw - 132px);
  overflow-x: auto;
  overflow-y: hidden;

  .tooltip-chart-mail {
    padding: 4px 8px;
  }
`
