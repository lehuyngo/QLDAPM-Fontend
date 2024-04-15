import React, { useRef, useEffect, useState } from 'react'
import { Tooltip } from 'antd'
import styled from 'styled-components'

interface TextWithTooltipProps {
  text: string
  className?: string
  lineNumber?: number
}

const TextWithTooltip: React.FC<TextWithTooltipProps> = ({
  text,
  className,
  lineNumber = 1
}) => {
  const textRef = useRef<HTMLSpanElement>(null)
  const [isTextOverflowing, setIsTextOverflowing] = useState(false)

  useEffect(() => {
    const element = textRef.current
    if (element) {
      const isOverflowing =
        element.offsetWidth < element.scrollWidth ||
        element.offsetHeight < element.scrollHeight
      setIsTextOverflowing(isOverflowing)
    }
  }, [text])

  return (
    <ToolTipWrapper $lineNumber={lineNumber}>
      <Tooltip
        title={isTextOverflowing ? text : ''}
        overlayStyle={{ maxWidth: '300px' }}
      >
        <span ref={textRef} className={`default ${className}`}>
          {text}
        </span>
      </Tooltip>
    </ToolTipWrapper>
  )
}

export default TextWithTooltip

const ToolTipWrapper = styled.div<{ $lineNumber: number }>`
  .default {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: ${(props) => props.$lineNumber};
    display: -webkit-box;
    -webkit-box-orient: vertical;
    margin-right: 8px;

    &.card-title {
      font-weight: 700;
      margin-right: 20px;
      font-size: 14px !important;
    }
  }
`
