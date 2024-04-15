// External dependencies
import { Spin } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import Quill from 'quill'
import 'quill-mention'
import 'quill-paste-smart'
import MagicUrl from 'quill-magic-url'

// Internal dependencies
import EmptyData from '../../../component/emptyData'
import { useLeadDetailContext } from '../../../hooks/useLeadDetailContext'
import { IContact } from '../../../interfaces/IContact'
import { IHighlight } from '../../../interfaces/IHighlight'
import { IMeetingNote } from '../../../interfaces/IMeetingNote'
import { IUser } from '../../../interfaces/IUser'
import { sortDataByNewestTime } from '../../../utils/SortData'
import ViewImageModal from '../../viewImage/modal/ViewImageModal'
import MeetingNoteFormCreate from '../form/MeetingNoteFormCreate'
import MeetingNoteItem from './MeetingNoteItem'

// StyleSheets
import { StyledButton } from '../../../component/componentOfForm/ComponentOfForm.style'
import { MeetingNoteWrapper } from '../style'
import { IMAGE_NOTE } from '../../../constants/common'

// Assets

// Config Quill Editor
const Link = Quill.import('formats/link')
Link.sanitize = function (url: string) {
  // quill by default creates relative links if scheme is missing.
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

Quill.register('modules/magicUrl', MagicUrl)

const MeetingNote: React.FC<MeetingNoteProps> = ({
  meetingNoteList,
  isLoading,
  userList,
  contactList,
  currentUser,
  highlightList
}) => {
  // State logic
  const [stateViewImageModal, setStateViewImageModal] = useState<{
    open: boolean
    fileID: string
    fileName: string
  }>({ open: false, fileID: '', fileName: '' })

  // Ref

  // Variables

  // Custom hooks
  const {
    selectedMeeting,
    handleChangeRecentNote,
    stateFormCreateNote,
    handleChangeStateFormCreateNote,
    handleChangeOpenFormEditNote
  } = useLeadDetailContext()
  const mentionModule = useMemo(
    () => ({
      allowedChars: /.*/,
      mentionDenotationChars: ['@'],
      source: function (searchTerm: any, renderList: any) {
        let values = (userList || []).map((item: IUser) => ({
          id: item.uuid,
          value: item.displayname
        }))

        if (searchTerm.length === 0) {
          renderList(values, searchTerm)
        } else {
          const matches = []
          for (let i = 0; i < values.length; i++) {
            if (
              values[i].value.toLowerCase().includes(searchTerm.toLowerCase())
            )
              matches.push(values[i])
          }
          renderList(matches, searchTerm)
        }
      }
    }),
    [userList]
  )

  // Higher-order functions

  // Component life-cycle methods (useEffect)
  useEffect(() => {
    let filteredMeetingNoteList = sortDataByNewestTime(
      meetingNoteList?.filter((item: IMeetingNote) => !!item.contributors) || []
    )
    if (filteredMeetingNoteList.length > 0) {
      handleChangeRecentNote(filteredMeetingNoteList[0])
    } else {
      handleChangeRecentNote(null)
    }
  }, [meetingNoteList, handleChangeRecentNote])
  useEffect(() => {
    if (stateFormCreateNote) {
      let elm = document.getElementById(`create-meeting-note-container`)
      elm?.scrollIntoView()
    }
  }, [stateFormCreateNote])
  useEffect(() => {
    const handleClickImage = (event: any) => {
      let clickElement = event.target
      let className = clickElement.getAttribute('class')
      if (className === IMAGE_NOTE.CLASS) {
        event.preventDefault()
        let fileID = clickElement.getAttribute(IMAGE_NOTE.DATA_FILE_ID) || ''
        let fileName =
          clickElement.getAttribute(IMAGE_NOTE.DATA_FILE_NAME) || ''

        setStateViewImageModal({
          open: true,
          fileID,
          fileName
        })
      }
    }
    const handleRightClickImage = (event: any) => {
      let clickElement = event.target
      let className = clickElement.getAttribute('class')
      if (className === IMAGE_NOTE.CLASS) {
        event.preventDefault()
        let fileID = clickElement.getAttribute(IMAGE_NOTE.DATA_FILE_ID)
        let fileName = clickElement.getAttribute(IMAGE_NOTE.DATA_FILE_NAME)

        window.open(`/view_image/${fileID}/${fileName}`, '_blank')
      }
    }

    document.addEventListener('click', handleClickImage)
    document.addEventListener('contextmenu', handleRightClickImage)

    return () => {
      document.removeEventListener('click', handleClickImage)
      document.removeEventListener('contextmenu', handleRightClickImage)
    }
  }, [])

  // Component render
  return (
    <>
      <MeetingNoteWrapper>
        {isLoading ? (
          <div className='meeting-note-header-container'>
            <div className='meeting-note-header'>
              <div className='title'>
                <div className='space'></div>
                <p className='text'>Meeting Note</p>
              </div>
            </div>
            <div className='loading-data'>
              <Spin />
            </div>
          </div>
        ) : (
          <>
            <div className='meeting-note-header-container'>
              <div className='meeting-note-header'>
                <div className='title'>
                  <div className='space'></div>
                  <p className='text'>Meeting Note</p>
                </div>
                {!stateFormCreateNote.open && !!selectedMeeting?.uuid && (
                  <StyledButton
                    type='primary'
                    className='add-btn'
                    style={{
                      backgroundColor: '#fc7634',
                      borderColor: '#fc7634'
                    }}
                    onClick={() => {
                      handleChangeStateFormCreateNote({
                        open: true,
                        openFrom: 2
                      })
                      handleChangeOpenFormEditNote(false)
                    }}
                  >
                    Create
                  </StyledButton>
                )}
              </div>
              {stateFormCreateNote.open && (
                <div id='create-meeting-note-container'>
                  <MeetingNoteFormCreate
                    contactList={contactList}
                    currentUser={currentUser}
                    existMeetingNoteList={meetingNoteList}
                    mentionModule={mentionModule}
                    isOpened={stateFormCreateNote.open}
                    openFrom={stateFormCreateNote.openFrom}
                    onCloseForm={() => {
                      handleChangeStateFormCreateNote({
                        open: false,
                        openFrom: 0
                      })
                      handleChangeOpenFormEditNote(false)
                    }}
                  />
                </div>
              )}
            </div>
            <div className='meeting-note-body'>
              {meetingNoteList?.length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    flexDirection: 'column'
                  }}
                >
                  {sortDataByNewestTime(meetingNoteList || []).map(
                    (item: any) => (
                      <MeetingNoteItem
                        meetingNote={item}
                        key={item.uuid}
                        currentUser={currentUser}
                        highlightList={highlightList}
                        existMeetingNoteList={meetingNoteList}
                        mentionModule={mentionModule}
                        contactList={contactList}
                      />
                    )
                  )}
                </div>
              ) : (
                <EmptyData className='empty-data-meeting-note' />
              )}
            </div>
          </>
        )}
      </MeetingNoteWrapper>
      {stateViewImageModal.open && (
        <ViewImageModal
          visible={stateViewImageModal.open}
          onClose={() => {
            setStateViewImageModal({ open: false, fileID: '', fileName: '' })
          }}
          fileID={stateViewImageModal.fileID}
          fileName={stateViewImageModal.fileName}
        />
      )}
    </>
  )
}

// Props type declaration
interface MeetingNoteProps {
  meetingNoteList: IMeetingNote[]
  isLoading: boolean
  userList: IUser[]
  contactList: IContact[]
  currentUser: IUser
  highlightList: IHighlight[]
}

export default MeetingNote
