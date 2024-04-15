// External dependencies
import React from 'react'
import styled from 'styled-components'

// Internal dependencies

// StyleSheets

// Assets
import EmptyDataIcon from '../../resources/icons/empty-data.svg'

const EmptyData: React.FC<EmptyDataProps> = ({ className }) => {
  // State logic

  // Ref

  // Variables

  // Custom hooks

  // Higher-order functions

  // Component life-cycle methods (useEffect)

  // Component render
  return (
    <EmptyDataStyle className={className}>
      <div className='container'>
        <div className='icon-empty'>
          <img src={EmptyDataIcon} alt='empty-data' />
        </div>
        <p className='text-empty'>No Data</p>
      </div>
    </EmptyDataStyle>
  )
}

// Props type declaration
interface EmptyDataProps {
  className?: string
}

export default EmptyData

const EmptyDataStyle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: #fcfcfc;

  &.no-padding {
    padding: unset;
  }

  &.no-shadow {
    box-shadow: unset;
  }

  &.empty-data-meeting-note {
    border: 1px solid #ccc;
  }

  .container {
    .icon-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-height: 64px;
        max-width: 40px;
        aspect-ratio: auto 64 / 40;
      }
    }

    .text-empty {
      font-size: 14px;
      line-height: 150%;
      text-align: center;
      color: rgba(0, 0, 0, 0.25);
    }
  }
`
