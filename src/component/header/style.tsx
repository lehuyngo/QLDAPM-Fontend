import { Header } from 'antd/es/layout/layout'
import styled from 'styled-components'

const CrmHeaderStyled = styled(Header)`
  &.header {
    background-color: #fcfcfc;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px !important;
    margin-bottom: 12px;

    .header-userIcon {
      display: flex;
      justify-content: end;
      align-items: center;
      gap: 8px;
      min-width: max-content;

      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 32px;
        cursor: pointer;
      }
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-title--content {
        font-size: 18px;
        font-weight: 700;
        margin-right: 30px;

        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 22px;
        -webkit-line-clamp: 1;
        height: 22px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
    }
  }
`

const PopoverHeaderStyle = styled.div`
  width: 8rem;

  .options {
    background-color: #fff;

    .config-option {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem;
      cursor: pointer;

      &.logout {
        color: #dc2626;
      }

      &.logout:hover {
        background-color: #dc2626;
        color: #fff;
      }

      &:hover {
        background-color: #d1d5db;
      }

      .icon {
        height: 1rem;
        width: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .expand {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: end;
      }
    }
  }
`

export { CrmHeaderStyled, PopoverHeaderStyle }
