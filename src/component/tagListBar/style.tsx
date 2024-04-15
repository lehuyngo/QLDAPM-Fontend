import styled from 'styled-components'

const TagListItemStyle = styled.div<{
  $backgroundColor: string
  $textColor: string
}>`
  background-color: ${(props) => props.$backgroundColor};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px 4px 12px;
  border-radius: 50rem;
  width: max-content;
  height: 28px;
  color: ${(props) => props.$textColor};

  .text {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
  }

  .action {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
  }
`

const TagListBarStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
  scroll-behavior: smooth;
  margin-bottom: 8px;
`

export { TagListItemStyle, TagListBarStyle }
