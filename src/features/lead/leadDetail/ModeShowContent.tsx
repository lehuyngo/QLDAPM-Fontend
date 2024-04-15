// External dependencies
import React, { useEffect, useRef, useState } from 'react'

// Internal dependencies

// StyleSheets
import { ModeShowContentWrapper } from '../style'
import { HEIGHT_LIST_MEETING_NOTE } from '../../../constants/common'

const ModeShowContent: React.FC<ModeShowContentProps> = ({ content, uuid }) => {
  // State logic
  const [showFullContent, setShowFullContent] = useState(false)
  const [enableShowMoreShowLessButton, setEnableShowMoreShowLessButton] =
    useState<boolean>()

  // Ref
  const topRef = useRef<any>(null)
  const contentRef = useRef<any>(null)

  // Variables

  // Custom hooks

  // Higher-order functions

  // Component life-cycle methods (useEffect)
  useEffect(() => {
    if (topRef.current) {
      const contentWidth = topRef.current.offsetWidth

      const newDiv = document.createElement('div')
      newDiv.style.width = contentWidth
      newDiv.innerHTML = content
      topRef.current.appendChild(newDiv)
      let childrenNodes = newDiv.children
      let lines = 0
      for (let i = 0; i < childrenNodes.length; i++) {
        let nodeName = childrenNodes[i].nodeName

        if (HEIGHT_LIST_MEETING_NOTE[nodeName]) {
          lines =
            lines +
            Math.ceil(
              childrenNodes[i].scrollHeight / HEIGHT_LIST_MEETING_NOTE[nodeName]
            )
        } else {
          lines = lines + Math.ceil(childrenNodes[i].scrollHeight / 22)
        }
      }
      newDiv.remove()
      setEnableShowMoreShowLessButton(lines > 8)
    }
  }, [content])

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList?.toggle('show-less-more-mode')
    }
  }, [showFullContent])

  const toggleContent = () => {
    setShowFullContent(!showFullContent)
  }

  // Component render
  return (
    <ModeShowContentWrapper>
      <div ref={topRef} className='meeting-note-view-mode' />
      <div
        ref={contentRef}
        id={uuid ? `view-meeting-note-${uuid}` : ''}
        className={`meeting-note-view-mode ${
          enableShowMoreShowLessButton ? 'show-less-more-mode' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      {enableShowMoreShowLessButton && (
        <div className='btn-toggle'>
          <span onClick={toggleContent}>
            {showFullContent ? 'Show Less' : 'Show More'}
          </span>
        </div>
      )}
    </ModeShowContentWrapper>
  )
}

// Props type declaration
interface ModeShowContentProps {
  content: string
  uuid?: string
}

export default ModeShowContent
