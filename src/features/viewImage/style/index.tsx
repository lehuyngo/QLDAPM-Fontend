import { Modal } from 'antd'
import styled from 'styled-components'

const ViewImageWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);

  .ant-image {
    display: none;
  }
`

const ViewImageModalWrapper = styled(Modal)`
  display: none;
`

const ErrorLoadingImageWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  flex-direction: column;
  font-size: 20px;
`

export { ViewImageWrapper, ViewImageModalWrapper, ErrorLoadingImageWrapper }
