import styled from 'styled-components'

const ActionStyle = styled.div`
  border-radius: 4px;
  display: flex;
  gap: 2px;

  .action {
    padding: 10px;
    display: flex;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
      color: red;
    }

    &.disable {
      cursor: not-allowed;

      svg {
        color: #999 !important;
      }
    }
  }
`

const MoreActionPopupStyle = styled.div`
  width: 108px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  .action {
    padding: 8px;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: #f4f4f4;
    }

    &.disable {
      color: #999 !important;

      cursor: not-allowed;

      svg {
        color: #999 !important;
      }
    }

    .text {
      font-size: 12px;
      font-weight: 500;
      line-height: 150%;
      margin-left: 4px;
    }
  }
`

export { ActionStyle, MoreActionPopupStyle }
