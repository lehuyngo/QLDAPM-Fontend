import styled from 'styled-components'

const OverlayDefaultWrapper = styled.div`
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.45);
  pointer-events: none;
  width: 100vw;
  height: 100vh;

  .spin-mask {
    position: absolute;
    z-index: 1001;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .spin-container {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1002;
    background-color: #ffffff;
    padding: 1rem;
    border: 1px solid #ccc;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  }
`

export { OverlayDefaultWrapper }
