import { Spin } from 'antd'

const OverlayFetching = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fcfcfc',
        opacity: 0.5,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 9999
      }}
    >
      <Spin
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  )
}

export default OverlayFetching
