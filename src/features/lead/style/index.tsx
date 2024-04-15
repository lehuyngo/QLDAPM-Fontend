import { Form, Tag } from 'antd'
import ReactQuill from 'react-quill'
import styled from 'styled-components'

import { HIGHLIGHT_NOTE } from '../../../constants/common'

const ContentLeadDetail = styled.div`
  padding: 0px 12px 12px;
  position: relative;
`
const ProcessStatusWrapper = styled.div`
  width: 100%;
  height: 44px;
  border-radius: 100px;
  background-color: #fff4e8;
  padding: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .ant-spin-spinning {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
const HighlightWrapper = styled.div`
  width: 100%;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 8px;
  display: block;
  align-items: center;
  background-color: #fcfcfc;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;

  & > p {
    margin: 0;
  }

  .title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;

    .space {
      width: 14px;
      height: 24px;
      background-color: #b5e4ca;
      border-radius: 4px;
    }
    .text {
      font-size: 14px;
      font-weight: 700;
      line-height: 160%;
    }
  }
`
const TagsWrapper = styled.div`
  width: 100%;
  margin-top: 12px;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 48px;
  max-height: 72px;
  overflow-x: auto;
  gap: 8px;
  scroll-behavior: smooth;

  cursor: pointer;
`
const TagStyled = styled(Tag)`
  margin-inline-end: 0px !important;
  height: 32px !important;
  display: flex !important;
  gap: 4px !important;
  align-items: center !important;
  color: #000 !important;

  &.ant-tag-warning {
    color: black;
  }
  & .ant-tag-close-icon {
    color: #000;
  }

  .icon.icon-delete {
    flex: 1;
    font-size: 14px;
    color: #333;

    &:hover {
      color: #e04a56;
    }
  }
`
const TaskInformationWrapper = styled.div`
  background-color: #fcfcfc;
  padding: 12px 0px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;

  .task-information-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0px 12px;

    .title {
      display: flex;
      align-items: center;
      gap: 6px;

      .text {
        font-size: 14px;
        font-weight: 700;
        line-height: 160%;
      }
    }
    .filter {
      min-width: 96px;

      .btn-filter-status {
        width: 96px !important;
        height: 32px !important;
        .ant-select-selector {
          height: 32px !important;
        }
      }
    }
  }

  .task-information-body {
    margin-top: 12px;
    max-height: calc(
      100vh - 64px - 24px - 44px - 12px - 24px - 32px - 12px - 2px
    );
    overflow: auto;
    min-height: 96px;

    .task-item {
      display: flex;
      align-items: center;
      padding: 4px 12px;
      font-size: 14px;
      gap: 2px;
      cursor: pointer;
      &:hover {
        background-color: #f5f5f5;
      }

      .name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        font-style: normal;
        line-height: 170%;
        color: #000;
      }

      .deadline {
        width: max-content;
        font-style: normal;
        line-height: 170%;
        color: #9f9f9f;
      }

      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
`
const MeetingDateWrapper = styled.div<{ $extractHeight: number }>`
  background-color: #fcfcfc;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;

  .meeting-date-header {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: space-between;
    min-height: 32px;
    align-items: center;

    .add-btn {
      border: 1.5px solid #3b5bd5;
      color: #3b5bd5;
      background-color: #fff;
      line-height: 150%;
      font-weight: 600;
      height: 32px;

      &:hover {
        background-color: #3b5bd5;
        color: #fff;
      }
    }
    .title {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;

      .space {
        width: 14px;
        height: 24px;
        background-color: #b5e4ca;
        border-radius: 4px;
      }
      .text {
        font-size: 14px;
        font-weight: 700;
        line-height: 160%;
      }
    }
  }
  .meeting-date-body {
    margin-top: 12px;
    max-height: calc(
      100vh - 64px - 24px - 44px - 12px -
        ${(props) => props.$extractHeight + 'px'} - 2px - 12px - 24px - 32px -
        12px - 2px
    );
    overflow: auto;
    min-height: 84px;

    .meeting-item {
      display: flex;
      flex-direction: column;
      gap: 6px;

      &:last-child {
        border-bottom: none;
      }

      .ant-collapse {
        border: unset;
        background-color: unset;
        border-radius: unset;

        .ant-collapse-item {
          border-bottom: unset;
          border-radius: unset;

          .ant-collapse-header {
            border: unset;
            align-items: center;
            padding: 0px;

            .ant-collapse-expand-icon {
              padding-inline-end: 2px;
              height: 100%;
              cursor: pointer;
            }

            .ant-collapse-header-text {
              height: 100%;
              .item-header {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                padding: 4px 8px;
                cursor: pointer;

                &:hover {
                  background-color: #f5f5f5;
                }

                .date-time {
                  flex: 1;
                  font-size: 12px;
                  font-weight: 700;
                  line-height: 170%;
                }
              }
            }
          }

          .ant-collapse-content {
            padding: 0px;

            .ant-collapse-content-box {
              padding-block: 0px;
              padding: 0px 8px 0 14px;
            }
            .creator {
              display: flex;
              align-items: flex-start;
              padding: 4px 8px;

              &:hover {
                background-color: #f5f5f5;
                cursor: pointer;
              }

              .creator-avt {
                height: 32px;
                width: 32px;
              }
              .creator-name {
                font-size: 12px;
                line-height: 150%;
              }
            }
          }
        }
      }
    }
  }
`
const MeetingNoteWrapper = styled.div`
  .meeting-note-header-container {
    background-color: #fcfcfc;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc;

    .meeting-note-header {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: space-between;
      min-height: 32px;
      align-items: center;

      .add-btn {
        background-color: #fc7634;
        border-color: #fc7634;
        font-size: 14px;
        font-weight: 600;
        line-height: 150%;
        height: 32px;
      }

      .title {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;

        .space {
          width: 14px;
          height: 24px;
          background-color: #b5e4ca;
          border-radius: 4px;
        }
        .text {
          font-size: 14px;
          font-weight: 700;
          line-height: 160%;
        }
      }
    }
    #create-meeting-note-container {
      margin-top: 8px;
    }
    .loading-data {
      display: flex;
      justify-content: center;
      padding: 12px;
      border-radius: 8px;
    }
  }
  .meeting-note-body {
    margin-top: 12px;

    .empty-meeting-note {
      border: 1px solid #ccc;
      border-radius: 8px;
    }
  }
