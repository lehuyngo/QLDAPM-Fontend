import styled from 'styled-components'
import { Form } from 'antd'

const LoginFormStyle = styled(Form)`
  --main-color: #b21a17;
  --input-text-color: #000;
  --btn-text-color: #fbeac7;
  --input-background-color: #fff8df;
  font-size: 14px;

  .title-form {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--main-color);
    width: fit-content;
    position: relative;
    text-align: center;
    margin: 0 auto 0.7rem;
    line-height: 1;
  }

  .field-form {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 22px;

    .ant-form-item-explain {
      .ant-form-item-explain-error {
        color: var(--main-color);
      }
      height: 22px;
    }
    .ant-input {
      &:focus,
      &:focus-within {
        border-color: var(--main-color) !important;
        box-shadow: none !important;
        outline: none !important;
      }

      &:placeholder-shown {
        font-size: 14px;
      }

      border-color: var(--input-background-color);
      padding: 4px 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 160%;
      background-color: var(--input-background-color);
      color: var(--input-text-color);
      height: 32px;

      &.ant-input-status-error {
        border-color: var(--main-color) !important;
        box-shadow: none !important;
        outline: none !important;
      }
    }
    .ant-input-affix-wrapper.ant-input-password {
      &:focus,
      &:focus-within {
        border-color: var(--main-color) !important;
        box-shadow: none !important;
        outline: none !important;
      }

      .ant-input {
        padding: 0px;
        height: 22px;
      }

      border-color: var(--input-background-color);
      padding: 4px 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 160%;
      background-color: var(--input-background-color);
      color: var(--input-text-color);
      height: 32px;

      .anticon.ant-input-password-icon {
        color: var(--main-color);
      }

      &.ant-input-affix-wrapper-status-error {
        border-color: var(--main-color) !important;
        box-shadow: none !important;
        outline: none !important;
      }
    }

    label {
      font-weight: 700;
      line-height: 160%;
      height: unset;
      color: var(--main-color);

      &:before {
        display: none !important;
      }

      &:after {
        visibility: hidden;
      }
    }
  }

  .footer-form {
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: end;
    justify-content: center;
    margin: 0 auto;
    .btn-login {
      background-color: var(--main-color) !important;
      color: var(--btn-text-color) !important;
      width: 100%;
      padding: 4px 12px;
      height: unset;
      font-weight: 700;
      line-height: 160%;
      height: 32px;
    }
    .btn-register-container {
      display: flex;
      gap: 4px;
      color: var(--main-color) !important;
      text-align: end;

      .btn-register {
        cursor: pointer;
        font-weight: 700;
      }
    }
  }

  @media only screen and (min-width: 1920px) {
    .title-form {
      font-size: 1.4rem;
      margin: 0 auto 0.7rem;
    }
    .field-form {
      margin-bottom: 26px;
      .ant-form-item-explain {
        height: 26px;

        .ant-form-item-explain-error {
          font-size: 16px;
        }
      }
      .ant-input {
        &:placeholder-shown {
          font-size: 16px;
        }
        height: 36px;
      }
      .ant-input-affix-wrapper.ant-input-password {
        .ant-input {
          height: 26px;
        }
        height: 36px;

        .anticon.ant-input-password-icon {
          svg {
            font-size: 16px;
          }
        }
      }

      label {
        font-size: 16px;
      }
    }

    .footer-form {
      gap: 10px;
      font-size: 16px;
      .btn-login {
        height: 36px;
        font-size: 16px;
      }
    }
  }

  @media only screen and (min-width: 2048px) {
    .title-form {
      font-size: 1.6rem;
      margin: 0 auto 0.85rem;
    }
    .field-form {
      margin-bottom: 30px;
      .ant-form-item-explain {
        height: 30px;

        .ant-form-item-explain-error {
          font-size: 18px;
        }
      }
      .ant-input {
        &:placeholder-shown {
          font-size: 18px;
        }
        height: 40px;
      }
      .ant-input-affix-wrapper.ant-input-password {
        .ant-input {
          height: 32px;
        }
        height: 40px;

        .anticon.ant-input-password-icon {
          svg {
            font-size: 18px;
          }
        }
      }

      label {
        font-size: 18px;
      }
    }

    .footer-form {
      gap: 8px;
      font-size: 18px;
      .btn-login {
        height: 40px;
        font-size: 18px;
      }
    }
  }

  @media only screen and (min-width: 2560px) {
    .title-form {
      font-size: 1.8rem;
      margin: 0 auto 1.2rem;
    }
    .field-form {
      margin-bottom: 34px;
      .ant-form-item-explain {
        height: 34px;

        .ant-form-item-explain-error {
          font-size: 20px;
        }
      }
      .ant-input {
        &:placeholder-shown {
          font-size: 20px;
        }
        height: 48px;
      }
      .ant-input-affix-wrapper.ant-input-password {
        .ant-input {
          height: 38px;
        }
        height: 48px;

        .anticon.ant-input-password-icon {
          svg {
            font-size: 20px;
          }
        }
      }

      label {
        font-size: 20px;
      }
    }

    .footer-form {
      gap: 16px;
      font-size: 20px !important;
      .btn-login {
        height: 48px;
        font-size: 20px;
      }
    }
  }
`

