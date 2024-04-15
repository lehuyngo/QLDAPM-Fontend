import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Spin, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiEdit,
  FiFolder,
  FiUsers
} from 'react-icons/fi'
import { useParams } from 'react-router-dom'

import {
  useGetClientDetail,
  useUpdateClient
} from '../../api/reactQuery/Client'
import { DETAIL_PAGE_TYPE } from '../../constants/common'
import ClientForm from '../../features/client/form/ClientForm'
import DefaultImage from '../../resources/images/image-default.jpg'
import { useGetScreenWidth } from '../../utils/FunctionsShare'
import { isWebsiteHaveHttp } from '../../utils/validate'
import AttachmentsFile from '../attachmentsFile'
import { ImageWithAuth } from '../getImageWithAuth/ImageWithAuth'
import { HandleFontsizeTwoLine } from '../handleFontSize'
import { NotificationCustom } from '../notification/Notification'
import TextWithTooltip from '../textWithTooltip'
import { SiderStyled } from './style'

const SiderDetailsClient = () => {
  const [collapse, setCollapse] = useState<boolean>(false)
  const [openClientEdit, setOpenClientEdit] = useState<boolean>(false)
  const [resetForm, setResetForm] = useState<boolean>(false)

  const { clientID = null } = useParams()
  const queryClient = useQueryClient()
  const screenWidth = useGetScreenWidth()

  const { data: ClientDetail, isLoading: loadingClientDetail } =
    useGetClientDetail(clientID)
  const { mutate: mutateUpdate } = useMutation({ mutationFn: useUpdateClient })

  const {
    code,
    company_size,
    fax,
    fullname,
    logo,
    shortname,
    website,
    address
  } = ClientDetail || {}

  const linkWeb =
    website && isWebsiteHaveHttp(website)
      ? website
      : website
        ? `https://${website}`
        : null

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

  const handleUpdate = (data: any, onChangeLoading: any) => {
    onChangeLoading(true)
    mutateUpdate(data, {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries({ queryKey: ['GetClientsList'] })
        queryClient.invalidateQueries({ queryKey: ['GetClientDetail'] })
        queryClient.invalidateQueries({ queryKey: ['GetClientActivities'] })
        NotificationCustom({
          type: 'success',
          message: 'Update success',
          description: 'The client has been updated successfully!'
        })
        onChangeLoading(false)
        setOpenClientEdit(false)
        handleResetForm()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Update fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data', error)
      }
    })
  }

  const handleResetForm = () => {
    setResetForm(true)
    setTimeout(() => {
      setResetForm(false)
    }, 400)
  }

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
              <span className='text'>Client Details</span>
            </div>
          </div>
          {loadingClientDetail ? (
            <Spin></Spin>
          ) : (
            <div className='sidebar-contain'>
              <div className='short-info-card client'>
                <div className='card-container'>
                  <div className='logo-img client'>
                    <ImageWithAuth
                      url={logo?.url ? logo.url : DefaultImage}
                      preview={false}
                    />
                  </div>

                  <div className='main-info'>
                    <div className='name'>
                      <HandleFontsizeTwoLine
                        text={shortname || fullname}
                        maxWidth={180}
                      />
                    </div>
                    <div className='code'>
                      <TextWithTooltip text={code} />
                      {/* <HandleFontsizeOneLine text={code} maxWidth={190} /> */}
                    </div>
                    <div className='website'>
                      <TextWithTooltip text={website} />

                      {/* <HandleFontsizeOneLine text={website} maxWidth={190} /> */}
                    </div>
                  </div>
                </div>
                <div className='action-edit'>
                  <FiEdit
                    style={{ fontSize: '16px', color: '#ccc' }}
                    onClick={() => setOpenClientEdit(true)}
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
                      <td className='field'>Website</td>
                      {linkWeb && (
                        <Tooltip title={linkWeb}>
                          <a
                            href={linkWeb}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <td className='value'>Click here</td>
                          </a>
                        </Tooltip>
                      )}
                    </tr>
                    <tr>
                      <td className='field'>Company size</td>
                      <td className='value'>
                        <TextWithTooltip text={company_size} />
                      </td>
                    </tr>
                    <tr>
                      <td className='field'>Fax</td>
                      <td className='value'>{fax}</td>
                    </tr>
                    <tr>
                      <td className='field'>Address</td>

                      <td className='value'>
                        <TextWithTooltip text={address} />
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          )}
          <AttachmentsFile
            uuid={clientID}
            pageType={DETAIL_PAGE_TYPE.CLIENT}
            collapse={!collapse}
          />

          <div className='collapse-btn' onClick={() => setCollapse(!collapse)}>
            <FiChevronsLeft />
            <span className={`collapse-text unCollapse`}>Collapse sidebar</span>
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
          </div>
          <div className='collapse-btn' onClick={() => setCollapse(!collapse)}>
            <FiChevronsRight />
          </div>
        </div>
      )}

      {openClientEdit && (
        <ClientForm
          visible={openClientEdit}
          setVisible={setOpenClientEdit}
          clientId={clientID}
          onUpdate={handleUpdate}
          resetForm={resetForm}
        />
      )}
    </SiderStyled>
  )
}

export { SiderDetailsClient }

// {collapse ? (
//   <div className='collapse-btn' onClick={() => setCollapse(!collapse)}>
//     <FiChevronsRight />
//   </div>
// ) : (
//   <div className='collapse-btn' onClick={() => setCollapse(!collapse)}>
//     <FiChevronsLeft />
//     <span className={`collapse-text ${!collapse && 'unCollapse'}`}>
//       Collapse sidebar
//     </span>
//   </div>
// )}
