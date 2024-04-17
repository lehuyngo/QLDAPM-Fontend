// External dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Divider, Popover, message } from 'antd'
import randomColor from 'randomcolor'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  FiClock,
  FiEdit,
  FiEdit3,
  FiMapPin,
  FiTrash2,
  FiUsers
} from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'

// Internal dependencies
import {
  useBatchCreateHighlight,
  useBatchDeleteHighlight
} from '../../../api/reactQuery/Highlight'
import {
  useDeleteMeetingNote,
  useUpdateMeetingNote
} from '../../../api/reactQuery/MeetingNote'
import DeleteForm from '../../../component/deleteForm/DeleteForm'
import { NotificationCustom } from '../../../component/notification/Notification'
import TextWithTooltip from '../../../component/textWithTooltip'
import { useLeadDetailContext } from '../../../hooks/useLeadDetailContext'
import { IContact } from '../../../interfaces/IContact'
import {
  IHighlight,
  IHighlightCreate,
  ISelectedText
} from '../../../interfaces/IHighlight'
import { IMeetingNote } from '../../../interfaces/IMeetingNote'
import { IUser } from '../../../interfaces/IUser'
import { timestampToDateTime } from '../../../utils/convertTimestamp'

import MeetingNoteFormEdit from '../form/MeetingNoteFormEdit'
import ModeShowContent from './ModeShowContent'

// StyleSheets
import { HIGHLIGHT_NOTE } from '../../../constants/common'
import {
  endsWithWhitespace,
  findTextWithPrefixAndSuffix,
  startsWithWhitespace
} from '../../../utils/FunctionsShare'
import {
  ContributorPopover,
  MeetingNoteItemWrapper,
  MeetingNotePopover
} from '../style'

// Assets

