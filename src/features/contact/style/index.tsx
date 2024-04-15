import { Modal } from 'antd'
import ReactQuill from 'react-quill'
import styled from 'styled-components'

const ContactModalStyle = styled(Modal)`
  .client-upload-logo {
    .ant-upload-list {
      display: flex;
      align-items: center;
      justify-content: center;
      .ant-upload {
        margin-inline-end: unset !important;
        margin-bottom: unset !important;
        border: unset !important;
        background-color: unset !important;
        width: 84px !important;
        height: 84px !important;
      }
    }
    .ant-upload-list-item-container {
      display: none !important;
    }

    .client-upload-image {
      height: 84px;
      width: 84px;
      position: relative;
      cursor: pointer;

      .img-logo {
        height: 84px;
        width: 84px;
        border-radius: 50rem;
        object-fit: cover;

        img {
          height: 84px;
          width: 84px;
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

  &.modal-contact {
    --crm-contact-gray-10: #d9d9d9;
    --crm-contact-orange-10: #f7cebb;
    --crm-contact-gray-100: #666666;
    --crm-contact-white-100: #fff;
    --main-font: 'Mulish', sans-serif;
    --crm-contact-gray-20: #f5f5f5;
    --crm-contact-blue-50: #3b5bd5;

    font-family: var(--main-font);

    .ant-modal-content {
      border-radius: 8px;
      border: 1px solid var(--crm-contact-gray-10);
      background: var(--crm-contact-white-100);
      padding: 0;

      .ant-modal-close {
        display: none;
      }

      .ant-modal-header {
        border-bottom: 1px solid var(--crm-contact-gray-10);
        padding: 16px 24px 12px;
        margin-bottom: 0px;

        .modal-title {
          display: flex;
          align-items: center;

          .title {
            flex: 1;
            font-size: 20px;
            font-weight: 700;
            text-align: center;
          }

          .btn-title {
            height: 32px;
            width: 32px;
            cursor: pointer;

            &.close-modal {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }

      .ant-modal-body {
        .modal-content {
          max-height: 60vh !important;
          padding: 14px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-x: hidden;
          overflow-y: auto;
          .row-field {
            display: flex;
            gap: 14px;
            transition: display 1s ease-in;

            .ant-form-item {
              margin-bottom: 0px !important;
            }

            &.f-2 {
              .ant-form-item {
                width: calc(100% / 2);
              }
            }

            &.f-1 {
              .ant-form-item {
                width: calc(100% / 1);
              }
            }

            .ant-form-item-row {
              gap: 8px;

              .ant-form-item-label {
                padding-bottom: 0px;
                font-size: 16px;
                font-weight: 400;
                line-height: 160%;
                label {
                  height: fit-content;
                  &.ant-form-item-required {
                    &:before {
                      display: none;
                    }
                    &:after {
                      display: inline-block;
                      visibility: visible;
                      margin-left: 4px;
                      color: #ff2e2e;
                      font-size: 16px;
                      font-weight: 400;
                      line-height: 1;
                      content: '(*)';
                    }
                  }
                }
              }

              .ant-input {
                height: 44px;
                font-size: 16px;
                font-weight: 400;
                line-height: 160%;
                background-color: var(--crm-contact-gray-20);
                border-radius: 8px;
                padding: 10px 18px;
                border: none;
                color: black;

                &:focus {
                  border: none;
                  box-shadow: 0 0 0 2px var(--crm-contact-orange-10);
                }
              }

              .ant-upload {
                width: 100%;

                .contact-upload-image-name-card {
                  max-height: 100px;
                  overflow: hidden;

                  .img-name-card {
                    max-height: 100px;
                    object-fit: cover;

                    img {
                      max-height: 100px;
                      object-fit: cover;
                    }
                  }
                }

                .edit-icon-name-card {
                  visibility: hidden;
                  padding: 6px;
                  border-radius: 50rem;
                  background: #e4e4e6;
                  position: absolute;
                  top: 0;
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

                .ant-upload-list-item-container {
                  width: 100%;
                  height: auto;
                }
                .ant-upload-list-item {
                  width: 100%;
                }
                .ant-upload-list-item-thumbnail {
                  img {
                    object-fit: cover;
                  }
                }
                &.ant-upload-drag {
                  border-color: var(--crm-contact-orange-10);
                }

                &:focus {
                  border: none;
                  box-shadow: 0 0 0 2px var(--crm-contact-orange-10);
                }

                .ant-upload-drag-icon {
                  img {
                    width: 48px;
                    height: 48px;
                  }
                }
              }

              .ant-select-selector {
                height: 44px !important;
                padding: 10px 18px;
                border-radius: 8px;
                background-color: var(--crm-contact-gray-20);
                border: none;
                font-size: 16px;
                color: #000;
                font-weight: 400;

                &:focus {
                  border: none;
                  box-shadow: 0 0 0 2px var(--crm-contact-orange-10);
                }

                .ant-select-selection-placeholder {
                  font-weight: 400;
                }
              }
            }
          }

          .sub-form {
            display: flex;
            gap: 8px;
            align-items: center;

            .text {
              font-size: 12px;
              font-weight: 500;
              line-height: 150%;
              color: var(--crm-contact-gray-100);
            }
            .action {
              font-size: 14px;
              font-weight: 600;
              line-height: 150%;
              color: var(--crm-contact-blue-50);
              text-decoration: underline;
              cursor: pointer;
            }
          }

          .text-waring-delete {
            font-size: 16px;
            font-weight: 400;
            line-height: 160%;
          }

          .ant-select-single {
            height: unset;
          }
        }

        .footer-actions {
          display: flex;
          margin: 0 24px 0;
          justify-content: flex-end;

          .btn-actions {
            display: flex;
            gap: 8px;
            padding-top: 14px;
            margin-bottom: 24px;
            .btn-footer {
              height: 40px;
              font-size: 16px;

              &.cancel {
                border: 1px solid var(--crm-contact-gray-10);
                color: #666;
                background-color: #fcfcfc;
              }
              &.submit {
                color: #fcfafa;
                background-color: #fc7634;
              }
            }
          }
        }
      }

      .ant-modal-footer {
        margin-top: 0px;
      }
    }
  }
`

