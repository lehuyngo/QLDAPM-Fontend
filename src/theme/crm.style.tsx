import { Layout, Modal } from 'antd'
import styled from 'styled-components'

const TASKCOLOR: any = {
  state: {
    deadline: '#FCEDEE',
    toolate: '#E4E4E6'
  },
  bg: {
    assignee: '#f5f5f5',
    moreAction: '#D9D9D9'
  },
  border: {
    status: '#e4e4e6',
    rowTask: '#d9d9d9'
  },
  status: {
    1: '#e4e4e6',
    2: '#C9BDFF',
    3: '#FFD88D',
    4: '#B5E4CA'
  },
  priority: {
    1: '#E04A56',
    2: '#F4BA42',
    3: '#64C1F7'
  }
}

const CrmLayout = styled(Layout)`
  height: 100vh;
  background: #eee;

  .ant-layout {
    background: #eee;
  }

  .ant-layout-sider {
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    bottom: 0;

    flex: unset !important;
    width: 260px !important;
    max-width: 300px !important;
  }

  .ant-layout-sider-collapsed {
    width: 108px !important;
    min-width: 108px !important;
  }

  .site-layout {
    margin-left: 109px;
  }

  .site-layout-background {
    background-color: #fcfcfc;
  }

  .ant-menu {
    color: #fc7634;
    padding: 0 16px;
    font-weight: 700;

    &.ant-menu-light {
      background: unset;
    }
  }

  .ant-menu-item {
    cursor: pointer;

    padding-right: 8px;

    &.disable-menu-item {
      cursor: not-allowed;
    }

    &.ant-menu-item-selected {
      background: #f4f4f4;
      color: #fc7634;
      border: 1px solid #fc7634 !important;
      border-radius: 8px;
    }
  }

  .collapse-btn {
    padding: 12px 50px 12px 24px;

    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    position: absolute;
    bottom: 24px;
    left: 20px;

    .collapse-text {
      &.unCollapse {
        overflow: hidden;
        white-space: nowrap;
        animation: 0.3s text-collapse ease;
      }
    }
  }

  .Crm-sidebar-icon {
    display: flex;
    justify-content: space-between !important;
    padding: 12px 24px;

    .action-collapse {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .Crm-sidebar-icon--logo {
      width: 42px;
      height: 42px;
      margin-left: 6px;
      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }
    }

    .title-project {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 700;
      line-height: 120%;

      overflow: hidden;
      white-space: nowrap;
      animation: 0.3s text-collapse ease;
    }
  }

  @keyframes text-collapse {
    0% {
      width: 0px;
    }

    100% {
      width: 120px;
    }
  }

  .sidebar-footer {
    border-top: 1px solid #666666;
    width: calc(100% - 32px);

    padding-top: 24px;
    margin: 0px 16px;
    font-size: 24px;
    color: #666666;

    display: flex;
    gap: 24px;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: absolute;
    bottom: 36px;
  }

  //task list
  .task-list {
    height: 100%;
    position: relative;
    overflow-y: auto;
    width: 26.6%;
    background: white;
    padding: 16px 8px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc;

    .task-list-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .task-list-items {
      height: calc(100% - 52px);
      overflow-y: auto;

      .task-list-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        padding: 4px;

        border-radius: 4px;
        cursor: pointer;

        &.deadline-background {
          background: #fceac6;
        }

        &:hover {
          background: #fffaf7;
        }

        .task-list-item--content {
          flex: 1;
          font-size: 14px;
        }

        .task-list-item--time {
          width: 72px;
          color: #9f9f9f;
        }
      }
    }
  }

  // css only for task management
  .layout-task-management {
    position: relative;

    margin: 0px 12px 12px;
    border-radius: 8px;
    background-color: #fff;
    border: 1px solid #ccc;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  }

  .card-container-layout {
    max-height: calc(100vh - 64px);
    overflow-y: auto;
  }
`

