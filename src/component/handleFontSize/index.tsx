import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'antd'

interface Props {
  text: string
  maxWidth: number
}

export const HandleFontsizeTwoLine: React.FC<Props> = ({ text, maxWidth }) => {
  const calculateFontSize = (textString: string) => {
    const minLength = 12
    const maxFontSize = 18

    let fontSize = Math.floor(maxWidth / textString?.length)

    fontSize = Math.max(fontSize, minLength)
    fontSize = Math.min(fontSize, maxFontSize)

    return fontSize + 'px'
  }

  const fontSize = calculateFontSize(text)

  return (
    <ContainerTowLine maxWidth={maxWidth} fontSize={fontSize}>
      <Tooltip title={text} placement='bottom'>
        <span style={{ fontSize }}>{text}</span>
      </Tooltip>
    </ContainerTowLine>
  )
}

const ContainerTowLine = styled.div<{ maxWidth: number; fontSize: string }>`
  position: relative;
  width: ${(props) => props.maxWidth}px;
  overflow: hidden;
  white-space: ${(props) => (props.fontSize === '12px' ? 'normal' : 'nowrap')};

  text-overflow: ellipsis;
  line-height: 120%;
  -webkit-line-clamp: 2;
  height: max-content;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`

export const HandleFontsizeOneLine: React.FC<Props> = ({ text, maxWidth }) => {
  const calculateFontSize = (textString: string) => {
    const minLength = 10
    const maxFontSize = 14

    let fontSize = Math.floor(maxWidth / textString?.length)

    fontSize = Math.max(fontSize, minLength)
    fontSize = Math.min(fontSize, maxFontSize) // Limit font size to maxFontSize

    return fontSize + 'px'
  }

  const fontSize = calculateFontSize(text)

  return (
    <ContainerOneLine maxWidth={maxWidth}>
      <span style={{ fontSize }}>{text}</span>
    </ContainerOneLine>
  )
}

const ContainerOneLine = styled.div<{ maxWidth: number }>`
  position: relative;
  width: ${(props) => props.maxWidth}px;
  overflow: hidden;
  white-space: 'nowrap';

  text-overflow: ellipsis;
  line-height: 16px;
  -webkit-line-clamp: 1;
  height: 16px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
`
