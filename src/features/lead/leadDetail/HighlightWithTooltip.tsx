import React, { useRef, useEffect, useState } from 'react'
import { Tooltip } from 'antd'

import { HighlightToolTipWrapper } from '../style'

const HighlightWithTooltip: React.FC<HighlightWithTooltipProps> = ({
  text
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
    <HighlightToolTipWrapper>
      <Tooltip
        title={isTextOverflowing ? text : ''}
        overlayStyle={{ maxWidth: '20rem' }}
        overlayInnerStyle={{ maxHeight: '12rem', overflow: 'auto' }}
      >
        <span ref={textRef} className='content-less-mode'>
          {text}
        </span>
      </Tooltip>
    </HighlightToolTipWrapper>
  )
}

interface HighlightWithTooltipProps {
  text: string
}

export default HighlightWithTooltip
