import React from 'react'
import { Card, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { FiGlobe, FiMail, FiPhone, FiTrash2 } from 'react-icons/fi'
import TextWithTooltip from '../textWithTooltip'
import { isWebsiteHaveHttp } from '../../utils/validate'

interface ClientCardProps {
  title: string
  mail?: string
  phone?: number | string
  website?: string
  onDelete: () => void
  onSelected: () => void
  uuid: string
  pageLink: string
}
const ClientCard: React.FC<ClientCardProps> = ({
  title,
  mail,
  phone,
  website,
  onDelete,
  onSelected,
  uuid,
  pageLink
}) => {
  const linkWeb =
    website && isWebsiteHaveHttp(website)
      ? website
      : website
        ? `https://${website}`
        : null
  return (
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
          className={`card-item--antd-card`}
          bodyStyle={{ padding: '12px' }}
        >
          <TextWithTooltip text={title} className='card-title' />

          {mail && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <FiMail
                style={{ marginRight: '4px', fontSize: '16px', color: '#333' }}
              />
              <TextWithTooltip text={mail} />
            </div>
          )}
          {linkWeb && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <FiGlobe
                style={{ marginRight: '4px', fontSize: '16px', color: '#333' }}
              />

              <Tooltip title={linkWeb}>
                <a
                  onClick={(e) => e.stopPropagation()}
                  href={linkWeb}
                  target='_blank'
                  rel='noreferrer'
                  style={{ fontSize: '14px' }}
                >
                  Website
                </a>
              </Tooltip>
            </div>
          )}
          {phone && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <FiPhone
                style={{ marginRight: '4px', fontSize: '16px', color: '#333' }}
              />
              <span>{phone}</span>
            </div>
          )}
        </Card>
      </Link>
    </div>
  )
}

export default ClientCard