const CrmTable = styled.div`
  background: white;
  flex: 1;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;

  &.mail-dashboard-table-management {
    margin-top: 12px;
  }

  &.card-table-management {
    box-shadow: unset;
    border: unset;

    .ant-table {
      display: none;
    }
  }

  &.point-report-table-management {
    margin: 0 12px 12px;
    padding: 12px;

    .ant-table {
      display: none;
    }
  }

  && tbody > tr:hover > td {
    background: #fffaf7 !important;
  }
`

const CrmTableInnerStyle = styled.div`
  .ant-table {
    border-radius: 8px;
  }

  .ant-pagination {
    padding-right: 16px;

    .ant-pagination-item-active {
      border: none;
      a {
        background: #ffe7d6;
        color: #ff6700;
        border-radius: 4px;
      }
    }
  }

  .ant-table-thead {
    .ant-table-cell {
      background: none;
      color: #00000090;
      font-size: 14px;
      font-weight: 700;
      padding: 12px;
    }
  }

  .ant-table-tbody {
    /* Common */
    .ant-table-row {
      cursor: pointer;
    }

    .ant-table-cell {
      padding: 8px;

      &.table-first-col {
        font-size: 14px;
        padding: 0 0 0 16px;
      }

      .table--numOfRow {
        font-size: 12px;
        font-weight: 700;
      }
    }

    .icon-more-actions {
      --more-icon-color: #999999;
      --more-icon-hover: #d9d9da;

      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        background-color: var(--more-icon-hover);
      }

      .ant-icon {
        font-size: 16px;
        color: var(--more-icon-color);
      }
    }

    .image-with-auth {
      width: 42px;
      height: 42px;
      object-fit: cover;
      border-radius: 50%;
    }

    .client-name-code {
      display: flex;
      align-items: center;
      gap: 12px;

      .client-name-code--name {
        font-size: 14px;
        font-weight: 700;

        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 16px;
        -webkit-line-clamp: 1;
        height: 16px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }

      .client-info {
        display: flex;
        gap: 8px;
        align-items: center;
      }
    }

    .client-last-active {
      display: block;
      min-width: 110px;
      font-weight: 700;
      font-size: 12px;
    }
  }

  &.crm-table.contact {
    .ant-table-thead {
      .ant-table-selection-column {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }

    .ant-table-selection-extra {
      margin-top: 2px !important;
    }

    .ant-table-selection {
      margin-bottom: 3px !important;
    }

    .ant-table-tbody {
      .contact-connect-client-name {
        font-weight: 700;
        font-size: 12px;
      }
      .contact-birth {
        font-weight: 700;
        font-size: 12px;
      }
      .contact-name-code {
        display: flex;
        align-items: center;
        gap: 12px;

        .contact-name-code--name {
          font-size: 14px;
          font-weight: 700;

          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 16px;
          -webkit-line-clamp: 1;
          height: 16px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }

        .contact-info {
          display: flex;
          gap: 8px;
          align-items: center;
        }
      }

      .contact-last-active {
        display: block;
        min-width: 110px;
        font-weight: 700;
        font-size: 12px;
      }
    }
  }

  &.crm-table.mail {
    .ant-table-tbody {
      .person-info {
        display: flex;
        align-items: center;
        gap: 4px;

        .main-text {
          font-size: 14px;
          font-weight: 700;
        }
        .sub-text {
          font-size: 12px;
          font-weight: 400;
        }
      }

      .status {
        text-transform: capitalize;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        width: fit-content;
        &.failed {
          background-color: #f6dde1;
          color: #ad4657;
        }
        &.waiting {
          background-color: #ffebd0;
          color: #bf6812;
        }
        &.sent {
          color: #24a893;
          background-color: #d1eeec;
        }
        &.processing {
          background-color: #d1ecfd;
          color: #1773e0;
        }
      }
    }
  }

  &.crm-table.mail-detail {
    .ant-table-tbody {
      .ant-table-row {
        cursor: unset;
      }
    }
  }

  &.crm-table.lead {
    .ant-table-tbody {
      .table-client-name,
      .table-contact-name {
        font-size: 12px;
        font-weight: 700;
      }
      .lead-name {
        .lead-name--name {
          font-size: 14px;
          font-weight: 700;

          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }

        .lead-name--meeting {
          font-size: 12px;
          color: '#6d6d6d';
          margin-top: 4px;
          margin-bottom: 4px;
        }
      }
    }
  }

  &.crm-table.client {
    .ant-table-body {
      .client-connect-lead-name {
        font-weight: 700;
      }
      .client-name-code {
        display: flex;
        align-items: center;
        gap: 12px;

        .client-web {
          color: #333;
          :hover {
            text-decoration: underline;
          }
        }

        .client-name-code--name {
          font-size: 14px;
          font-weight: 700;

          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 16px;
          -webkit-line-clamp: 1;
          height: 16px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }

        .client-info {
          display: flex;
          gap: 8px;
          align-items: center;
        }
      }

      .client-last-active {
        display: block;
        min-width: 110px;
        font-weight: 700;
        font-size: 12px;
      }
    }
  }

  .table-board-mail {
    .ant-table-row {
      cursor: unset;
    }

    .title-mail {
      color: #1773e0;
    }
  }
`