const RegisterFormStyle = styled(Form)`
  --main-color: #b21a17;
  --input-text-color: #000;
  --btn-text-color: #fbeac7;
  --input-background-color: #fff8df;
  font-size: 14px;

  .title-form {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--main-color);
    width: fit-content;
    position: relative;
    text-align: center;
    margin: 0 auto 0.7rem;
  }

  .note-form {
    font-size: 14px;
    font-weight: 700;
    color: var(--main-color);
    width: 90%;
    text-align: right;
    position: relative;
    margin: 0 auto 0.2rem;
  }

  .field-form {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 22px;

    .ant-form-item-label {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      padding-top: 6px;
    }
    .ant-form-item-explain {
      .ant-form-item-explain-error {
        color: var(--main-color);
      }
      height: 22px;
    }

    .ant-input {
      &:focus,
      &:focus-within {
        border-color: var(--main-color) !important;
        box-shadow: none !important;
        outline: none !important;
      }

      &:placeholder-shown {
        font-size: 14px;
      }

      border-color: var(--input-background-color);
      padding: 4px 12px;
      font-style: normal;
      height: 32px;
      font-weight: 400;
      line-height: 160%;
      background-color: var(--input-background-color);
      color: var(--input-text-color);

      &.ant-input-status-error {
        border-color: var(--main-color) !important;
        box-shadow: none !important;
        outline: none !important;
      }
    }

    .ant-input-affix-wrapper.ant-input-password {
      &:focus,
      &:focus-within {
        border-color: var(--main-color) !important;
        box-shadow: none !important;
        outline: none !important;
      }

      .ant-input {
        padding: 0px;
        height: 22px;
      }
      border-color: var(--input-background-color);
      padding: 4px 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 160%;
      background-color: var(--input-background-color);
      color: var(--input-text-color);
      height: 32px;

      .anticon.ant-input-password-icon {
        color: var(--main-color);
      }

      &.ant-input-affix-wrapper-status-error {
        border-color: var(--main-color) !important;
        box-shadow: none !important;
        outline: none !important;
      }
    }

    label {
      font-weight: 600;
      line-height: 160%;
      height: unset;
      color: var(--main-color);

      &:before {
        display: none !important;
      }

      &:after {
        visibility: hidden;
      }
    }
  }

  .field-form-footer {
    width: 90%;
    margin-left: auto;
    margin-right: auto;

    label {
      display: none;
    }

    .footer-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      justify-content: center;
      margin: 0 auto;

      .btn-register {
        background-color: var(--main-color) !important;
        color: var(--btn-text-color) !important;
        width: 100%;
        margin: 0 auto;
        padding: 4px 12px;
        height: 32px;
        font-weight: 700;
        line-height: 160%;
      }
      .btn-login-container {
        display: flex;
        gap: 4px;
        color: var(--main-color) !important;
        justify-content: flex-end;
        width: 100%;

        .btn-login {
          cursor: pointer;
          font-weight: 700;
        }
      }
    }
  }

  @media only screen and (min-width: 1920px) {
    .title-form {
      font-size: 1.4rem;
      margin: 0 auto 0.7rem;
    }

    .note-form {
      font-size: 16px;
      margin: 0 auto 0.3rem;
    }

    .field-form {
      margin-bottom: 26px;
      .ant-form-item-label {
        font-size: 16px;
        padding-top: 6px;
      }
      .ant-form-item-explain {
        height: 26px;

        .ant-form-item-explain-error {
          font-size: 16px;
        }
      }
      .ant-input {
        &:placeholder-shown {
          font-size: 16px;
        }

        height: 36px;
      }
      .ant-input-affix-wrapper.ant-input-password {
        .ant-input {
          height: 26px;
        }
        .anticon.ant-input-password-icon {
          svg {
            font-size: 16px;
          }
        }
        height: 36px;
      }

      label {
        font-size: 16px;
      }
    }

    .field-form-footer {
      .footer-form {
        font-size: 16px;
        gap: 10px;

        .btn-register {
          height: 36px;
          font-size: 16px;
        }

        .auth-btn-timezone {
          height: 36px;

          .timezone-picked {
            gap: 6px;
            .flag-icon-opt {
              height: 20px;
              width: 24px;
            }
          }
        }
      }
    }
  }

  @media only screen and (min-width: 2048px) {
    .title-form {
      font-size: 1.6rem;
      margin: 0 auto 0.85rem;
    }

    .note-form {
      font-size: 18px;
      margin: 0 auto 0.4rem;
    }

    .field-form {
      margin-bottom: 30px;
      .ant-form-item-label {
        font-size: 18px;
        padding-top: 6px;
      }
      .ant-form-item-explain {
        height: 30px;

        .ant-form-item-explain-error {
          font-size: 18px;
        }
      }
      .ant-input {
        &:placeholder-shown {
          font-size: 18px;
        }

        height: 40px;
      }
      .ant-input-affix-wrapper.ant-input-password {
        .ant-input {
          height: 32px;
        }
        .anticon.ant-input-password-icon {
          svg {
            font-size: 18px;
          }
        }
        height: 40px;
      }

      label {
        font-size: 18px;
      }
    }

    .field-form-footer {
      .footer-form {
        font-size: 18px;
        gap: 12px;

        .btn-register {
          height: 40px;
          font-size: 18px;
        }

        .auth-btn-timezone {
          height: 40px;

          .timezone-picked {
            gap: 8px;
            .flag-icon-opt {
              height: 22px;
              width: 26.4px;
            }
          }
        }
      }
    }
  }

  @media only screen and (min-width: 2560px) {
    .title-form {
      font-size: 1.8rem;
      margin: 0 auto 1rem;
    }

    .note-form {
      font-size: 20px;
      margin: 0 auto 0.5rem;
    }

    .field-form {
      margin-bottom: 34px;
      .ant-form-item-label {
        font-size: 20px;
        padding-top: 6px;
      }
      .ant-form-item-explain {
        height: 34px;

        .ant-form-item-explain-error {
          font-size: 20px;
        }
      }
      .ant-input {
        &:placeholder-shown {
          font-size: 20px;
        }

        height: 48px;
      }
      .ant-input-affix-wrapper.ant-input-password {
        .ant-input {
          height: 38px;
        }
        .anticon.ant-input-password-icon {
          svg {
            font-size: 20px;
          }
        }
        height: 48px;
      }

      label {
        font-size: 20px;
      }
    }

    .field-form-footer {
      .footer-form {
        font-size: 20px;
        gap: 16px;

        .btn-register {
          height: 48px;
          font-size: 20px;
        }

        .auth-btn-timezone {
          height: 48px;

          .timezone-picked {
            gap: 10px;
            .flag-icon-opt {
              height: 24px;
              width: 28.8px;
            }
          }
        }
      }
    }
  }
`

export { LoginFormStyle, RegisterFormStyle }
