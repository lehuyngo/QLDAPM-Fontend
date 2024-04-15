import { Button, Layout } from 'antd'
import styled from 'styled-components'

const CardListStyle = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
`

const CardItemStyle = styled.div`
  max-width: 100%;
  max-height: 18rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #fff;

  .image-container {
    width: 100%;
    height: 9rem;
    .ant-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-height: 100%;
        width: unset;
        max-width: 100%;
      }
    }
  }
  .info-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 12px 12px;

    .name-client {
      font-size: 14px;
      font-weight: 700;
      line-height: 160%;

      &.empty {
        height: 22.4px;
      }
    }
    .website-client {
      font-size: 12px;
      font-weight: 500;
      line-height: 150%;
      &.empty {
        height: 18px;
      }
    }
  }
  .action-container {
    .btn {
      font-size: 12px;
      font-weight: 700;
      line-height: 170%;
      color: #3b5bd5;
      border: 1.5px solid #3b5bd5;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #3b5bd5;
        color: #fff;
      }
    }
  }
`

const CaptureWrapper = styled.div<{ $useFulHeight: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* height: ${(props) =>
    (props.$useFulHeight * 4) / 7 + 3 * 16}px !important; */
  height: 100%;

  margin-bottom: 16px;

  .capture-content {
    height: 100%;
  }

  .no-capture {
    height: 100%;
    .ant-image {
      height: 100%;
      img {
        height: 100%;
      }
    }
  }
`

const FormCardDetailLayout = styled(Layout)<{
  $useFulHeight: number
  $useFullWidth: number
}>`
  background-color: #ffffff !important;
  border-radius: 8px;
  padding: 12px;
  margin: 0px 12px 12px;

  .prev-next-btn-list {
    margin-right: 0px !important;
    margin-left: 0px !important;
    margin-bottom: 16px;
    height: 40px;
    align-items: center;

    .ant-col {
      padding: 0px !important;
    }
  }

  .btn-list-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
    height: 40px;
    margin-right: 0px !important;
    margin-left: 0px !important;
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-select .ant-select-selector {
    height: 100% !important;
  }

  .logo-client {
    .client-upload-logo {
      .ant-upload-list-item-container {
        display: none !important;
      }

      &.ant-upload-wrapper.ant-upload-picture-card-wrapper {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        height: 100%;
      }
      &.ant-upload-wrapper.ant-upload-picture-card-wrapper
        .ant-upload.ant-upload-select {
        border: unset !important;
        background-color: unset !important;
        margin-bottom: 0px !important;
        margin-inline-end: 0px !important;
        height: ${(props) => (props.$useFulHeight * 1.5) / 7}px;
        width: ${(props) => (props.$useFulHeight * 1.5) / 7}px;
      }
      .client-upload-image {
        height: ${(props) => (props.$useFulHeight * 1.5) / 7}px;
        width: ${(props) => (props.$useFulHeight * 1.5) / 7}px;
        position: relative;
        cursor: pointer;

        .img-logo {
          height: ${(props) => (props.$useFulHeight * 1.5) / 7}px;
          width: ${(props) => (props.$useFulHeight * 1.5) / 7}px;
          border-radius: 50rem;
          object-fit: cover;

          img {
            height: ${(props) => (props.$useFulHeight * 1.5) / 7}px;
            width: ${(props) => (props.$useFulHeight * 1.5) / 7}px;
            border-radius: 50rem;
            object-fit: cover;
          }
        }

        .edit-icon {
          visibility: hidden;
          padding: 6px;
          border-radius: 50rem;
          background: #e4e4e6;
          position: absolute;
          bottom: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 14px;
            height: 14px;
          }
        }

        &:hover {
          .edit-icon {
            visibility: visible;
          }
        }
      }
    }

    .ant-form-item-row {
      .ant-form-item-label {
        height: unset !important;
      }
      .ant-form-item-control {
        height: calc(100% - 30px) !important;

        .ant-form-item-control-input {
          height: 100% !important;

          .ant-form-item-control-input-content {
            height: 100% !important;
          }
        }
      }
    }
  }

  .h-4-7 {
    height: ${(props) => (props.$useFulHeight * 4) / 7 + 3 * 16}px !important;
  }
  .h-2-7 {
    height: ${(props) => (props.$useFulHeight * 2) / 7 + 16}px !important;
  }
  .h-1-7 {
    height: ${(props) => (props.$useFulHeight * 1) / 7}px !important;
  }
  .customize-height {
    .ant-form-item-row {
      height: 100%;
      .ant-form-item-label {
        height: ${(props) =>
          props.$useFullWidth > 1536 ? `calc(100% * 3 / 7)` : `24px`};
        display: flex;
        align-items: flex-end;
        padding-bottom: 2px !important;

        label {
          font-size: 14px;
          font-weight: 700;
          line-height: calc(22 / 14);
        }
      }

      .ant-form-item-control {
        height: ${(props) =>
          props.$useFullWidth > 1536
            ? `calc(100% * 4 / 7)`
            : `calc(100% - 24px)`};
        .ant-form-item-control-input {
          height: 100%;
          min-height: 40px;

          .ant-form-item-control-input-content {
            height: 100%;
          }

          .ant-input,
          .ant-select {
            height: 100% !important;
            font-size: 14px;
            line-height: calc(22 / 14);
          }
        }
      }
    }
  }

  .ant-form-item-explain-error {
    display: none;
  }

  .ant-input-status-error {
    border: 1px solid;
  }
`

const ButtonNextPreviousStyled = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f4f4;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  cursor: pointer;
  padding: 0px;
`

const CardManagementWrapper = styled.div`
  display: flex;
  border-radius: 8px;
  gap: 12px;
  margin: 0px 12px 12px;
  flex-direction: column;
  min-height: 280px;
  background: #fff;
  padding: 12px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
`

export {
  CardListStyle,
  CardItemStyle,
  CaptureWrapper,
  FormCardDetailLayout,
  ButtonNextPreviousStyled,
  CardManagementWrapper
}
