import Sider from 'antd/es/layout/Sider'
import styled from 'styled-components'

const SiderStyled = styled(Sider)`
  position: absolute !important;
  z-index: 20;
  height: 100vh;
  @media only screen and (min-width: 1280px) {
    position: relative !important;
  }

  .ant-layout-sider-children {
    padding: 16px;
    background: #fcfcfc;

    .sidebar-crm {
      display: flex;
      flex-direction: column;
      gap: 16px;

      &.open {
        .sidebar-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;

          .item-container {
            display: flex;
            align-items: center;
            gap: 8px;

            .icon {
              display: flex;
              align-items: center;
              img {
                width: 16px;
                height: 16px;
              }
            }

            .text {
              font-size: 16px;
              font-weight: 700;
              line-height: 160%;

              white-space: nowrap;
              overflow: hidden;
            }
          }

          .action {
            display: flex;
            align-items: center;
            cursor: pointer;
          }
        }

        .sidebar-contain {
          display: flex;
          flex-direction: column;
          gap: 16px;

          .short-info-card {
            position: relative;
            padding: 12px;
            border-radius: 4px;
            border: 1px solid #ccc;
            display: flex;
            justify-content: space-between;

            .card-container {
              display: flex;
              flex-direction: row;
              gap: 12px;

              .logo-img {
                img {
                  width: 42px;
                  height: 42px;
                  border-radius: 50%;
                  object-fit: cover;
                }
              }

              .main-info {
                display: flex;
                flex-direction: column;
                gap: 2px;

                width: 190px;
                font-size: 14px;
                font-weight: 400;
                line-height: 170%;

                .name-code {
                  display: flex;
                  gap: 6px;

                  .name {
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 150%;
                  }
                  .code {
                    font-weight: 700;
                  }
                }

                .phone {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  .icon {
                    display: flex;
                    align-items: center;
                    img {
                      width: 16px;
                      height: 16px;
                    }
                  }
                }
              }
            }

            &.client {
              padding: 12px;
              border-radius: 4px;
              border: 1px solid #e4e4e6;
              .main-info {
                .name {
                  font-size: 18px;
                  font-weight: 700;
                  line-height: 150%;
                  margin-right: 14px;
                }
                .code,
                .website {
                  font-size: 14px;
                  font-weight: 400;
                  line-height: 140%;
                }
              }
            }

            .action-edit {
              position: absolute;
              top: 4px;
              right: 4px;

              svg {
                cursor: pointer;
              }
            }
          }

          .full-info-card {
            display: flex;
            flex-direction: column;
            gap: 6px;

            .full-info {
              table {
                max-width: 100%;
                tr {
                  display: flex;
                  margin-bottom: 12px;
                }

                tr:last-child {
                  margin-bottom: 0px;
                }
                .field {
                  width: 5rem;
                  font-size: 12px;
                  font-weight: 500;
                  line-height: 150%;
                  display: flex;
                  align-items: start;
                }
                .value {
                  flex: 1;
                  font-size: 12px;
                  font-weight: 700;
                  line-height: 150%;
                }
              }
            }

            .name-card {
              text-align: center;
              width: 100%;
              cursor: pointer;
              img {
                border-radius: 8px;
                /* overflow: hidden; */
                border: 1px solid #d9d9d9;
                height: 156px;
                width: 100%;
                object-fit: cover;
              }
            }
          }

          .attachment-item {
            display: flex;
            justify-content: space-between;
            border-radius: 8px;
            padding: 12px 16px;
            background-color: #f4f4f4;

            .name {
              color: #fc7634;
              font-size: 14px;
              font-weight: 700;
              line-height: 170%;
            }

            .action-delete {
              font-size: 16px;
              color: #ccc;
              cursor: pointer;

              &:hover {
                color: #999;
              }
            }
          }
        }
      }

      &.close {
        .action svg {
          cursor: pointer;
        }

        .sidebar-contain {
          display: flex;
          flex-direction: column;
          gap: 32px;

          .action {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }

  .collapse-btn {
    padding: 12px 0px;

    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    position: absolute;
    bottom: 12px;
    width: calc(100% - 48px);

    /* left: 20px; */

    .collapse-text {
      &.unCollapse {
        overflow: hidden;
        white-space: nowrap;
        animation: 0.3s text-collapse ease;
      }
    }
  }

  .ant-upload-list {
    display: none;
  }
`

export { SiderStyled }
