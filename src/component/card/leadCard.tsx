import React from 'react'
import { Card } from 'antd'
import { FiPhone, FiTrash2 } from 'react-icons/fi'
import { timestampToDateTime } from '../../utils/convertTimestamp'
import { Link } from 'react-router-dom'
import TextWithTooltip from '../textWithTooltip'

interface LeadCardProps {
  title: string
  status: string
  meetingDate?: number
  className?: string // Add the className prop.
  onSelected: () => void // Add the onSelect prop.
  onDelete: () => void
  uuid?: string
  pageLink?: string
}
const LeadCard: React.FC<LeadCardProps> = ({
  title,
  status,
  meetingDate,
  className,
  onSelected,
  onDelete,
  pageLink,
  uuid
}) => (
  <div className='card-item'>
    <FiTrash2
      onClick={(e) => {
        e.stopPropagation()
        onDelete()
        onSelected()
      }}
      style={{
        position: 'absolute',
        top: '12px',
        right: '16px',
        zIndex: 2,
        color: '#CCCCCC',
        fontSize: '16px',
        cursor: 'pointer'
      }}
    />
    <Link to={`/${pageLink}/${uuid}`}>
      <Card
        className={`card-item--antd-card ${className}`}
        bodyStyle={{ padding: '12px' }}
      >
        <TextWithTooltip text={title} className='card-title' />

        {status && (
          <div
            className='lead-status'
            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <span className='fake-icon'></span>
            <span>{status}</span>
          </div>
        )}
        {meetingDate && (
          <div
            className='lead-meeting-date'
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '8px'
            }}
          >
            <span className='icon'>
              <FiPhone />
            </span>
            <span>Meeting at {timestampToDateTime(meetingDate)}</span>
          </div>
        )}
      </Card>
    </Link>
  </div>
)

export default LeadCard
