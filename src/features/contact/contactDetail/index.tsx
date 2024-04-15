import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Popover, Spin } from 'antd'
import React, { useState } from 'react'
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiMoreHorizontal,
  FiTrash2
} from 'react-icons/fi'
import { useParams } from 'react-router-dom'

import { useGetClientsList } from '../../../api/reactQuery/Client'
import {
  useCreateContactShortClick,
  useGetContactActivities,
  useGetContactClientActivities,
  useGetContactDetail,
  useGetContactLeadActivities,
  useGetContactMailActivities,
  useGetContactNoteActivities,
  useGetContactShortClickActivities,
  useGetContactTagActivities
} from '../../../api/reactQuery/Contact'
import { useGetLeadList } from '../../../api/reactQuery/Lead'
import {
  useCreateNoteContact,
  useDeleteNoteContact,
  useGetNoteDetailContact,
  useGetNoteListContact,
  useUpdateNoteContact
} from '../../../api/reactQuery/Note'
import {
  useAddLeadsToContact,
  useCreateQuickLeadToContact,
  useDeleteContactLinkClient,
  useDeleteContactLinkLead,
  useGetClientsForContact,
  useGetLeadToContactList
} from '../../../api/reactQuery/QuickForm'
import {
  useCreateContactTag,
  useDeleteContactTag
} from '../../../api/reactQuery/Tag'
import { ActiveItem } from '../../../component/activeItem/ActiveItem'
import AddClientQuick from '../../../component/addQuickForm/AddClientQuick'
import AddLeadQuick from '../../../component/addQuickForm/AddLeadQuick'
import CreateNoteForm from '../../../component/addQuickForm/CreateNoteForm'
import EditNoteForm from '../../../component/addQuickForm/EditNoteForm'
import ClientCard from '../../../component/card/clientCard'
import LeadCard from '../../../component/card/leadCard'
import { NoteCard } from '../../../component/card/noteCard'
import TextContent from '../../../component/card/textContent'
import DeleteForm from '../../../component/deleteForm/DeleteForm'
import EmptyData from '../../../component/emptyData'
import { FilterByMonth } from '../../../component/filterByTime/filterByMonth'
import ModePage from '../../../component/modePage'
import { MoreActionPopupStyle } from '../../../component/moreAction/style'
import { NotificationCustom } from '../../../component/notification/Notification'
import AddActive from '../../../component/pointForm'
import TagForm from '../../../component/tagForm/TagForm'
import TagListBar from '../../../component/tagListBar/TagListBar'
import {
  ACTIVITY_TYPE_COLOR,
  SESSION_STORAGE_ITEM,
  TAB_DETAIL_PAGE
} from '../../../constants/common'
import { clearSpaceString, getTextColor } from '../../../utils/FunctionsShare'
import {
  sortDataByCreatedTime,
  sortDataByRangeTime
} from '../../../utils/SortData'
import { timestampToDateTime } from '../../../utils/convertTimestamp'
import CrmPageDetailContactLayout from '../../layout/detailLayoutContact'
import CreateEmail from '../mailForm/CreateEmail'
import DetailsEmail from '../mailForm/DetailsEmail'
import ContactPoint from '../point'
import { EmptyActivityWrapper, ToolbarContactDetails } from '../style'