const DetailLayout = styled(Layout)`
  .ant-layout {
    height: 100vh;
    margin-left: 80px;

    @media only screen and (min-width: 1280px) {
      margin-left: unset;
    }
  }

  .ant-layout-sider {
    background: unset;

    .sidebar-title {
      display: flex;
      align-items: center;

      font-size: 16px;
      font-weight: 700;
    }
    .sidebar-title--Attachments {
      position: relative;
      font-size: 16px;
      font-weight: 700;
    }
  }

  .page-contain {
    padding: 0px 12px 12px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    height: calc(100vh - 64px);
    overflow-y: auto;

    .ant-card-body {
      padding: 8px;
      border-radius: 8px;

      p {
        margin: 0px;
      }
    }

    .main-info {
      flex: 1;
      min-width: 500px;

      .ant-card {
        border-radius: 8px;
      }

      .last-active {
        padding: 0 16px;
        border: 1px solid #ccc;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
        background-color: #fff;

        .ant-card-body {
          display: flex;
          padding: 0px;

          .last-active--item {
            display: flex;
            padding: 4px 16px;
            flex-direction: column;
            align-items: start;

            .item__container {
              margin: 0 auto;
              p {
                font-weight: 700;
              }

              div {
                font-size: 12px;
                font-weight: 500;

                span:first-child {
                  margin-right: 12px;
                }
              }
            }
          }

          .last-active--item:nth-child(2) {
            flex: 1;
          }
        }
      }

      .main-content-wrapper {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }

    .card-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 290px;

      height: 100%;
      overflow-y: auto;

      .add-quick-btn {
        border: 1.5px solid #3b5bd5 !important;
        color: #3b5bd5 !important;
        background-color: #fff !important;
        cursor: pointer;
        font-size: 12px;
        font-weight: 700;
        line-height: 150%;
      }

      .card-wrapper {
        padding: 12px;
        border-radius: 4px;
        background: #fff;
        border: 1px solid #ccc;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);

        .card-title {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 700;

          .fake-icon {
            display: block;
            width: 14px;
            height: 24px;
            margin-right: 8px;
            border-radius: 4px;
          }

          .card-title--content {
            display: flex;
            align-items: center;
            flex: 1;
            svg {
              cursor: pointer;
            }
          }
        }

        .card-item {
          position: relative;
          margin-top: 8px;

          .card-item--antd-card {
            border-radius: 8px;
            background: #f4f4f4;

            &:hover {
              border: 1px solid #3b5bd5;
              background: #ffffff;
            }

            .lead-status {
              display: flex;
              align-items: center;
              .fake-icon {
                display: block;
                width: 16px;
                height: 16px;
                margin-right: 8px;
                border-radius: 50%;
              }
            }
          }
        }
        .card-item:first-child {
          margin-top: 0;
        }
      }
    }
  }
`

