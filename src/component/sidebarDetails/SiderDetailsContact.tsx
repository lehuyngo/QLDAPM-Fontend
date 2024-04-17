import { Spin } from 'antd'
import { useEffect, useState } from 'react'
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiEdit,
  FiFolder,
  FiPhone,
  FiUsers
} from 'react-icons/fi'
import { useParams } from 'react-router-dom'

import { useGetContactDetail } from '../../api/reactQuery/Contact'
import { DETAIL_PAGE_TYPE, GENDER } from '../../constants/common'

import { useContactService } from '../../features/service/ServiceContact'
import DefaultImage from '../../resources/images/image-default.jpg'
import DefaultNameCard from '../../resources/images/name-card-default.png'
import { useGetScreenWidth } from '../../utils/FunctionsShare'
import { timestampToDate } from '../../utils/convertTimestamp'
import AttachmentsFile from '../attachmentsFile'
import { ImageWithAuth } from '../getImageWithAuth/ImageWithAuth'
import { HandleFontsizeTwoLine } from '../handleFontSize'
import TextWithTooltip from '../textWithTooltip'
import { SiderStyled } from './style'

const SiderDetailsContact = () => {
  const [collapse, setCollapse] = useState<boolean>(false)
  const [openMEditContact, setOpenMEditContact] = useState<boolean>(false)
  const [resetForm, setResetForm] = useState<boolean>(false)
  const [quickEditNameCard, setQuickEditNameCard] = useState<boolean>(false)
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false)

  const { contactID = null } = useParams()
  const screenWidth = useGetScreenWidth()

  const { data: contactDetail, isLoading: loadingContactDetail } =
    useGetContactDetail(contactID)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (screenWidth < 1280) {
      timeoutId = setTimeout(() => {
        setCollapse(true)
      }, 300)
    } else {
      setCollapse(false)
    }

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [screenWidth])

  const handleCloseEditContact = () => {
    setOpenMEditContact(false)
  }

  const handleFromLoading = (loading?: boolean | null) => {
    setIsFormLoading(!!loading)
  }

  const contactService = useContactService()

  const handleUpdate = (data: any) => {
    handleFromLoading(true)

    contactService.updateContact({
      data,
      handleFromLoading,
      onClose: handleCloseEditContact,
      handleResetForm
    })
  }

  const handleResetForm = () => {
    setResetForm(true)
    setTimeout(() => {
      setResetForm(false)
    }, 400)
  }

  const {
    fullname,
    shortname,
    job_title,
    birthday,
    gender,
    phone,
    avatar,
    email,
    name_card
  } = contactDetail || {}

  return (
    <SiderStyled
      trigger={null}
      collapsed={collapse}
      collapsedWidth={80}
      width={320}
      collapsible
      className='site-layout-background'
    >
      {!collapse && (
        <div className='sidebar-crm open'>
          <div className='sidebar-title'>
            <div className='item-container'>
              <div className='icon'>
                <FiUsers style={{ fontSize: '16px', color: '#333' }} />
              </div>
              <span className='text'>Contact Details</span>
            </div>
          </div>
          {loadingContactDetail ? (
            <Spin></Spin>
          ) : (
            <div className='sidebar-contain'>
              <div className='short-info-card'>
                <div className='card-container'>
                  <div className='logo-img contact'>
                    <ImageWithAuth
                      url={avatar?.url ? avatar.url : DefaultImage}
                      preview={false}
                    />
                  </div>
                  <div className='main-info'>
                    <div className='name-code'>
                      <div className='name'>
                        <HandleFontsizeTwoLine
                          text={shortname || fullname}
                          maxWidth={180}
                        />
                      </div>
                    </div>
                    <div className='mail'>
                      <span>
                        <TextWithTooltip text={email} />
                      </span>
                    </div>
                    {phone && (
                      <div className='phone'>
                        <div className='icon'>
                          <FiPhone
                            style={{ fontSize: '16px', color: '#333' }}
                          />
                        </div>
                        <div className='text'>
                          <span>{phone}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='action-edit'>
                  <FiEdit
                    style={{ fontSize: '16px', color: '#ccc' }}
                    onClick={() => setOpenMEditContact(true)}
                  />
                </div>
              </div>
              <div className='full-info-card'>
                <div className='full-info'>
                  <table>
                    <tr>
                      <td className='field'>Full name</td>
                      <td className='value'>
                        <TextWithTooltip text={fullname} />
                      </td>
                    </tr>
                    <tr>
                      <td className='field'>Short name</td>
                      <td className='value'>
                        <TextWithTooltip text={shortname} />
                      </td>
                    </tr>
                    <tr>
                      <td className='field'>Job Title</td>
                      <td className='value'>
                        <TextWithTooltip text={job_title} />
                      </td>
                    </tr>
                    <tr>
                      <td className='field'>Birthday</td>
                      <td className='value'>
                        {birthday ? timestampToDate(birthday) : ''}
                      </td>
                    </tr>
                    <tr>
                      <td className='field'>Gender</td>
                      <td className='value'>
                        {GENDER[gender as keyof typeof GENDER]}
                      </td>
                    </tr>
                    <tr>
                      <td className='field'>Name card</td>
                      <td className='value'></td>
                    </tr>
                  </table>
                </div>
                <div
                  className='name-card'
                  onClick={() => setQuickEditNameCard(true)}
                >
                  <ImageWithAuth
                    url={name_card?.url ? name_card.url : DefaultNameCard}
                    preview={false}
                  />
                </div>
              </div>
            </div>
          )}

          <AttachmentsFile
            uuid={contactID}
            pageType={DETAIL_PAGE_TYPE.CONTACT}
            collapse={!collapse}
          />

          <div className='collapse-btn' onClick={() => setCollapse(!collapse)}>
            <FiChevronsLeft />
            <span className={`collapse-text ${!collapse && 'unCollapse'}`}>
              Collapse sidebar
            </span>
          </div>
        </div>
      )}
      {collapse && (
        <div className='sidebar-crm close'>
          <div className='sidebar-contain'>
            <div className='action contact'>
              <FiUsers
                style={{ fontSize: '20px', color: '#333' }}
                onClick={() => setCollapse(false)}
              />
            </div>
            <div className='action attachment'>
              <FiFolder
                style={{ fontSize: '20px', color: '#333' }}
                onClick={() => setCollapse(false)}
              />
            </div>
            <div
              className='collapse-btn'
              onClick={() => setCollapse(!collapse)}
            >
              <FiChevronsRight />
            </div>
          </div>
        </div>
      )}
    </SiderStyled>
  )
}

export { SiderDetailsContact }
