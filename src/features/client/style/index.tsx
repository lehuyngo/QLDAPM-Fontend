import styled from 'styled-components'

const ToolbarClientDetails = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;

  padding: 8px 0;

  .actions {
    display: flex;
    gap: 14px;
    align-items: center;

    .action {
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

const TagsRestStyle = styled.div`
  max-width: 25vw;
  max-height: 30vh;
  overflow: auto;
  display: flex;
  gap: 8px;
  flex-direction: column;
`

const EmptyActivityWrapper = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
`

export { ToolbarClientDetails, TagsRestStyle, EmptyActivityWrapper }