const EmailModalStyle = styled(Modal)`
  &.modal-email.create {
    --crm-contact-gray-10: #d9d9d9;
    --crm-contact-orange-10: #f7cebb;
    --crm-contact-gray-100: #666666;
    --crm-contact-white-100: #fff;
    --main-font: 'Mulish', sans-serif;
    --crm-contact-gray-20: #f5f5f5;
    --crm-contact-blue-50: #3b5bd5;

    font-family: var(--main-font);

    .ant-modal-content {
      border-radius: 8px;
      border: 1px solid var(--crm-contact-gray-10);
      background: var(--crm-contact-white-100);
      padding: 0;

      .ant-modal-close {
        display: none;
      }

      .ant-modal-header {
        border-bottom: 1px solid var(--crm-contact-gray-10);
        padding: 24px 24px 14px;
        margin-bottom: 0px;

        .modal-title {
          display: flex;
          align-items: center;

          .title {
            flex: 1;
            font-size: 20px;
            font-weight: 700;
            text-align: center;
          }

          .btn-title {
            height: 32px;
            width: 32px;
            cursor: pointer;

            &.close-modal {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }

      .ant-modal-body {
        .modal-content {
          max-height: 60vh !important;
          padding: 14px 32px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          overflow-x: hidden;
          overflow-y: auto;
          .row-field {
            display: flex;
            gap: 14px;
            transition: display 1s ease-in;

            .ant-form-item {
              margin-bottom: 0px !important;
            }

            &.f-2 {
              .ant-form-item {
                width: calc(100% / 2);
              }
            }

            &.f-1 {
              .ant-form-item {
                width: calc(100% / 1);
              }
            }

            .ant-form-item-row {
              gap: 8px;

              .ant-form-item-label {
                padding-bottom: 0px;
                font-size: 16px;
                font-weight: 400;
                line-height: 160%;
                label {
                  height: fit-content;
                  &.ant-form-item-required {
                    &:before {
                      display: none;
                    }
                    &:after {
                      display: inline-block;
                      visibility: visible;
                      margin-left: 4px;
                      color: #ff2e2e;
                      font-size: 16px;
                      font-weight: 400;
                      line-height: 1;
                      content: '(*)';
                    }
                  }
                }
              }

              .ant-input {
                font-size: 16px;
                font-weight: 400;
                line-height: 160%;
                background-color: var(--crm-contact-gray-20);
                border-radius: 8px;
                padding: 10px 12px;
                border: none;

                &:focus {
                  border: none;
                  box-shadow: 0 0 0 2px var(--crm-contact-orange-10);
                }
              }

              .ant-select-selector {
                padding: 10px 4px;
                border-radius: 8px;
                background-color: var(--crm-contact-gray-20);
                border: none;
                font-size: 16px;
                color: #000;
                font-weight: 400;
                height: fit-content;
                &:focus {
                  border: none;
                  box-shadow: 0 0 0 2px var(--crm-contact-orange-10);
                }
              }

              .sub-form {
                display: flex;
                gap: 8px;
                align-items: center;

                .text {
                  font-size: 12px;
                  font-weight: 500;
                  line-height: 150%;
                  color: var(--crm-contact-gray-100);
                }
                .action {
                  font-size: 14px;
                  font-weight: 600;
                  line-height: 150%;
                  color: var(--crm-contact-blue-50);
                  text-decoration: underline;
                  cursor: pointer;
                }
              }
            }
          }

          .text-waring-delete {
            font-size: 16px;
            font-weight: 400;
            line-height: 160%;
          }

          .ant-select-single {
            height: unset;
          }
        }

        .footer-actions {
          display: flex;
          margin: 0 24px 0;
          justify-content: flex-end;

          .ant-form-item-row {
            width: 100%;

            .ant-form-item-control-input-content {
              display: flex;
              justify-content: space-between;
            }

            .footer-checkbox {
              margin-top: 12px;
            }

            .checkbox-warning-icon {
              transform: translateY(2px);
            }
          }

          .btn-actions {
            display: flex;
            gap: 8px;
            padding-top: 14px;
            margin-bottom: 24px;
            .btn-footer {
              height: 40px;
              font-size: 16px;

              &.cancel {
                border: 1px solid var(--crm-contact-gray-10);
                color: #666;
                background-color: #fcfcfc;
              }
              &.submit {
                color: #fcfafa;
                background-color: #fc7634;
              }
            }
          }
        }
      }

      .ant-modal-footer {
        margin-top: 0px;
      }
    }

    .dynamic-delete-button {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    .count-character {
      float: inline-end;
      font-size: 12px;
    }
  }

  &.modal-email.details {
    --crm-contact-gray-10: #d9d9d9;
    --crm-contact-orange-10: #f7cebb;
    --crm-contact-gray-100: #666666;
    --crm-contact-white-100: #fff;
    --main-font: 'Mulish', sans-serif;
    --crm-contact-gray-20: #f5f5f5;
    --crm-contact-blue-50: #3b5bd5;

    font-family: var(--main-font);

    .ant-modal-content {
      border-radius: 8px;
      border: 1px solid var(--crm-contact-gray-10);
      background: var(--crm-contact-white-100);

      .ant-modal-close {
        display: none;
      }

      .ant-modal-header {
        border-bottom-color: var(--crm-contact-gray-10);
        padding: 16px 24px 14px;

        .modal-title {
          display: flex;
          align-items: center;

          .title {
            flex: 1;
            font-size: 20px;
            font-weight: 700;
            text-align: center;
          }

          .btn-title {
            height: 32px;
            width: 32px;
            cursor: pointer;

            &.close-modal {
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }

      .ant-modal-body {
        padding: 0px;

        .modal-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      }

      .ant-modal-footer {
        margin-top: 0px;
      }
    }
  }

  .mail_attach_file {
    .ant-upload-list-item-progress {
      padding-inline-start: 0px !important;
    }
    .ant-upload-icon {
      display: none;
    }
  }
`

