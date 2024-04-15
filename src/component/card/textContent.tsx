import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

interface Props {
  text: string
  color: string
}

const StyleText = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TextContent: React.FC<Props> = ({ text, color }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isTextOverflowing, setIsTextOverflowing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      const textContent = container.textContent || ''
      setDisplayedText(textContent.trim())
      setIsTextOverflowing(container.scrollHeight > container.clientHeight)
      setIsExpanded(false)
    }
  }, [containerRef, text])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const renderTextContent = () => {
    if (!isExpanded) {
      return (
        <>
          <StyleText ref={containerRef} style={{ color: color }}>
            {text}
          </StyleText>
          {isTextOverflowing && (
            <div
              style={{
                cursor: 'pointer',
                color: color,
                textDecoration: 'underline'
              }}
              onClick={toggleExpanded}
            >
              Show More
            </div>
          )}
        </>
      )
    }

    return (
      <div style={{ color: color }}>
        {text}
        <div
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={toggleExpanded}
        >
          Show Less
        </div>
      </div>
    )
  }

  return <div>{renderTextContent()}</div>
}

export default TextContent