const ContactDetail: React.FC = () => {
  const [isShowAddClient, setIsShowAddClient] = useState<boolean>(false)
  const [isShowAddLead, setIsShowAddLead] = useState<boolean>(false)
  const [isShowAddNote, setIsShowAddNote] = useState<boolean>(false)
  const [isShowEditNote, setIsShowEditNote] = useState<boolean>(false)
  const [isShowDeleteNote, setIsShowDeleteNote] = useState<boolean>(false)
  const [isShowAddTag, setIsShowAddTag] = useState<boolean>(false)
  const [isShowDeleteTag, setIsShowDeleteTag] = useState<boolean>(false)
  const [isShowDeleteClient, setIsShowDeleteClient] = useState<boolean>(false)
  const [isShowDeleteLead, setIsShowDeleteLead] = useState<boolean>(false)
  const [openMDetailsEmail, setOpenMDetailsEmail] = useState<boolean>(false)
  const [tab, setTab] = useState<string>(
    sessionStorage.getItem(SESSION_STORAGE_ITEM.CONTACT_DETAIL_TAG) || '0'
  )
  const [noteIDSelected, setNoteIDSelected] = useState<string>('')
  const [tagIDSelected, setTagIDSelected] = useState<string>('')
  const [clientIdSelected, setClientIdSelected] = useState<string | null>(null)
  const [leadUuidSelected, setLeadUuidSelected] = useState<string | null>(null)
  const [cardsClientToShow, setCardsClientToShow] = useState(2)
  const [cardsLeadToShow, setCardsLeadToShow] = useState(2)
  const [notesToShow, setNotesToShow] = useState(2)
  const [openMCreateEmail, setOpenMCreateEmail] = useState<boolean>(false)
  const [rangeFilterTime, setRangeFilterTime] = useState({
    from: 0,
    to: 0
  })
  const [resetForm, setResetForm] = useState<boolean>(false)
  const [isLoadingCreateShortClick, setLoadingCreateShortClick] =
    useState<boolean>(false)
  const [isShowAddActive, setIsShowAddActive] = useState<boolean>(false)

  const { contactID = null } = useParams()
  const queryClient = useQueryClient()

  const { data: listNote, isLoading: loadingNoteToContact } =
    useGetNoteListContact(contactID ? contactID : null)
  const { data: noteData } = useGetNoteDetailContact(contactID, noteIDSelected)
  const { data: contactDetail } = useGetContactDetail(contactID)
  const { data: clientsForContact, isLoading: loadingClientToContact } =
    useGetClientsForContact(contactID)
  const { data: clientsList } = useGetClientsList()
  const { data: leadsForContact, isLoading: loadingLeadToContact } =
    useGetLeadToContactList(contactID)
  const { data: leadList } = useGetLeadList()
  const { data: activityTagList, isLoading: loadingActivityTag } =
    useGetContactTagActivities(contactID)
  const { data: activityNoteList, isLoading: loadingActivityNote } =
    useGetContactNoteActivities(contactID)
  const { data: activityMailList, isLoading: loadingActivityMail } =
    useGetContactMailActivities(contactID)
  const { data: activityContactList, isLoading: loadingActivityContact } =
    useGetContactActivities(contactID)
  const { data: activityClientList, isLoading: loadingActivityClient } =
    useGetContactClientActivities(contactID)
  const { data: activityShortClickList, isLoading: loadingActivityShortClick } =
    useGetContactShortClickActivities(contactID)
  const { data: activityLeadList, isLoading: loadingActivityLead } =
    useGetContactLeadActivities(contactID)

  const lastedActivityTag = activityTagList?.data
    ? Math.max(...activityTagList.data.map((item: any) => item.created_time))
    : 0
  const lastedActivityMail = activityMailList?.data
    ? Math.max(...activityMailList.data.map((item: any) => item.created_time))
    : 0

  let allActivityList: any[] = []
  if (activityTagList?.data) {
    allActivityList = [
      ...allActivityList,
      ...activityTagList?.data.map((item: any) => ({
        ...item,
        typeActivity: 'tag'
      }))
    ]
  }
  if (activityNoteList?.data) {
    allActivityList = [
      ...allActivityList,
      ...activityNoteList?.data.map((item: any) => ({
        ...item,
        typeActivity: 'note'
      }))
    ]
  }
  if (activityMailList?.data) {
    allActivityList = [
      ...allActivityList,
      ...activityMailList?.data.map((item: any) => ({
        ...item,
        typeActivity: 'mail'
      }))
    ]
  }
  if (activityContactList?.data) {
    allActivityList = [
      ...allActivityList,
      ...activityContactList?.data.map((item: any) => ({
        ...item,
        typeActivity: 'contact'
      }))
    ]
  }
  if (activityClientList?.data) {
    allActivityList = [
      ...allActivityList,
      ...activityClientList?.data.map((item: any) => ({
        ...item,
        typeActivity: 'client'
      }))
    ]
  }
  if (activityShortClickList?.data) {
    allActivityList = [
      ...allActivityList,
      ...activityShortClickList?.data.map((item: any) => ({
        ...item,
        typeActivity: 'mail'
      }))
    ]
  }
  if (activityLeadList?.data) {
    allActivityList = [
      ...allActivityList,
      ...activityLeadList?.data.map((item: any) => ({
        ...item,
        typeActivity: 'project'
      }))
    ]
  }

  let mailActivityList: any[] = []
  if (activityMailList?.data) {
    mailActivityList = [
      ...mailActivityList,
      ...activityMailList?.data.map((item: any) => ({
        ...item,
        typeActivity: 'mail'
      }))
    ]
  }
  if (activityShortClickList?.data) {
    mailActivityList = [
      ...mailActivityList,
      ...activityShortClickList?.data.map((item: any) => ({
        ...item,
        typeActivity: 'mail'
      }))
    ]
  }

  const filteredAllActivityList: any[] =
    sortDataByCreatedTime(
      sortDataByRangeTime(allActivityList, rangeFilterTime)
    ) || []

  const filteredTagActivityList: any[] =
    sortDataByCreatedTime(
      sortDataByRangeTime(activityTagList?.data, rangeFilterTime)
    ) || []

  const filteredMailActivityList: any[] =
    sortDataByCreatedTime(
      sortDataByRangeTime(mailActivityList, rangeFilterTime)
    ) || []

  //note
  const { mutate: mutateDeleteNote } = useMutation({
    mutationFn: useDeleteNoteContact
  })
  const { mutate: mutateCreateNote } = useMutation({
    mutationFn: useCreateNoteContact
  })
  const { mutate: mutateUpdateNote } = useMutation({
    mutationFn: useUpdateNoteContact
  })

  //Quick client
  const { mutate: mutateDeleteClient } = useMutation({
    mutationFn: useDeleteContactLinkClient
  })

  // Quick Lead
  const { mutate: mutateAddQuickLead } = useMutation({
    mutationFn: useCreateQuickLeadToContact
  })
  const { mutate: mutateAddLeads } = useMutation({
    mutationFn: useAddLeadsToContact
  })
  const { mutate: mutateDeleteLead } = useMutation({
    mutationFn: useDeleteContactLinkLead
  })

  // Quick Tag
  const { mutate: mutateCreateTag } = useMutation({
    mutationFn: useCreateContactTag
  })
  const { mutate: mutateDeleteTag } = useMutation({
    mutationFn: useDeleteContactTag
  })

  // Short Click
  const { mutate: mutateCreateShortClick } = useMutation({
    mutationFn: useCreateContactShortClick
  })

  // Tag
  const onCreateTag = (data: any, onChangeLoading: any) => {
    onChangeLoading(true)
    let bodyData = {
      contactID: contactID || '',
      data
    }
    mutateCreateTag(bodyData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['GetClientTags', 'contact']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetContactDetail']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetContactsList']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetContactTagActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The tag has been created successfully!'
        })
        onChangeLoading(false)
        setIsShowAddTag(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }
  const onDeleteTag = (uuid: string, onChangeLoading: any) => {
    onChangeLoading(true)
    let bodyData = {
      contactID: contactID || '',
      uuid
    }
    mutateDeleteTag(bodyData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetContactDetail'] })
        queryClient.invalidateQueries({ queryKey: ['GetContactsList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactTagActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The tag has been deleted successfully!'
        })
        onChangeLoading(false)
        setIsShowDeleteTag(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }

  // Client
  const onDeleteClient = (onChangeLoading: any) => {
    onChangeLoading(true)
    const data = { contactUuid: contactID, clientUuid: clientIdSelected }
    mutateDeleteClient(data, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetClientsForContact'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactClientActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The client has been deleted successfully!'
        })
        onChangeLoading(false)
        setIsShowDeleteClient(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }

  // Lead
  const onCreateQuickLead = (value: any, onChangeLoading: any) => {
    const data = { fullname: clearSpaceString(value.fullname) }

    onChangeLoading(true)
    const dataForCreate = {
      leadInfo: { new_project: data },
      contactUuid: contactID
    }
    mutateAddQuickLead(dataForCreate, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetLeadToContactList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactsList']
        })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The lead has been created successfully!'
        })
        onChangeLoading(false)
        setIsShowAddLead(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }
  const onAddLeads = (data: any, onChangeLoading: any) => {
    onChangeLoading(true)
    const dataForAdd = { contactUuid: contactID, leadsList: data }
    mutateAddLeads(dataForAdd, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetLeadToContactList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactsList']
        })
        NotificationCustom({
          type: 'success',
          message: 'Add leads success',
          description: 'The lead has been created successfully!'
        })
        onChangeLoading(false)
        setIsShowAddLead(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Add lead fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }
  const onDeleteLead = (onChangeLoading: any) => {
    onChangeLoading(true)
    const data = { contactUuid: contactID, leadUuid: leadUuidSelected }
    mutateDeleteLead(data, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetLeadToContactList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactsList']
        })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The lead has been deleted successfully!'
        })
        onChangeLoading(false)
        setIsShowDeleteLead(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }

  // Note
  const onDeleteNote = (uuid: string, onChangeLoading: any) => {
    onChangeLoading(true)
    const dataDelete = new FormData()
    dataDelete.append('ownerID', contactID ? contactID : '')
    dataDelete.append('uuid', uuid)
    mutateDeleteNote(dataDelete, {
      onSuccess: (dataDelete) => {
        queryClient.invalidateQueries({ queryKey: ['GetNoteList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactNoteActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The note has been deleted successfully!'
        })
        onChangeLoading(false)
        setIsShowDeleteNote(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }
  const onCreateNote = (data: FormData, onChangeLoading: any) => {
    onChangeLoading(true)
    mutateCreateNote(data, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetNoteList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactNoteActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The note has been created successfully!'
        })
        onChangeLoading(false)
        setIsShowAddNote(false)
        handleResetForm()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }
  const onEditNote = (data: any, onChangeLoading: any) => {
    onChangeLoading(true)
    mutateUpdateNote(data, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetNoteList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetContactNoteActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Update success',
          description: 'The note has been updated successfully!'
        })
        onChangeLoading(false)
        setIsShowEditNote(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Update fail',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }
  // Short Click
  const onCreateShortClick = () => {
    setLoadingCreateShortClick(true)
    let bodyData = {
      uuid: contactID || '',
      body: {
        content: ''
      }
    }
    mutateCreateShortClick(bodyData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['GetContactShortClickActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The tag has been created successfully!'
        })
        setLoadingCreateShortClick(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        setLoadingCreateShortClick(false)
        console.error('Error posting data')
      }
    })
  }

  const handleResetForm = () => {
    setResetForm(true)
    setTimeout(() => {
      setResetForm(false)
    }, 400)
  }

  const handleOpenTagDelete = (uuid: string) => {
    setTagIDSelected(uuid)
    setIsShowDeleteTag(true)
  }

  const handleCloseTagDelete = () => {
    setTagIDSelected('')
    setIsShowDeleteTag(false)
  }

  const handleShowMoreClient = () => {
    setCardsClientToShow(clientsForContact?.data?.length)
  }

  const handleShowMoreCardsLead = () => {
    setCardsLeadToShow(leadsForContact?.data?.length)
  }

  const handleShowMoreNote = () => {
    setNotesToShow(listNote.data.length)
  }

  const handleShowLessCardsClient = () => {
    setCardsClientToShow(2)
  }

  const handleShowLessCardsLead = () => {
    setCardsLeadToShow(2)
  }

  const handleShowLessNote = () => {
    setNotesToShow(2)
  }

  const handleCancelCreateEmail = () => {
    setOpenMCreateEmail(false)
  }

  const handleOpenCreateEmail = () => {
    setOpenMCreateEmail(true)
  }

  const handleCancelDetailsEmail = () => {
    setOpenMDetailsEmail(false)
  }

  const handleOpenDetailsEmail = () => {
    setOpenMDetailsEmail(true)
  }

  const handleChangeTab = (tab: string) => {
    setTab(tab)
    sessionStorage.setItem(SESSION_STORAGE_ITEM.CONTACT_DETAIL_TAG, tab)
  }

  const handleChangeRangeTime = (from: number, to: number) => {
    setRangeFilterTime({ from, to })
  }

  return (
    <>
      <CrmPageDetailContactLayout>
        <div className='main-info'>
          <Card className='last-active'>
            <div className='last-active--item'>
              <div className='item__container'>
                <p>Create Date</p>
                <div>
                  <span>
                    {timestampToDateTime(contactDetail?.created_time)}
                  </span>
                </div>
              </div>
            </div>
            {lastedActivityTag !== 0 && (
              <div className='last-active--item'>
                <div className='item__container'>
                  <p>Last Activities (Tag)</p>
                  <div>
                    <span>{timestampToDateTime(lastedActivityTag)}</span>
                  </div>
                </div>
              </div>
            )}
            {lastedActivityMail !== 0 && (
              <div className='last-active--item'>
                <div className='item__container'>
                  <p>Last Activities (Mail)</p>
                  <div>
                    <span>{timestampToDateTime(lastedActivityMail)}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <ToolbarContactDetails>
            <ModePage
              tabs={[
                {
                  label: 'History',
                  value: TAB_DETAIL_PAGE.HISTORY
                },
                {
                  label: 'Tag',
                  value: TAB_DETAIL_PAGE.TAG
                },
                {
                  label: 'Email',
                  value: TAB_DETAIL_PAGE.EMAIL
                },
                {
                  label: 'Activities',
                  value: TAB_DETAIL_PAGE.ACTIVITIES
                }
              ]}
              tab={tab}
              onChangeTab={handleChangeTab}
            />
            <div className='actions'>
              {tab === TAB_DETAIL_PAGE.TAG && (
                <>
                  <div className='action tag'>
                    <Button onClick={() => setIsShowAddTag(true)}>
                      Create Tag
                    </Button>
                  </div>
                </>
              )}
              {tab === TAB_DETAIL_PAGE.EMAIL && (
                <>
                  <div className='action email'>
                    {/* <div className='short-click'>
                      <Button
                        loading={isLoadingCreateShortClick}
                        onClick={onCreateShortClick}
                      >
                        Short Click
                      </Button>
                    </div> */}
                    <div className='send-mail'>
                      <Button onClick={handleOpenCreateEmail}>Send Mail</Button>
                    </div>
                  </div>
                </>
              )}

              {tab === TAB_DETAIL_PAGE.ACTIVITIES && (
                <>
                  <div className='action email'>
                    {/* <div className='short-click'>
                      <Button
                        loading={isLoadingCreateShortClick}
                        onClick={onCreateShortClick}
                      >
                        Short Click
                      </Button>
                    </div> */}
                    <div className='send-mail'>
                      <Button onClick={() => setIsShowAddActive(true)}>
                        Add Activities
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {tab !== TAB_DETAIL_PAGE.ACTIVITIES && (
                <div className='action filter-by-time'>
                  <FilterByMonth onChangeTime={handleChangeRangeTime} />
                </div>
              )}
            </div>
          </ToolbarContactDetails>
          <div
            style={{ height: `calc(100vh - 188px)` }}
            className='main-content-wrapper'
          >
            {tab === TAB_DETAIL_PAGE.HISTORY && (
              <>
                {loadingActivityTag ||
                loadingActivityNote ||
                loadingActivityMail ||
                loadingActivityContact ||
                loadingActivityLead ||
                loadingActivityShortClick ||
                loadingActivityClient ? (
                  <>
                    <Spin></Spin>
                  </>
                ) : (
                  <>
                    {filteredAllActivityList?.length === 0 ? (
                      <EmptyActivityWrapper>
                        <EmptyData />
                      </EmptyActivityWrapper>
                    ) : (
                      <>
                        {filteredAllActivityList?.map((item: any) => (
                          <ActiveItem
                            key={item?.creator?.uuid + item?.created_time}
                            type={item.typeActivity}
                            action={item?.type ? item?.type : 0}
                            creator={item?.creator}
                            contact={
                              item?.typeActivity === 'mail'
                                ? item?.contact
                                : null
                            }
                            object={item[item.typeActivity]}
                            createdAt={item?.created_time}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {tab === TAB_DETAIL_PAGE.TAG && (
              <>
                {contactDetail?.tags && (
                  <TagListBar
                    onClickDelete={handleOpenTagDelete}
                    data={contactDetail.tags}
                  />
                )}
                {loadingActivityTag ? (
                  <>
                    <Spin></Spin>
                  </>
                ) : (
                  <>
                    {filteredTagActivityList?.length === 0 ? (
                      <EmptyActivityWrapper>
                        <EmptyData />
                      </EmptyActivityWrapper>
                    ) : (
                      <>
                        {filteredTagActivityList?.map((item: any) => (
                          <ActiveItem
                            key={item?.creator?.uuid + item?.created_time}
                            type='tag'
                            action={item?.type ? item?.type : 0}
                            creator={item?.creator}
                            object={item['tag']}
                            createdAt={item?.created_time}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
              </>
            )}
            {tab === TAB_DETAIL_PAGE.EMAIL && (
              <>
                {loadingActivityMail || loadingActivityShortClick ? (
                  <Spin></Spin>
                ) : (
                  <>
                    {filteredMailActivityList?.length === 0 ? (
                      <EmptyActivityWrapper>
                        <EmptyData />
                      </EmptyActivityWrapper>
                    ) : (
                      <>
                        {filteredMailActivityList?.map((item: any) => (
                          <ActiveItem
                            key={item?.creator?.uuid + item?.created_time}
                            type='mail'
                            action={item?.type ? item?.type : 0}
                            creator={item?.creator}
                            contact={item?.contact}
                            object={item['mail']}
                            createdAt={item?.created_time}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
              </>
            )}

            {tab === TAB_DETAIL_PAGE.ACTIVITIES && (
              <ContactPoint contactId={contactID} />
            )}
          </div>
        </div>
        <div className='card-info'>
          <div className='card-wrapper'>
            <div className='card-title'>
              <span
                className='fake-icon client'
                style={{ backgroundColor: ACTIVITY_TYPE_COLOR.CLIENT }}
              ></span>
              <div className='card-title--content'>
                Client{' '}
                {clientsForContact?.data?.length > 0 &&
                  `(${clientsForContact?.data?.length})`}
                {clientsForContact?.data?.length > 2 && (
                  <>
                    {cardsClientToShow < clientsForContact?.data?.length ? (
                      <FiChevronDown
                        style={{
                          padding: '4px',
                          marginLeft: '4px',
                          fontSize: '32px',
                          color: '#666'
                        }}
                        onClick={handleShowMoreClient}
                      />
                    ) : (
                      <FiChevronUp
                        style={{
                          padding: '4px',
                          marginLeft: '4px',
                          fontSize: '32px',
                          color: '#666'
                        }}
                        onClick={handleShowLessCardsClient}
                      />
                    )}
                  </>
                )}
              </div>

              <Button
                type='primary'
                ghost
                className='add-quick-btn'
                onClick={() => setIsShowAddClient(true)}
              >
                Add
              </Button>
            </div>
            {loadingClientToContact ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Spin></Spin>
              </div>
            ) : (
              <>
                {sortDataByCreatedTime(clientsForContact?.data)
                  ?.slice(0, cardsClientToShow)
                  .map((card: any, idx: number) => (
                    <ClientCard
                      key={card.uuid}
                      title={card.shortname || card.fullname}
                      mail={card.email}
                      website={card.website}
                      phone={card.phone}
                      onDelete={() => setIsShowDeleteClient(true)}
                      onSelected={() => setClientIdSelected(card.uuid)}
                      uuid={card.uuid}
                      pageLink='client'
                    />
                  ))}
              </>
            )}
          </div>

          <div className='card-wrapper'>
            <div className='card-title'>
              <span
                className='fake-icon lead'
                style={{ backgroundColor: ACTIVITY_TYPE_COLOR.LEAD }}
              ></span>
              <div className='card-title--content'>
                Lead{' '}
                {leadsForContact?.data?.length > 0 &&
                  `(${leadsForContact?.data?.length})`}
                {leadsForContact?.data?.length > 2 && (
                  <>
                    {cardsLeadToShow < leadsForContact?.data?.length ? (
                      <FiChevronDown
                        style={{
                          padding: '4px',
                          marginLeft: '4px',
                          fontSize: '32px',
                          color: '#666'
                        }}
                        onClick={handleShowMoreCardsLead}
                      />
                    ) : (
                      <FiChevronUp
                        style={{
                          padding: '4px',
                          marginLeft: '4px',
                          fontSize: '32px',
                          color: '#666'
                        }}
                        onClick={handleShowLessCardsLead}
                      />
                    )}
                  </>
                )}
              </div>
              <Button
                type='primary'
                className='add-quick-btn'
                ghost
                onClick={() => setIsShowAddLead(true)}
              >
                Add
              </Button>
            </div>
            {loadingLeadToContact ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Spin></Spin>
              </div>
            ) : (
              <>
                {sortDataByCreatedTime(leadsForContact?.data)
                  ?.slice(0, cardsLeadToShow)
                  .map((card: any, idx: number) => (
                    <LeadCard
                      key={card.uuid}
                      title={card.shortname || card.fullname}
                      status={card.status}
                      onDelete={() => setIsShowDeleteLead(true)}
                      onSelected={() => setLeadUuidSelected(card.uuid)}
                      uuid={card.uuid}
                      pageLink='lead'
                    />
                  ))}
              </>
            )}
          </div>

          <div className='card-wrapper'>
            <div className='card-title'>
              <span
                className='fake-icon lead'
                style={{ backgroundColor: ACTIVITY_TYPE_COLOR.NOTE }}
              ></span>
              <div className='card-title--content'>
                Note {''}
                {listNote?.data?.length > 0 && `(${listNote?.data?.length})`}
                {listNote?.data?.length > 2 && (
                  <>
                    {notesToShow < listNote?.data?.length ? (
                      <FiChevronDown
                        style={{
                          padding: '4px',
                          marginLeft: '4px',
                          fontSize: '32px',
                          color: '#666'
                        }}
                        onClick={handleShowMoreNote}
                      />
                    ) : (
                      <FiChevronUp
                        style={{
                          padding: '4px',
                          marginLeft: '4px',
                          fontSize: '32px',
                          color: '#666'
                        }}
                        onClick={handleShowLessNote}
                      />
                    )}
                  </>
                )}
              </div>
              <Button
                type='primary'
                className='add-quick-btn'
                ghost
                onClick={() => setIsShowAddNote(true)}
              >
                Add
              </Button>
            </div>
            {loadingNoteToContact ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Spin></Spin>
              </div>
            ) : (
              <>
                {listNote?.data
                  ?.slice(0, notesToShow)
                  .map((card: any, idx: number) => (
                    <NoteCard
                      key={idx}
                      title={
                        <span style={{ color: getTextColor(card.color) }}>
                          {card.title}
                        </span>
                      }
                      extra={
                        <Popover
                          content={
                            <MoreActionPopupStyle>
                              <div
                                className='action'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setNoteIDSelected(card.uuid)
                                  setIsShowEditNote(true)
                                }}
                              >
                                <FiEdit
                                  style={{ fontSize: '16px', color: '#333' }}
                                />
                                <span className='text'>Edit</span>
                              </div>
                              <div
                                className='action'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setNoteIDSelected(card.uuid)
                                  setIsShowDeleteNote(true)
                                }}
                              >
                                <FiTrash2
                                  style={{ fontSize: '16px', color: '#333' }}
                                />
                                <span className='text'>Delete</span>
                              </div>
                            </MoreActionPopupStyle>
                          }
                          // arrow={false}
                          // id={'more-action-' + record.id}
                          trigger={['hover']}
                          placement='left'
                        >
                          <div
                            className='icon-more-actions'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiMoreHorizontal
                              style={{
                                fontSize: '16px',
                                color: '#999',
                                cursor: 'pointer'
                              }}
                            />
                          </div>
                        </Popover>
                      }
                      style={{ backgroundColor: card.color }}
                    >
                      <TextContent
                        text={card.content}
                        color={getTextColor(card.color)}
                      />
                    </NoteCard>
                  ))}
              </>
            )}
          </div>
        </div>
      </CrmPageDetailContactLayout>

      {/* Modal Region */}
      <>
        {/* Create Email */}
        {/* <CreateEmail
          open={openMCreateEmail}
          onCloseModal={handleCancelCreateEmail}
        /> */}
        {openMCreateEmail && (
          <CreateEmail
            selectedUserList={[contactDetail]}
            open={openMCreateEmail}
            onCloseModal={handleCancelCreateEmail}
          />
        )}

        {/* Details Email */}
        {openMDetailsEmail && (
          <DetailsEmail
            isOpen={openMDetailsEmail}
            onCloseModal={handleCancelDetailsEmail}
            mailId={null}
            receiverId={null}
          />
        )}

        {/* Tag Create */}
        {isShowAddTag && (
          <TagForm
            tagExisted={contactDetail?.tags}
            from='contact'
            title={'Create Tag'}
            visible={isShowAddTag}
            onClose={() => setIsShowAddTag(false)}
            onCreate={onCreateTag}
          />
        )}
        {/* Tag Delete */}
        {isShowDeleteTag && (
          <DeleteForm
            title='Delete Tag'
            question='Do you want to delete this tag?'
            onDelete={(onChangeLoading: any) =>
              onDeleteTag(tagIDSelected, onChangeLoading)
            }
            visible={isShowDeleteTag}
            onClose={handleCloseTagDelete}
          />
        )}

        {/* Client Quick Create */}
        {isShowAddClient && (
          <AddClientQuick
            contactID={contactID}
            visible={isShowAddClient}
            setVisible={setIsShowAddClient}
            data={clientsList?.data}
            dataExisted={clientsForContact?.data}
          />
        )}

        {isShowDeleteClient && (
          <DeleteForm
            title='Delete Client'
            question='Do you want to delete this client?'
            onDelete={onDeleteClient}
            visible={isShowDeleteClient}
            onClose={() => setIsShowDeleteClient(false)}
          />
        )}

        {/* Lead Quick Create */}
        {isShowAddLead && (
          <AddLeadQuick
            onAdd={onAddLeads}
            visible={isShowAddLead}
            setVisible={setIsShowAddLead}
            onCreate={onCreateQuickLead}
            data={leadList?.data}
            dataExisted={leadsForContact?.data}
          />
        )}

        {isShowDeleteLead && (
          <DeleteForm
            question='Do you want to delete this lead?'
            onDelete={onDeleteLead}
            visible={isShowDeleteLead}
            onClose={() => setIsShowDeleteLead(false)}
          />
        )}

        {/* Note Quick Create */}
        {isShowEditNote && (
          <EditNoteForm
            onUpdate={onEditNote}
            id={noteIDSelected}
            oldData={noteData}
            visible={isShowEditNote}
            ownerID={contactID?.toString()}
            setVisible={setIsShowEditNote}
          />
        )}
        {isShowAddNote && (
          <CreateNoteForm
            visible={isShowAddNote}
            ownerID={contactID?.toString()}
            setVisible={setIsShowAddNote}
            onCreate={onCreateNote}
            isResetForm={resetForm}
          />
        )}
        {isShowDeleteNote && (
          <DeleteForm
            title='Delete Note'
            question='Do you want to delete this note?'
            onDelete={(onChangeLoading: any) =>
              onDeleteNote(noteIDSelected, onChangeLoading)
            }
            visible={isShowDeleteNote}
            onClose={() => setIsShowDeleteNote(false)}
          />
        )}

        {isShowAddActive && (
          <AddActive
            visible={isShowAddActive}
            onClose={() => setIsShowAddActive(false)}
            contactId={contactID}
          />
        )}
      </>
    </>
  )
}

export default ContactDetail