const CustomReactQuillCreateEmail = styled(ReactQuill)`
  background: white;

  & > .ql-container {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    height: 86%;
    & > .ql-editor {
      width: 100%;
      height: 140px;
      overflow: auto;
      resize: vertical;
      /* font-size: 10px; */
    }
  }
  &.task > .ql-container {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    height: 86%;
    & > .ql-editor {
      width: 100%;
      /* height: 170px; */
      overflow: auto;
      resize: vertical;
      /* font-size: 10px; */
    }
  }

  & > .ql-toolbar {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .contact-upload-image-name-card {
  }
`

const DetailsEmailStyle = styled.div`
  .modal-content {
    max-height: 60vh !important;
  }
  .modal-title {
    display: flex;
    justify-content: space-between;

    .sender__container {
      display: flex;
      gap: 12px;

      .info {
        font-size: 14px;
        font-weight: 400;
        line-height: 170%;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .name {
          font-weight: 700;
        }
      }
    }

    .sentAt {
      display: flex;
      align-items: end;
      color: #999999;
    }
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 16px;

    hr {
      background-color: #e4e4e6;
    }

    .mail-title {
      font-size: 23px;
      font-weight: 600;
      line-height: 130%;
    }

    .attachments {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .attachment-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 12px;
        font-weight: 700;
        line-height: 150%;

        .btn-download {
          color: #3b5bd5;
          cursor: pointer;
        }
      }
      .files {
        display: flex;
        gap: 16px;
        align-items: center;
      }
    }
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .btn-delete {
      display: flex;
      gap: 8px;
      align-items: center;

      .icon {
        display: flex;
        align-items: center;
        img {
          height: 16px;
          width: 16px;
        }
      }

      .text {
        height: 20px;
        display: flex;
        align-items: center;
        font-size: 12px;
        font-weight: 700;
        color: #999999;
        line-height: 150%;
      }
    }
  }
`