`
const MeetingNoteReactQuill = styled(ReactQuill)`
  background: white;

  & > .ql-container {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    font-size: 14px;
    height: 80%;
    & > .ql-editor {
      width: 100%;
      height: 200px;
      overflow: auto;
      resize: vertical;
      line-height: calc(22 / 14);

      span.${HIGHLIGHT_NOTE.CLASS} {
        font-weight: ${HIGHLIGHT_NOTE.FONT_WEIGHT} !important;
        color: ${HIGHLIGHT_NOTE.COLOR} !important;
        background-color: ${HIGHLIGHT_NOTE.BACKGROUND_COLOR} !important;
      }
    }
  }

  & .ql-tooltip {
    z-index: 500;
  }

  & > .ql-toolbar {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  & {
    a {
      color: #3b5bd5;
      font-weight: 600;
    }
  }
`
const MeetingNoteItemWrapper = styled.div`
  background-color: #fcfcfc;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;

  &.focus-note {
    box-shadow:
      1px 4px 8px 0px #fc76344c,
      -1px 4px 8px 0px #fc76344c;
    border: 1px solid #fc7634;
  }

  .note-header {
    display: flex;
    /* flex-wrap: wrap; */
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;

    .header-item {
      display: flex;
      align-items: center;
      /* flex-wrap: wrap; */
      gap: 6px;

      &.contributors {
        cursor: pointer;
      }

      &.location {
        max-width: 45%;
      }

      .icon {
        width: 16px;
        display: flex;
        align-items: center;
        font-size: 16px;

        .icon-info {
          color: #fc7634;
        }

        .icon-action {
          color: #999;
          cursor: pointer;
          &.action-edit:hover {
            color: #3b5bd5;
          }
          &.action-delete:hover {
            color: #e04a56;
          }
        }
      }

      &.btn-list {
        flex: 1;
        justify-content: flex-end;
        gap: 12px;
      }
    }
  }

  .note-content {
    margin-top: 12px;
  }
`
const MeetingNoteForm = styled(Form)`
  .notice {
    margin-bottom: 4px;
    font-size: 14px;
    line-height: calc(22 / 14);
    display: flex;
    gap: 4px;
    color: #fc7634;
    .icon {
      margin-top: 2px;
    }
  }
  .sub-field-list {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    .ant-form-item {
      height: 32px;
      &.location {
        width: 22%;
      }
      &.meeting-date {
        width: 22%;
      }
      &.meeting-time {
        width: 22%;
      }
      &.contacts {
        width: calc(34% - 12px);
      }

      .ant-picker {
        height: 32px;
      }

      .ant-input {
        height: 32px !important;
        display: flex;
        align-items: center;
        border-radius: 6px;
      }

      .ant-select {
        height: 32px !important;
        .ant-select-selector {
          height: 32px !important;
          overflow-y: auto;
          padding: 1px 4px;
          .ant-select-selection-overflow {
            flex-wrap: wrap;
            .ant-select-selection-overflow-item {
              display: block;
              max-width: calc(100% - 4px);

              .ant-select-selection-search-input {
                min-width: 4px;
              }
            }
          }

          .ant-select-selection-search-mirror {
            /* display: none; */
          }
        }

        .ant-select-arrow {
          display: none;
        }
      }
    }
  }
  .footer-form {
    display: flex;
    justify-content: flex-end;
    gap: 4px;
    flex-wrap: wrap;
    align-items: center;

    .ant-btn {
      height: 32px;
    }
  }

  .ql-mention-list-container {
    width: unset;
    max-width: 300px;
    max-height: 20vh;
    overflow: auto;
    border: 1px solid #ccc;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    .ql-mention-list-item {
      font-size: 14px;
      line-height: calc(22 / 14);
      padding: 6px 10px;

      &.selected {
        background-color: #fff4e8;
      }
    }
  }
  .mention {
    background-color: #fff4e8;
  }
