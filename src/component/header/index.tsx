import { Avatar, ConfigProvider, Popover } from 'antd'
import { useEffect, useState } from 'react'
import { FiChevronLeft, FiPower } from 'react-icons/fi'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useGetClientDetail } from '../../api/reactQuery/Client'
import { useGetContactDetail } from '../../api/reactQuery/Contact'
import { useGetMe } from '../../api/reactQuery/user'
import { UserMeData } from '../../features/interface'
import Timezone from '../timezone/Timezone'
import { CrmHeaderStyled, PopoverHeaderStyle } from './style'

import { useGetBatchMailDetail } from '../../api/reactQuery/BatchMail'
import { useGetLeadDetail } from '../../api/reactQuery/Lead'
import DefaultAvatar from '../../resources/images/image-default.jpg'
import useLogout from '../../hooks/useLogout'

const CrmHeader = () => {
  const [openProfileConfig, setOpenProfileConfig] = useState<boolean>(false)
  const [user, setUser] = useState<UserMeData | null>(null)
  const [title, setTitle] = useState<string>('Lead Management')
  const [nameDetail, setNameDetail] = useState<string | null>(null)

  const { logout } = useLogout()
  const { data, isLoading } = useGetMe()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const {
    clientID = null,
    contactID = null,
    mailID = null,
    leadID = null
  } = useParams()

  const { data: clientDetail } = useGetClientDetail(clientID)
  const { data: leadDetail } = useGetLeadDetail(leadID)
  const { data: contactDetail } = useGetContactDetail(contactID)
  const { data: batchMailDetail } = useGetBatchMailDetail(mailID, true)

  const checkPage = pathname.split('/')

  useEffect(() => {
    if (checkPage.includes('contact')) {
      setTitle('Activities')
      setNameDetail(contactDetail?.fullname)
    }
    if (checkPage.includes('client')) {
      setTitle('Activities')
      setNameDetail(clientDetail?.fullname)
    }
    if (checkPage.includes('card')) {
      setTitle('Business Card Information')
    }
    if (checkPage.includes('contacts')) {
      setTitle('Contact Management')
    }
    if (checkPage.includes('clients')) {
      setTitle('Client Management')
    }
    if (checkPage.includes('leads')) {
      setTitle('Lead Management')
    }
    if (checkPage.includes('lead')) {
      setTitle(leadDetail?.shortname || leadDetail?.fullname)
      if (leadDetail?.client) {
        setNameDetail(leadDetail.client.shortname || leadDetail.client.fullname)
      } else {
        setNameDetail('')
      }
    }
    if (checkPage.includes('cards')) {
      setTitle('Card Management')
    }
    if (checkPage.includes('tasks')) {
      setTitle('Task Management')
    }
    if (checkPage.includes('mails')) {
      setTitle('Batch Mail Management')
    }
    if (checkPage.includes('mail')) {
      setTitle('Batch Mail Detail')
      setNameDetail(batchMailDetail?.subject)
    }
    if (checkPage.includes('mail_board')) {
      setTitle('Mail Dashboard')
    }
    if (checkPage.includes('point_report')) {
      setTitle('Point Report')
    }
  }, [
    clientID,
    contactID,
    clientDetail,
    leadDetail,
    contactDetail,
    checkPage,
    batchMailDetail
  ])

  useEffect(() => {
    if (!isLoading && data) {
      setUser(data)
    } else {
      setUser(null)
    }
  }, [isLoading, data])

  const handleOpenProfileConfig = (open: boolean) => {
    setOpenProfileConfig(open)
  }

  const handleNavigate = () => {
    if (checkPage.includes('contact')) {
      navigate('/contacts')
    }
    if (checkPage.includes('client')) {
      navigate('/clients')
    }
    if (checkPage.includes('lead')) {
      navigate('/')
    }
    if (checkPage.includes('card')) {
      navigate('/cards')
    }
    if (checkPage.includes('mail')) {
      navigate('/mails')
    }
  }

  return (
    <CrmHeaderStyled className='site-layout-background header'>
      <div className='header-title'>
        {['contact', 'client', 'lead', 'card', 'mail'].some((item) =>
          checkPage.includes(item)
        ) && (
          <div
            onClick={handleNavigate}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F4F4F4',
              borderRadius: '50%',
              height: '32px',
              width: '32px',
              cursor: 'pointer'
            }}
          >
            <FiChevronLeft
              style={{
                color: '#999',
                fontSize: '24px'
              }}
            />
          </div>
        )}

        <span className='header-title--content'>{`${title || ''}${
          nameDetail ? ` / ${nameDetail}` : ''
        }`}</span>
      </div>
      <div className='header-userIcon'>
        <Timezone />
        {/* <BellOutlined /> */}
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 4,
              paddingContentHorizontal: 0,
              padding: 0,
              paddingContentVertical: 0
            }
          }}
        >
          <Popover
            content={
              <PopoverHeaderStyle>
                <div className='options'>
                  <div className='config-option logout' onClick={logout}>
                    <FiPower />
                    <div>Logout</div>
                  </div>
                </div>
              </PopoverHeaderStyle>
            }
            trigger='click'
            arrow={false}
            placement='bottomRight'
            open={openProfileConfig}
            onOpenChange={handleOpenProfileConfig}
          >
            <div className='user-info'>
              <span>{user?.displayname}</span>
              <Avatar
                src={user?.avatar ? user.avatar : DefaultAvatar}
                size={40}
              />
            </div>
          </Popover>
        </ConfigProvider>
      </div>
    </CrmHeaderStyled>
  )
}

export { CrmHeader }
