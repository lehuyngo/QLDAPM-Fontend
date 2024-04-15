import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Popover, Spin } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  useAddLeadClient,
  useCreateLeadClient,
  useDeleteLeadFromClient,
  useGetClientActivities,
  useGetClientContactActivities,
  useGetClientDetail,
  useGetClientLeadActivities,
  useGetClientNoteActivities,
  useGetClientTagActivities,
  useGetLeadsOfClient
} from '../../../api/reactQuery/Client'
import {
  useCreateNoteClient,
  useDeleteNoteClient,
  useGetNoteDetailClient,
  useGetNoteListClient,
  useUpdateNoteClient
} from '../../../api/reactQuery/Note'
import {
  useCreateClientTag,
  useDeleteClientTag
} from '../../../api/reactQuery/Tag'
import { ActiveItem } from '../../../component/activeItem/ActiveItem'
import AddContactQuick from '../../../component/addQuickForm/AddContactQuick'
import AddLeadQuick from '../../../component/addQuickForm/AddLeadQuick'
import CreateNoteForm from '../../../component/addQuickForm/CreateNoteForm'
import EditNoteForm from '../../../component/addQuickForm/EditNoteForm'
import ClientCard from '../../../component/card/clientCard'
import LeadCard from '../../../component/card/leadCard'
import { NoteCard } from '../../../component/card/noteCard'
import DeleteForm from '../../../component/deleteForm/DeleteForm'
import { NotificationCustom } from '../../../component/notification/Notification'
import TagForm from '../../../component/tagForm/TagForm'
import TagListBar from '../../../component/tagListBar/TagListBar'
import { clearSpaceString, getTextColor } from '../../../utils/FunctionsShare'
import { timestampToDateTime } from '../../../utils/convertTimestamp'
import CrmPageDetailClientLayout from '../../layout/detailLayoutClient'

import {
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiMoreHorizontal,
  FiTrash2
} from 'react-icons/fi'
import { useGetContactsList } from '../../../api/reactQuery/Contact'
import { useGetLeadList } from '../../../api/reactQuery/Lead'
import {
  useDeleteClientLinkContact,
  useGetContactsForClient
} from '../../../api/reactQuery/QuickForm'
import TextContent from '../../../component/card/textContent'
import EmptyData from '../../../component/emptyData'
import { FilterByMonth } from '../../../component/filterByTime/filterByMonth'

import ModePage from '../../../component/modePage'
import { MoreActionPopupStyle } from '../../../component/moreAction/style'
import {
  ACTIVITY_TYPE_COLOR,
  SESSION_STORAGE_ITEM,
  TAB_DETAIL_PAGE
} from '../../../constants/common'
import {
  sortDataByCreatedTime,
  sortDataByRangeTime
} from '../../../utils/SortData'
import { ToolbarContactDetails } from '../../contact/style'
import { EmptyActivityWrapper } from '../style'