`
const MeetingNotePopover = styled.div`
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);

  cursor: pointer;

  .option {
    padding: 6px 10px;

    &:hover {
      background-color: #fff4e8;
    }
    &:first-child {
      border-radius: 8px 8px 0px 0px;
    }
    &:last-child {
      border-radius: 0px 0px 8px 8px;
    }
  }
`
const ModeShowContentWrapper = styled.div`
  .show-less-more-mode {
    display: -webkit-box;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
  }
  .meeting-note-view-mode {
    font-size: 14px;
    line-height: calc(22 / 14);
    span.${HIGHLIGHT_NOTE.CLASS} {
      font-weight: ${HIGHLIGHT_NOTE.FONT_WEIGHT} !important;
      color: ${HIGHLIGHT_NOTE.COLOR} !important;
      background-color: ${HIGHLIGHT_NOTE.BACKGROUND_COLOR} !important;
    }
  }

  & ul {
    padding-left: 32px !important;
  }

  & ol {
    padding-left: 32px !important;
  }

  & a {
    color: #3b5bd5;
    font-weight: 600;
    text-decoration: underline;
  }

  .btn-toggle {
    margin-top: 8px;
    text-align: left;
    color: #3b5bd5;
    font-weight: 600;
    cursor: pointer;
  }

  .show-less-more-mode p {
    margin-bottom: 0;
    white-space: pre-wrap;
  }

  .show-less-more p {
    margin-bottom: 0 !important;
    white-space: pre-wrap;
  }

  .mention {
    background-color: #fff4e8;
  }
`
const HighlightToolTipWrapper = styled.div`
  .content-less-mode {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    padding: 6px 0px;
    max-width: 15rem;
    height: 32px;
    display: block;
  }
`
const ContributorPopover = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 20vh;
  max-width: 300px;
  overflow: auto;
  padding-right: 8px;
  .container {
    font-size: 12px;

    .title {
      font-weight: 700;
    }

    & ul {
      padding-left: 16px;
    }
  }
`

export {
  ContentLeadDetail,
  ContributorPopover,
  HighlightToolTipWrapper,
  HighlightWrapper,
  MeetingDateWrapper,
  MeetingNoteForm,
  MeetingNoteItemWrapper,
  MeetingNotePopover,
  MeetingNoteReactQuill,
  MeetingNoteWrapper,
  ModeShowContentWrapper,
  ProcessStatusWrapper,
  TagStyled,
  TagsWrapper,
  TaskInformationWrapper
}
