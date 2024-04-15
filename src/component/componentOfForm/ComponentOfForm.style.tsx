import { Button, Descriptions, Form, Input, Radio, Select, Tag } from 'antd'
import styled from 'styled-components'
import { CrmModal } from '../../theme/crm.style'

const StyledForm = styled(Form)`
  &.ant-form-item-label-required::after {
    content: '(*)';
    margin-right: 4px;
    color: red; /* Màu sắc tùy chỉnh cho dấu sao */
  }
  &.ant-form .ant-form-item {
    margin-bottom: 10px;
  }
  &.ant-form .ant-form-item .ant-form-item-label > label {
    font-size: 14px !important;
  }

  .point-label {
    .ant-form-item-label > label {
      width: 100%;
    }
    .point-label--click-here {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }

  .client-upload-logo {
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

  .text-full {
    display: flex;
    font-size: 14px;
    text-align: center;
    padding: 4px 10px;
    height: 44px;
    min-width: 50%;
    border-radius: 8px;
    align-items: center;
    justify-content: center;

    .text-minimize {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`
const StyledButton = styled(Button)`
  &.ant-btn {
    border-radius: 6px;

    height: 40px;
    font-size: 14px;
  }

  &.ant-btn:focus-visible {
    border: none;
    box-shadow: 0 0 0 2px inset rgba(252, 118, 52, 0.3);
    outline-color: rgba(252, 118, 52, 0.3);
  }
`
const StyledSelectTags = styled(Select)`
  && {
    &.ant-select .ant-select-selector {
      background-color: #f5f5f5 !important;
    }
    .ant-select-selection-item {
      display: flex;
      align-items: center;
      height: 30px;
      border-radius: 100px;
      margin: 5px 6px;
      background-color: #ffffff;
    }
    .ant-select-selection-item-content {
      display: flex;
      align-items: center;
    }
    .ant-select-selection-item-content > .ant-avatar {
      margin-right: 8px;
    }
  }
`
const StyledInput = styled(Input)`
  .ant-input {
    height: 44px;
    background: #f5f5f5;
  }

  &.ant-input {
    border-radius: 8px;
    border: none;
    height: 44px !important;
    background: #f5f5f5;
    color: black;
  }
  &.ant-input:focus {
    box-shadow: 0 0 0 2px inset rgba(252, 118, 52, 0.3);
  }
`

const StyledTextArea = styled(Input.TextArea)`
  &.ant-input {
    border-radius: 8px;
    border: none;
    height: 100px;
    background: #f5f5f5;
    color: black;
  }
  &.ant-input:focus {
    box-shadow: 0 0 0 2px inset rgba(252, 118, 52, 0.3);
  }
`

const StyledSelect = styled(Select)`
  &.ant-select {
    height: 44px !important;

    &.project_status--select-box {
      .ant-select-selection-item {
        span {
          width: 100%;
          display: block;
        }
      }
    }
  }

  &.ant-select .ant-select-selector {
    border: none;
    background-color: #f5f5f5 !important;
    height: 44px !important;
  }

  &.ant-select-focused .ant-select-selector {
    box-shadow: 0 0 0 2px inset rgba(252, 118, 52, 0.3) !important;
  }
  &.ant-select .ant-select-arrow {
    color: black !important;
  }

  &.select-contacts.ant-select {
    .ant-select-selector {
      border: none;
      background-color: #f5f5f5 !important;
      height: 44px !important;
      overflow: auto;
    }
    .ant-select-selection-overflow {
      flex-wrap: nowrap;
    }
    .ant-select-selection-item {
      background-color: #fcfcfc;
      border-color: #999;
      display: flex;
      align-items: center;
    }
  }
`
const MiniCrmModal = styled(CrmModal)`
  .ant-modal-content {
    padding: 0 !important;
    border-radius: 8px;
  }

  .ant-modal-body {
    font-size: 14px;

    .form-label {
      .ant-form-item-label > label {
        width: 100%;
      }
      .form-label--click-here {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .ant-modal-footer {
    button {
      font-size: 14px !important;
      height: 40px;
    }
  }
  .modal-title {
    display: flex;
    align-items: center;

    &.delete {
      .title {
        display: flex;
        gap: 8px;
      }
    }
    .title {
      flex: 1;
      font-size: 20px;
      font-weight: 700;
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
`

const StyledRadioGroup = styled(Radio.Group)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StyledRadio = styled(Radio)`
  width: fit-content;

  & .ant-radio-inner {
    background-color: unset !important;
  }

  & .ant-radio-inner:after {
    background-color: #fc7634;
  }
  & .ant-radio-checked .ant-radio-inner {
    border-color: #fc7634;
  }
  .ant-radio:hover .ant-radio-inner,
  .ant-radio-input:focus + .ant-radio-inner,
  &:hover .ant-radio,
  &:hover .ant-radio-inner {
    border-color: #fc7634;
    box-shadow: 0 0 0 3px #fc76341e;
  }

  /* & .ant-radio-input:focus + .ant-radio-inner {
    box-shadow: 0 0 0 3px #fc76341e;
  } */

  & .ant-radio-checked::after {
    border-color: #fc7634;
  }
`

export {
  StyledForm,
  StyledButton,
  StyledSelectTags,
  StyledInput,
  StyledSelect,
  MiniCrmModal,
  StyledTextArea,
  StyledRadioGroup,
  StyledRadio
}