const CrmTaskTable = styled.div`
  flex: 1;

  && tbody > tr:hover > td {
    background: #fffaf7 !important;
  }

  .ant-pagination {
    padding-right: 16px;
    margin-bottom: 12px !important;
    margin-top: 12px !important;

    .ant-pagination-item-active {
      border: none;
      a {
        background: #ffe7d6;
        color: #ff6700;
        border-radius: 4px;
      }
    }
  }

  .ant-table-thead {
    .ant-table-cell {
      background: none;
      color: #00000090;
      font-size: 14px;
      font-weight: 700;
      padding: 8px;
      border: none;
    }
  }

  .ant-table-cell {
    padding: 8px;

    &.table-first-col {
      font-size: 14px;
    }

    .task-table--numOfRow {
      font-size: 12px;
      font-weight: 700;
    }
  }

  .ant-table-tbody {
    .ant-table-cell {
      padding: 8px;
      font-size: 12px;
      line-height: 150%;
      font-weight: 700;
    }

    .ant-table-row {
      cursor: pointer;
    }

    .Task-scope {
      font-weight: 500;
    }

    .Task-assignees {
      display: flex;
      align-items: center;
      gap: 10px;

      .more-assignee {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 8px;
        border-radius: 100px;
        background-color: ${TASKCOLOR.bg.assignee};
      }
    }

    .Task-more-action {
      font-size: 16px;
      padding: 4px;
      border-radius: 50%;
      cursor: pointer;
    }

    .Task-more-action:hover {
      background-color: ${TASKCOLOR.bg.moreAction};
    }
  }

  .icon-more-actions {
    --more-icon-color: #999999;
    --more-icon-hover: #d9d9da;

    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background-color: var(--more-icon-hover);
    }

    .ant-icon {
      font-size: 16px;
      color: var(--more-icon-color);
    }
  }

  .miss-deadline {
    background: #e4e4e6;
  }
  .at-deadline {
    background: #fcedee;
  }
`

const CrmTaskStatus = styled.div<{ $status: string }>`
  text-align: center;
  width: 60px;
  border: 1px solid ${TASKCOLOR.border.status};
  background-color: ${(props) =>
    TASKCOLOR.status[props.$status as keyof typeof TASKCOLOR]};
  border-radius: 4px;
  text-transform: capitalize;
  padding: 4px 6px;

  &.task-detail-status {
    width: fit-content;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 700;
  }
`

const CrmTaskPriority = styled.div<{ $priority: string }>`
  display: flex;
  align-items: center;
  gap: 6px;

  .priority-icon {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${(props) =>
      TASKCOLOR.priority[props.$priority as keyof typeof TASKCOLOR]};
  }
  .priority-name {
    text-transform: capitalize;
    color: ${(props) =>
      TASKCOLOR.priority[props.$priority as keyof typeof TASKCOLOR]};
  }
`
const CrmModal = styled(Modal)`
  /* max-height: 60vh; */

  width: 600px !important;
  &.ant-modal {
    top: 10vh;
  }

  .ant-modal-content {
    padding: 0 !important;
    border-radius: 8px;
  }
  .ant-modal-header {
    padding: 16px 16px 12px !important;
    margin-bottom: 0px;
  }
  .ant-modal-footer {
    padding: 0px 16px 16px 16px !important;
  }

  .ant-modal-body {
    border-top: 1px solid #d9d9d9;
    max-height: 60vh;
    overflow-y: auto;
    padding: 10px 16px 10px 16px !important;

    .lead-label {
      .ant-form-item-label > label {
        width: 100%;
      }
      .lead-label--click-here {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .ant-modal-title {
    border-radius: 8px;
    text-align: center;
    font-size: 20px;
  }

  .ant-modal-close {
    display: none;
  }

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

  &.modal-task-detail {
    .ant-modal-body {
      max-height: 70vh !important;
    }

    .description-task-img {
      margin-top: 8px;

      img {
        margin-right: 8px;
        height: 120px;
        width: auto;
      }
    }
  }

  &.modal-confirm-draft-note {
    .modal-content {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .modal-content-title {
        .title {
          font-size: 14px;
          font-weight: 700;
        }

        .notice {
          font-size: 14px;
          color: #fc7634;
        }
      }

      .modal-content-body {
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 8px;
      }
      .modal-content-footer {
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
`

export {
  CrmLayout,
  CrmModal,
  CrmTable,
  CrmTaskPriority,
  CrmTaskStatus,
  CrmTaskTable,
  DetailLayout,
  CrmTableInnerStyle
}
