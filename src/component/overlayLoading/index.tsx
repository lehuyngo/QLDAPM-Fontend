import { Spin } from 'antd'

import { OverlayDefaultWrapper } from './style'

const OverlayDefault = () => {
  return (
    <OverlayDefaultWrapper>
      <div className='spin-mask'></div>
      <div className='spin-container'>
        <Spin />
      </div>
    </OverlayDefaultWrapper>
  )
}

export default OverlayDefault