const ClientDetail: React.FC = () => {
  const [isShowAddContact, setIsShowAddContact] = useState<boolean>(false)
  const [isShowAddLead, setIsShowAddLead] = useState<boolean>(false)
  const [isShowAddNote, setIsShowAddNote] = useState<boolean>(false)
  const [isShowEditNote, setIsShowEditNote] = useState<boolean>(false)
  const [isShowDeleteNote, setIsShowDeleteNote] = useState<boolean>(false)
  const [isShowDeleteTag, setIsShowDeleteTag] = useState<boolean>(false)
  const [isShowAddTag, setIsShowAddTag] = useState<boolean>(false)
  const [isShowDeleteContact, setIsShowDeleteContact] = useState<boolean>(false)
  const [isShowDeleteLead, setIsShowDeleteLead] = useState<boolean>(false)
  const [tab, setTab] = useState<string>(
    sessionStorage.getItem(SESSION_STORAGE_ITEM.CLIENT_DETAIL_TAG) || '0'
  )
  const [noteIDSelected, setNoteIDSelected] = useState<string>('')
  const [tagIDSelected, setTagIDSelected] = useState<string>('')
  const [leadIDSelected, setLeadIDSelected] = useState<string>('')
  const [contactIdSelected, setContactIdSelected] = useState<string | null>(
    null
  )
  const [cardsContactShow, setCardsContactShow] = useState(2)
  const [cardsLeadToShow, setCardsLeadToShow] = useState(2)
  const [notesToShow, setNotesToShow] = useState(2)
  const [resetForm, setResetForm] = useState<boolean>(false)

  const { clientID = null } = useParams()
  const queryClient = useQueryClient()

  const { data: noteData } = useGetNoteDetailClient(clientID, noteIDSelected)
  const { data: listNote, isLoading: loadingNoteToClient } =
    useGetNoteListClient(clientID)
  const { data: clientDetail } = useGetClientDetail(clientID)
  const { data: contactsForClient, isLoading: loadingContactToClient } =
    useGetContactsForClient(clientID)
  const { data: contactList } = useGetContactsList()
  const { data: leadForClient, isLoading: loadingLeadToClient } =
    useGetLeadsOfClient(clientID)
  const { data: leadList } = useGetLeadList()
  const { data: activityTagList, isLoading: loadingActivityTag } =
    useGetClientTagActivities(clientID)
  const { data: activityNoteList, isLoading: loadingActivityNote } =
    useGetClientNoteActivities(clientID)
  const { data: activityClientList, isLoading: loadingActivityClient } =
    useGetClientActivities(clientID)
  const { data: activityContactList, isLoading: loadingActivityContact } =
    useGetClientContactActivities(clientID)
  const { data: activityLeadList, isLoading: loadingActivityLead } =
    useGetClientLeadActivities(clientID)
  const [rangeFilterTime, setRangeFilterTime] = useState({
    from: 0,
    to: 0
  })

  const leadsWithoutClient = leadList?.data?.filter((lead: any) => !lead.client)

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
  if (activityClientList?.data) {
    allActivityList = [
      ...allActivityList,
      ...activityClientList?.data.map((item: any) => ({
        ...item,
        typeActivity: 'client'
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
  if (activityLeadList?.data) {
    allActivityList = [
      ...allActivityList,
      ...activityLeadList?.data.map((item: any) => ({
        ...item,
        typeActivity: 'project'
      }))
    ]
  }

  const lastedActivityTag = activityTagList?.data
    ? Math.max(...activityTagList.data.map((item: any) => item.created_time))
    : 0

  const filteredAllActivityList: any[] =
    sortDataByCreatedTime(
      sortDataByRangeTime(allActivityList, rangeFilterTime)
    ) || []

  const filteredTagActivityList: any[] =
    sortDataByCreatedTime(
      sortDataByRangeTime(activityTagList?.data, rangeFilterTime)
    ) || []

  // Note
  const { mutate: mutateDeleteNote } = useMutation({
    mutationFn: useDeleteNoteClient
  })
  const { mutate: mutateCreateNote } = useMutation({
    mutationFn: useCreateNoteClient
  })
  const { mutate: mutateUpdateNote } = useMutation({
    mutationFn: useUpdateNoteClient
  })

  // Tag
  const { mutate: mutateCreateTag } = useMutation({
    mutationFn: useCreateClientTag
  })
  const { mutate: mutateDeleteTag } = useMutation({
    mutationFn: useDeleteClientTag
  })

  // Contact
  const { mutate: mutateDeleteContact } = useMutation({
    mutationFn: useDeleteClientLinkContact
  })

  // Lead
  const { mutate: mutateCreateLead } = useMutation({
    mutationFn: useCreateLeadClient
  })
  const { mutate: mutateAddLead } = useMutation({
    mutationFn: useAddLeadClient
  })
  const { mutate: mutateDeleteLead } = useMutation({
    mutationFn: useDeleteLeadFromClient
  })

  // Note
  const onDeleteNote = (uuid: string, onChangeLoading: any) => {
    onChangeLoading(true)
    const dataDelete = new FormData()
    dataDelete.append('ownerID', clientID ? clientID : '')
    dataDelete.append('uuid', uuid)
    mutateDeleteNote(dataDelete, {
      onSuccess: (dataDelete) => {
        queryClient.invalidateQueries({ queryKey: ['GetNoteList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetNoteDetail']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientDetail']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientNoteActivities']
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
          queryKey: ['GetNoteDetail']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientDetail']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientNoteActivities']
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
          queryKey: ['GetNoteDetail']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientDetail']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientNoteActivities']
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

  // Tag
  const onCreateTag = (data: any, onChangeLoading: any) => {
    onChangeLoading(true)
    let bodyData = {
      clientID: clientID || '',
      data
    }
    mutateCreateTag(bodyData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['GetClientTags', 'client']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientDetail']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientsList']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientTagActivities']
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
      clientID: clientID || '',
      uuid
    }
    mutateDeleteTag(bodyData, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetClientDetail'] })
        queryClient.invalidateQueries({ queryKey: ['GetClientsList'] })
        queryClient.invalidateQueries({
          queryKey: ['GetClientTagActivities']
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

  // Contact
  const onDeleteContact = (onChangeLoading: any) => {
    onChangeLoading(true)
    const data = { clientUuid: clientID, contactUuid: contactIdSelected }
    mutateDeleteContact(data, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['GetContactsForClient'] })
        queryClient.invalidateQueries({
          queryKey: ['GetClientContactActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The contact has been deleted successfully!'
        })
        onChangeLoading(false)
        setIsShowDeleteContact(false)
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
  const onCreateLead = (value: any, onChangeLoading: any) => {
    const data = { fullname: clearSpaceString(value.fullname) }

    onChangeLoading(true)
    const dataForAdd = {
      clientID: clientID,
      dataLead: data
    }
    mutateCreateLead(dataForAdd, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['GetLeadsOfClient', clientID]
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientsList']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientLeadActivities']
        })
        NotificationCustom({
          type: 'success',
          message: 'Add contacts success',
          description: 'The lead has been created successfully!'
        })
        onChangeLoading(false)
        setIsShowAddLead(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Created lead failed',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }
  const onAddLead = (data: any, onChangeLoading: any) => {
    onChangeLoading(true)
    const dataForAdd = { clientID: clientID, leadsID: data?.uuids }
    mutateAddLead(dataForAdd, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['GetLeadsOfClient', clientID]
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientsList']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientLeadActivities']
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
          message: 'Add leads failed',
          description: error.message
        })
        onChangeLoading(false)
        console.error('Error posting data')
      }
    })
  }
  const onDeleteLead = (onChangeLoading: any) => {
    onChangeLoading(true)
    const data = { clientID: clientID, leadID: leadIDSelected }
    mutateDeleteLead(data, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['GetLeadsOfClient']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientsList']
        })
        queryClient.invalidateQueries({
          queryKey: ['GetClientLeadActivities']
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
  const handleShowMoreContact = () => {
    setCardsContactShow(contactsForClient?.data?.length)
  }
  const handleShowMoreLead = () => {
    setCardsLeadToShow(leadForClient?.length)
  }
  const handleShowMoreNote = () => {
    setNotesToShow(listNote.data.length)
  }
  const handleShowLessCardsContact = () => {
    setCardsContactShow(2)
  }
  const handleShowLessLead = () => {
    setCardsLeadToShow(2)
  }
  const handleShowLessNote = () => {
    setNotesToShow(2)
  }
  const handleChangeTab = (tab: string) => {
    setTab(tab)
    sessionStorage.setItem(SESSION_STORAGE_ITEM.CLIENT_DETAIL_TAG, tab)
  }
  const handleChangeRangeTime = (from: number, to: number) => {
    setRangeFilterTime({ from, to })
  }

  return (
    <>
      <CrmPageDetailClientLayout>
        <div className='main-info'>
          <Card className='last-active'>
            <div className='last-active--item'>
              <div className='item__container'>
                <p>Create Date</p>
                <div>
                  <span>{timestampToDateTime(clientDetail?.created_time)}</span>
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
                }
              ]}
              tab={tab}
              onChangeTab={handleChangeTab}
            />
            <div className='actions'>
              {tab === TAB_DETAIL_PAGE.TAG && (
                <div className='action tag'>
                  <Button onClick={() => setIsShowAddTag(true)}>
                    Create Tag
                  </Button>
                </div>
              )}
              <div className='action filter-by-time'>
                <FilterByMonth onChangeTime={handleChangeRangeTime} />
              </div>
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
                loadingActivityClient ||
                loadingActivityContact ||
                loadingActivityLead ? (
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
                {clientDetail?.tags && (
                  <TagListBar
                    onClickDelete={handleOpenTagDelete}
                    data={clientDetail.tags}
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
          </div>
        </div>
        <div className='card-info'>
          <div className='card-wrapper'>
            <div className='card-title'>
              <span
                className='fake-icon contact'
                style={{ backgroundColor: ACTIVITY_TYPE_COLOR.CONTACT }}
              ></span>
              <div className='card-title--content'>
                Contact{' '}
                {contactsForClient?.data?.length > 0 &&
                  `(${contactsForClient?.data?.length})`}
                {contactsForClient?.data?.length > 2 && (
                  <>
                    {cardsContactShow < contactsForClient?.data?.length ? (
                      <FiChevronDown
                        style={{
                          padding: '4px',
                          marginLeft: '4px',
                          fontSize: '32px',
                          color: '#666'
                        }}
                        onClick={handleShowMoreContact}
                      />
                    ) : (
                      <FiChevronUp
                        style={{
                          padding: '4px',
                          marginLeft: '4px',
                          fontSize: '32px',
                          color: '#666'
                        }}
                        onClick={handleShowLessCardsContact}
                      />
                    )}
                  </>
                )}
              </div>

              <Button
                type='primary'
                className='add-quick-btn'
                ghost
                onClick={() => setIsShowAddContact(true)}
              >
                Add
              </Button>
            </div>
            {loadingContactToClient ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%'
                }}
              >
                <Spin></Spin>
              </div>
            ) : (
              <>
                {sortDataByCreatedTime(contactsForClient?.data)
                  ?.slice(0, cardsContactShow)
                  .map((card: any, idx: number) => (
                    <ClientCard
                      key={card.uuid}
                      title={card.shortname || card.fullname}
                      mail={card.email}
                      phone={card.phone}
                      onDelete={() => setIsShowDeleteContact(true)}
                      onSelected={() => setContactIdSelected(card.uuid)}
                      uuid={card.uuid}
                      pageLink='contact'
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
                {leadForClient?.data?.length > 0 &&
                  `(${leadForClient?.data?.length})`}
                {leadForClient?.data?.length > 2 && (
                  <>
                    {cardsLeadToShow < leadForClient?.data?.length ? (
                      <FiChevronDown
                        style={{
                          padding: '4px',
                          marginLeft: '4px',
                          fontSize: '32px',
                          color: '#666'
                        }}
                        onClick={handleShowMoreLead}
                      />
                    ) : (
                      <FiChevronUp
                        style={{
                          padding: '4px',
                          marginLeft: '4px',
                          fontSize: '32px',
                          color: '#666'
                        }}
                        onClick={handleShowLessLead}
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
            {loadingLeadToClient ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%'
                }}
              >
                <Spin></Spin>
              </div>
            ) : (
              <>
                {sortDataByCreatedTime(leadForClient?.data)
                  ?.slice(0, cardsLeadToShow)
                  .map((card: any, idx: number) => (
                    <LeadCard
                      key={card.uuid}
                      title={card.shortname || card.fullname}
                      status={card.status}
                      onDelete={() => setIsShowDeleteLead(true)}
                      onSelected={() => setLeadIDSelected(card.uuid)}
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
                className='fake-icon note'
                style={{ backgroundColor: ACTIVITY_TYPE_COLOR.NOTE }}
              ></span>
              <div className='card-title--content'>
                Note {}
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
            {loadingNoteToClient ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%'
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
                        <span
                          style={{
                            color: getTextColor(card.color)
                          }}
                        >
                          {card.title}
                        </span>
                      }
                      extra={
                        <Popover
                          content={
                            <MoreActionPopupStyle>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setNoteIDSelected(card.uuid)
                                  setIsShowEditNote(true)
                                }}
                              >
                                <FiEdit
                                  style={{
                                    fontSize: '16px',
                                    color: '#333'
                                  }}
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
      </CrmPageDetailClientLayout>

      {/* Modal Region */}
      <>
        {/* Tag Create */}
        {isShowAddTag && (
          <TagForm
            tagExisted={clientDetail?.tags}
            from='client'
            title={'Create Tag'}
            visible={isShowAddTag}
            onClose={() => setIsShowAddTag(false)}
            onCreate={onCreateTag}
          />
        )}
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

        {/* Contact Quick Create */}
        {isShowAddContact && (
          <AddContactQuick
            clientID={clientID}
            visible={isShowAddContact}
            setVisible={setIsShowAddContact}
            data={contactList?.data}
            dataExisted={contactsForClient?.data}
          />
        )}
        {isShowDeleteContact && (
          <DeleteForm
            title='Delete Contact'
            question='Do you want to delete this contact?'
            onDelete={onDeleteContact}
            visible={isShowDeleteContact}
            onClose={() => setIsShowDeleteContact(false)}
          />
        )}

        {/* Lead Quick Create */}
        {isShowAddLead && (
          <AddLeadQuick
            visible={isShowAddLead}
            setVisible={setIsShowAddLead}
            onCreate={onCreateLead}
            onAdd={onAddLead}
            data={leadsWithoutClient}
            dataExisted={leadForClient?.data}
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
        {isShowAddNote && (
          <CreateNoteForm
            visible={isShowAddNote}
            ownerID={clientID?.toString()}
            setVisible={setIsShowAddNote}
            onCreate={onCreateNote}
            isResetForm={resetForm}
          />
        )}
        {isShowEditNote && (
          <EditNoteForm
            onUpdate={onEditNote}
            id={noteIDSelected}
            oldData={noteData}
            visible={isShowEditNote}
            ownerID={clientID?.toString()}
            setVisible={setIsShowEditNote}
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
      </>
    </>
  )
}

export default ClientDetail
