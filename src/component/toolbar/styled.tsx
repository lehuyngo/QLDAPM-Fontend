import styled from 'styled-components'

const TASKCOLOR: any = {
  state: {
    deadline: '#ffe2d1',
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
    todo: '#e4e4e6',
    doing: '#C9BDFF',
    testing: '#FFD88D',
    done: '#B5E4CA'
  },
  priority: {
    high: '#E04A56',
    normal: '#F4BA42',
    low: '#64C1F7'
  }
}

const ToolbarStyle = styled.div`
  display: flex;
  gap: 12px;

  padding: 0px 12px 12px;

  &.card {
    padding: 0px;
    .number {
      display: flex;
      gap: 8px;
      align-items: center;

      .text {
        font-size: 14px;
        font-weight: 400;
        line-height: 160%;
      }
      .value {
        font-size: 12px;
        font-weight: 600;
        line-height: 160%;
        padding: 8px;
        border-radius: 2px;
        background-color: #f4f4f4;
      }
    }
  }

  &.client {
    .toolbar-filter {
      width: 120px;
      border-radius: 8px;
      color: #ccc;
      height: 40px;
      font-weight: 700;

      span:first-child {
        font-size: 15px;
      }
    }
  }

  &.contact {
    .toolbar-send-email {
      .btn-send-email-multi-user {
        display: flex;
        align-items: center;
        border-radius: 6px;
        color: #fc7634 !important;
        background-color: #fcfcfc !important;
        border: 1px solid #fc7634 !important;

        font-size: 12px;
        font-weight: 700;
        line-height: 150%;
        height: 40px;

        &:hover {
          background-color: #fc7634 !important;
          color: #fcfcfc !important;
        }
      }
    }
  }

  &.task {
    padding: 12px;
    background: #fff;
    z-index: 20;
    position: sticky;
    top: 0px;
    border-radius: 8px;

    .task-toolbar-right {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;

      .group-right {
        display: flex;
        gap: 12px;

        .task-type {
          display: flex;
          align-items: center;
          gap: 8px;

          &.deadline .type-color {
            background-color: ${TASKCOLOR.state.deadline};
          }
          &.toolate .type-color {
            background-color: ${TASKCOLOR.state.toolate};
          }

          .type-color {
            height: 24px;
            width: 24px;
            border-radius: 4px;
          }

          .type-name {
            font-size: 14px;
          }
        }

        .task-view-mode {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;

          .icon-view-mode {
            font-size: 24px;
            color: #999999;
          }
        }
      }
    }
  }

  &.lead {
    .toolbar-filter {
      height: unset;
    }
  }

  .toolbar-search-box {
    border-radius: 8px;
    width: 300px;
    height: 40px;

    input::placeholder {
      font-size: 14px;
      font-weight: 400;
      line-height: 170%;
    }
  }

  .toolbar-select-box {
    height: 40px;
    max-width: 320px !important;
    min-width: 140px;

    .ant-select-selector {
      border-radius: 8px;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }

  .toolbar-create {
    border-radius: 8px;
    background-color: #fc7634 !important;
    border-color: #fc7634 !important;
    color: white !important;
    height: 40px;
    font-weight: 700;
    display: flex;
    align-items: center;

    &:hover {
      box-shadow: 0px 2px 4px 0px #fc7734cc;
    }
  }
`

export { ToolbarStyle }
