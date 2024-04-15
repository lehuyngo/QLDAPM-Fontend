import { Timeline } from 'antd'
import React from 'react'

interface pageProps {
  dataActive: any[]
}

const ActiveTimeLine: React.FC<pageProps> = ({ dataActive }) => {
  return <Timeline mode='left' items={dataActive} />
}

export default ActiveTimeLine
