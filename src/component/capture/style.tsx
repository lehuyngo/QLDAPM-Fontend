import styled from 'styled-components'

const ScreenshotCaptureStyle = styled.div`
  height: 100%;
  width: 100%;
  .ReactCrop {
    width: 100%;
    height: 100%;

    .ReactCrop__child-wrapper {
      width: 100%;
      height: 100%;
    }
  }
  img {
    /* width: 100%; */
    height: 100%;
  }
`

export { ScreenshotCaptureStyle }