const AttachmentItemStyle = styled.div`
  border-radius: 4px;
  border: 1px solid #e4e4e6;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  .icon {
    img {
      height: 24px;
      width: 24px;
    }
  }

  .info {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;

    .name {
      font-weight: 700;
    }
  }
`

const CrmContentMoreAction = styled.div`
  gap: 8px;
  border-radius: 8px;

  .action {
    padding: 12px 18px;
    display: flex;
    width: fit-content;
    align-items: center;
    gap: 16px;
    cursor: pointer;

    .action-name {
      font-weight: 700;
      font-size: 14px;
    }
    .action-icon {
      height: 24px;
      width: 24px;
    }
  }
`

const ToolbarContactDetails = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 8px 0;

  .actions {
    display: flex;
    gap: 8px;
    align-items: center;

    .action {
      &.email {
        display: flex;
        gap: 8px;
        align-items: center;

        .short-click button {
          border-radius: 6px;
          color: #3b5bd5;
          background-color: #fcfcfc;
          border: 1px solid #3b5bd5;

          font-size: 12px;
          font-weight: 700;
          line-height: 150%;

          &:hover {
            background-color: #3b5bd5;
            color: #fcfcfc;
          }
        }
        .send-mail button {
          border-radius: 6px;
          background-color: #fc7634;
          color: #fcfcfc;
          border: 1px solid #fc7634;

          font-size: 12px;
          font-weight: 700;
          line-height: 150%;
        }
      }
      &.tag button {
        border-radius: 6px;
        background-color: #fc7634;
        color: #fcfcfc;
        border: 1px solid #fc7634;

        font-size: 12px;
        font-weight: 700;
        line-height: 150%;
      }

      &.filter-by-time {
        .ant-select-single {
        }
        .ant-select-selector {
          background-color: #fcfcfc;
          font-size: 14px;
          font-weight: 400;
          line-height: 170%;
          border: unset;
          color: #999;
          padding: 8px 16px;
        }
      }
    }
  }
`

const EmptyActivityWrapper = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
`

export {
  ContactModalStyle,
  EmailModalStyle,
  CustomReactQuillCreateEmail,
  DetailsEmailStyle,
  AttachmentItemStyle,
  CrmContentMoreAction,
  ToolbarContactDetails,
  EmptyActivityWrapper
}