const MeetingNoteItem: React.FC<MeetingNoteItemProps> = ({
  meetingNote,
  highlightList,
  currentUser,
  existMeetingNoteList,
  contactList,
  mentionModule
}) => {
  // State logic
  const [isCreator, setCreator] = useState<boolean>(false)
  const [isContributor, setContributor] = useState<boolean>(false)
  const [isOpeningToDelete, setOpeningToDelete] = useState<boolean>(false)
  const [isOpenPopover, setIsOpenPopover] = useState<boolean>(false)
  const [selectedText, setSelectedText] = useState<ISelectedText>({
    selectedText: '',
    rangeCount: 0,
    range: null
  })
  const [newTitleTask, setNewTitleTask] = useState<string>('')
  const [popoverStyle, setPopoverStyle] = useState({
    position: 'fixed',
    zIndex: '99',
    display: 'none'
  } as React.CSSProperties)
  const [isOpeningToCreateTask, setOpeningToCreateTask] =
    useState<boolean>(false)

  // Ref
  const mouseTrackRef = useRef<any>(null)

  // Variables
  const { uuid, note, start_time, location, contributors, creator } =
    meetingNote
  let attendees: IUser[] = []
  let contacts: IContact[] = []
  contributors?.forEach((item: any) => {
    if (item.user) {
      attendees.push(item.user)
    } else if (item.contact) {
      contacts.push(item.contact)
    }
  })

  // Custom hooks
  const queryClient = useQueryClient()
  const {
    selectedLead,
    selectedNote,
    handleChangeSelectNote,
    isOpeningFormEditNote,
    handleChangeOpenFormEditNote,
    handleChangeStateFormCreateNote,
    handleChangeFetchAPI
  } = useLeadDetailContext()
  const { mutate: mutateDeleteMeetingNote } = useMutation({
    mutationFn: useDeleteMeetingNote
  })
  const { mutate: mutateUpdateMeetingNote } = useMutation({
    mutationFn: useUpdateMeetingNote
  })
  const { mutate: mutateBatchCreateHighlight } = useMutation({
    mutationFn: useBatchCreateHighlight
  })
  const { mutate: mutateBatchDeleteHighlight } = useMutation({
    mutationFn: useBatchDeleteHighlight
  })
  const existHighlights_v0 = useMemo(
    () =>
      highlightList?.filter(
        (item: IHighlight) =>
          item.meeting_note_uuid === uuid && !item?.position_uuid
      ) || [],
    [highlightList, uuid]
  )
  const existHighlights_v1 = useMemo(
    () =>
      highlightList?.filter(
        (item: any) => item.meeting_note_uuid === uuid && item?.position_uuid
      ) || [],
    [highlightList, uuid]
  )

  // Higher-order functions

  // Component life-cycle methods (useEffect)
  useEffect(() => {
    if (currentUser?.uuid === creator?.uuid) {
      setCreator(true)
    } else {
      setCreator(false)
    }
  }, [currentUser, creator])
  useEffect(() => {
    if (
      !!contributors?.find(
        (item: any) => item.user && item.user.uuid === currentUser?.uuid
      )
    ) {
      setContributor(true)
    } else {
      setContributor(false)
    }
  }, [contributors, currentUser])
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        mouseTrackRef.current &&
        !mouseTrackRef.current.contains(event.target)
      ) {
        setIsOpenPopover(false)
      }
    }

    document.addEventListener('mouseup', handleClickOutside)

    return () => {
      document.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])

  const batchDeleteHighlight = (removeHighlightList: string[]) => {
    const dataSend: any = {
      meetingNoteID: uuid,
      bodyRequest: {
        uuids: removeHighlightList
      }
    }

    mutateBatchDeleteHighlight(dataSend, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['GetHighlightList', selectedLead?.uuid]
        })
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        handleChangeFetchAPI(false)
      }
    })
  }
  const batchCreateHighlight = (highLightTags: IHighlightCreate[]) => {
    let data: any = {}

    data['highlights'] = highLightTags

    const dataSend: any = {
      meetingNoteID: uuid,
      bodyRequest: data
    }

    mutateBatchCreateHighlight(dataSend, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['GetHighlightList', selectedLead?.uuid]
        })
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        handleChangeFetchAPI(false)
      }
    })
  }
  const onDeleteMeetingNote = (onChangeLoading: any) => {
    onChangeLoading(true)
    let bodyData = {
      projectID: selectedLead?.uuid || '',
      meetingNoteID: selectedNote?.uuid || ''
    }
    mutateDeleteMeetingNote(bodyData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['GetMeetingNoteList', selectedLead?.uuid]
        })
        queryClient.invalidateQueries({
          queryKey: ['GetMeetingList', selectedLead?.uuid]
        })
        queryClient.invalidateQueries({
          queryKey: ['GetHighlightList', selectedLead?.uuid]
        })
        NotificationCustom({
          type: 'success',
          message: 'Delete success',
          description: 'The meeting note has been deleted successfully!'
        })
        onChangeLoading(false)
        handleChangeSelectNote(null)
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

  const handleMouseUp = async (e: any) => {
    let selected = document?.getSelection()

    if (selected?.toString().length && e.button === 2) {
      const preventContextMenu = function (event: any) {
        event.preventDefault()
      }
      document.addEventListener('contextmenu', preventContextMenu)

      let result = '' as any
      let myPromise = new Promise(function (resolve) {
        setTimeout(function () {
          resolve(window?.getSelection()?.toString().trim() || '')
        }, 50)
      })
      result = await myPromise

      if (!result || result === selectedText) {
        setPopoverStyle({ ...popoverStyle, display: 'none' })
        setIsOpenPopover(false)
        return
      }

      let headNodeSelected = selected?.anchorNode?.parentElement
      let tailNodeSelected = selected.getRangeAt(0)?.endContainer?.parentElement
      let text = selected?.toString()

      setSelectedText({
        selectedText: text,
        rangeCount: selected?.rangeCount,
        range: selected?.getRangeAt(0),
        headNodeSelected:
          headNodeSelected?.getAttribute('class') === HIGHLIGHT_NOTE.CLASS
            ? headNodeSelected
            : null,
        tailNodeSelected:
          tailNodeSelected?.getAttribute('class') === HIGHLIGHT_NOTE.CLASS
            ? tailNodeSelected
            : null
      })

      let x = `${e.clientX}px`
      let y = `${e.clientY + window.scrollY + 10}px`
      setPopoverStyle({ ...popoverStyle, left: x, top: y, display: 'block' })
      setIsOpenPopover(true)

      document.removeEventListener('contextmenu', preventContextMenu)
    }
  }
  const createHighlight = () => {
    let text = selectedText.selectedText

    let maxLen = 8192
    if (text.length > maxLen) {
      message.error(
        `The highlighted content accepts up to ${maxLen} characters!`
      )
      return
    }

    let e = document.createElement('span')
    e.setAttribute('class', HIGHLIGHT_NOTE.CLASS)
    e.setAttribute('id', uuidv4())
    e.setAttribute('style', `color: ${randomColor()};`)

    let spaceHead = document.createElement('span')
    spaceHead.innerHTML = ' '
    let spaceTail = document.createElement('span')
    spaceTail.innerHTML = ' '
    let startSpace = startsWithWhitespace(text)
    let endSpace = endsWithWhitespace(text)

    e.innerHTML = text.trim()
    let range = selectedText.range

    if (startSpace && selectedText.headNodeSelected) {
      range.setStart(range.startContainer, range.startOffset + 1)
    }
    if (endSpace && selectedText.tailNodeSelected) {
      range.setEnd(range.endContainer, range.endOffset - 1)
    }

    if (selectedText.rangeCount) {
      range.deleteContents() // Deletes selected text…
      if (endSpace && !selectedText.tailNodeSelected) {
        range.insertNode(spaceTail) // … and inserts the space element at end place
      }
      range.insertNode(e) // … and inserts the new element at its place
      if (startSpace && !selectedText.headNodeSelected) {
        range.insertNode(spaceHead) // … and inserts the space element at first place
      }
    }

    let newContent =
      document.querySelector(`#view-meeting-note-${uuid}`)?.innerHTML || ''
    newContent = newContent
      .replaceAll('&nbsp;', ' ')
      .replaceAll(HIGHLIGHT_NOTE.STYLE_SUB, HIGHLIGHT_NOTE.STYLE_MAIN)

    let removeHighlights_v0: string[] = []
    let removeHighlights_v1: string[] = []
    let addHighlights: IHighlightCreate[] = []

    // Convert to new data of highlights by add position_uuid ===
    if (existHighlights_v0?.length > 0) {
      let highlightsOldToNew = findTextWithPrefixAndSuffix(
        newContent,
        HIGHLIGHT_NOTE.PREFIX,
        HIGHLIGHT_NOTE.SUFFIX
      )

      highlightsOldToNew.forEach((item: any) => {
        let e = document.createElement('span')
        e.setAttribute('class', HIGHLIGHT_NOTE.CLASS)
        e.setAttribute('id', uuidv4())
        e.setAttribute('style', `color: ${randomColor()};`)
        e.innerHTML = item.text

        newContent = newContent.replace(item.fullText, e.outerHTML)
      })

      existHighlights_v0?.forEach((item: any) => {
        removeHighlights_v0.push(item.uuid)
      })
    }
    // ===

    let n = document.createElement('div')
    n.innerHTML = newContent
    let highlights = n.querySelectorAll(`.${HIGHLIGHT_NOTE.CLASS}`)
    let highlightsInNewContent: IHighlightCreate[] = []

    highlights.forEach((item: Element) => {
      if (item.innerHTML) {
        highlightsInNewContent.push({
          title: item.innerHTML,
          position_uuid: item.id
        })
      } else {
        newContent = newContent.replace(item.outerHTML, '')
        item.remove()
      }
    })

    newContent = newContent
      .replaceAll('<span></span>', '')
      .replaceAll('<span> </span>', ' ')

    highlightsInNewContent.forEach((newItem) => {
      if (
        !existHighlights_v1?.find(
          (existItem: IHighlight) =>
            existItem.position_uuid === newItem.position_uuid
        )
      ) {
        addHighlights.push(newItem)
      }
    })

    existHighlights_v1?.forEach((existItem: IHighlight) => {
      if (
        !highlightsInNewContent.find(
          (newItem) => newItem.position_uuid === existItem.position_uuid
        )
      ) {
        removeHighlights_v1.push(existItem.uuid)
      }
    })

    handleChangeFetchAPI(true)

    if (removeHighlights_v0.length > 0) {
      batchDeleteHighlight(removeHighlights_v0)
    }

    if (removeHighlights_v1.length > 0) {
      batchDeleteHighlight(removeHighlights_v1)
    }

    if (addHighlights.length > 0) {
      batchCreateHighlight(addHighlights)
    }
    const dataSend: any = {
      projectID: selectedLead?.uuid,
      meetingNoteID: uuid,
      bodyRequest: {
        location: meetingNote.location,
        start_time: meetingNote.start_time,
        note: newContent
      }
    }

    mutateUpdateMeetingNote(dataSend, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['GetMeetingNoteList', selectedLead?.uuid]
        })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The highlight has been updated successfully!'
        })
        handleChangeFetchAPI(false)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        handleChangeFetchAPI(false)
      }
    })
  }

  // Component render
  return (
    <>
      <MeetingNoteItemWrapper id={`meeting-note-${uuid}`}>
        {isOpeningFormEditNote && selectedNote?.uuid === uuid ? (
          <MeetingNoteFormEdit
            isOpened={isOpeningFormEditNote}
            onCloseForm={() => {
              handleChangeOpenFormEditNote(false)
              handleChangeStateFormCreateNote({ open: false, openFrom: 0 })
              handleChangeSelectNote(null)
            }}
            currentUser={currentUser}
            contactList={contactList}
            mentionModule={mentionModule}
            existMeetingNoteList={existMeetingNoteList}
            highlightList={highlightList}
          />
        ) : (
          <>
            <div className='note-header'>
              {!!start_time && (
                <div className='header-item date-time'>
                  <div className='icon'>
                    <FiClock className='icon-info' />
                  </div>
                  <p>{timestampToDateTime(start_time)}</p>
                </div>
              )}
              {!!location && (
                <div className='header-item location'>
                  <div className='icon'>
                    <FiMapPin className='icon-info' />
                  </div>
                  <TextWithTooltip text={location}></TextWithTooltip>
                </div>
              )}
              {contributors?.length > 0 && (
                <Popover
                  content={
                    <ContributorPopover>
                      {attendees.length > 0 && (
                        <div className='attendee container'>
                          <p className='title'>Attendees</p>
                          <ul className='list'>
                            {attendees.map((item) => {
                              return (
                                <li key={item.uuid} className='item'>
                                  {item.code && `${item.code} - `}
                                  {item.displayname}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                      {contacts.length > 0 && (
                        <div className='contact container'>
                          <p className='title'>Contacts</p>
                          <ul className='list'>
                            {contacts.map((item) => {
                              return (
                                <li key={item.uuid} className='item'>
                                  {item.shortname || item.fullname}
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                    </ContributorPopover>
                  }
                >
                  <div className='header-item contributors'>
                    <div className='icon'>
                      <FiUsers className='icon-info' />
                    </div>
                    <p>{contributors.length}</p>
                  </div>
                </Popover>
              )}
              <div className='header-item creator'>
                <div className='icon'>
                  <FiEdit3 className='icon-info' />
                </div>
                <p>
                  {`${creator?.displayname}`}
                  {`${creator?.code ? ` - ${creator?.code}` : ''}`}
                </p>
              </div>

              {isCreator ? (
                <div className='header-item btn-list'>
                  <div className='icon'>
                    <FiEdit
                      className='icon-action action-edit'
                      onClick={() => {
                        handleChangeSelectNote(meetingNote)
                        handleChangeOpenFormEditNote(true)
                        handleChangeStateFormCreateNote({
                          open: false,
                          openFrom: 0
                        })
                      }}
                    />
                  </div>
                  <div className='icon'>
                    <FiTrash2
                      className='icon-action action-delete'
                      onClick={() => {
                        handleChangeSelectNote(meetingNote)
                        setOpeningToDelete(true)
                      }}
                    />
                  </div>
                </div>
              ) : isContributor ? (
                <div className='header-item btn-list'>
                  <div className='icon'>
                    <FiEdit
                      className='icon-action action-edit'
                      onClick={() => {
                        handleChangeSelectNote(meetingNote)
                        handleChangeOpenFormEditNote(true)
                        handleChangeStateFormCreateNote({
                          open: false,
                          openFrom: 0
                        })
                      }}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            <Divider style={{ margin: '0px' }} />
            <div
              className='note-content'
              onMouseUp={(e: any) => {
                if (isCreator || isContributor) {
                  handleMouseUp(e)
                } else {
                  return
                }
              }}
            >
              <ModeShowContent content={note} uuid={uuid} />
            </div>
          </>
        )}
      </MeetingNoteItemWrapper>
      {/* Delete Meeting Note */}
      {isCreator || isContributor ? (
        <>
          {isOpeningToDelete && selectedNote?.uuid === uuid && (
            <DeleteForm
              title='Delete Meeting Note'
              question='Do you want to delete this meeting note?'
              onDelete={(onChangeLoading: any) =>
                onDeleteMeetingNote(onChangeLoading)
              }
              visible={isOpeningToDelete && selectedNote?.uuid === uuid}
              onClose={() => handleChangeSelectNote(null)}
            />
          )}
          {isOpenPopover && (
            <MeetingNotePopover style={popoverStyle} ref={mouseTrackRef}>
              <div
                className='option'
                onClick={() => {
                  setPopoverStyle({
                    ...popoverStyle,
                    display: 'none'
                  })
                  if (typeof selectedText.selectedText === 'string') {
                    setNewTitleTask(selectedText.selectedText)
                    setOpeningToCreateTask(true)
                  }
                }}
              >
                Quote as task
              </div>

              <div
                className='option'
                onClick={() => {
                  createHighlight()

                  setPopoverStyle({
                    ...popoverStyle,
                    display: 'none'
                  })
                }}
              >
                Quote as highlight
              </div>
            </MeetingNotePopover>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  )
}
// Props types declaration

interface MeetingNoteItemProps {
  meetingNote: IMeetingNote
  currentUser: IUser
  highlightList: IHighlight[]
  contactList: IContact[]
  existMeetingNoteList: IMeetingNote[]
  mentionModule: any
}

export default MeetingNoteItem
