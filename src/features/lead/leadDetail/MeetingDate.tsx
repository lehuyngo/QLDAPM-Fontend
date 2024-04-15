// External dependencies
import { Collapse, Spin } from 'antd'
import { useEffect, useState } from 'react'

// Internal dependencies
import EmptyData from '../../../component/emptyData'
import { useLeadDetailContext } from '../../../hooks/useLeadDetailContext'
import { IContact } from '../../../interfaces/IContact'
import { IMeeting } from '../../../interfaces/IMeeting'
import { IUser } from '../../../interfaces/IUser'
import { focusMeetingNote } from '../../../utils/FunctionsShare'
import { timestampToDateTime } from '../../../utils/convertTimestamp'
import MeetingDateForm from '../form/MeetingDateForm'
import { sortDataByNewestTime } from '../../../utils/SortData'

// StyleSheets
import { StyledButton } from '../../../component/componentOfForm/ComponentOfForm.style'
import { MeetingDateWrapper } from '../style'

// Assets

const MeetingDate: React.FC<MeetingDateProps> = ({
  userList,
  currentUser,
  contactList,
  meetingList,
  isLoading
}) => {
  // State logic
  const [isOpeningMeetingCreateForm, setOpenMeetingCreateForm] =
    useState<boolean>(false)
  const [isRendered, setRender] = useState<boolean>(false)

  // Ref

  // Variables

  // Custom hooks
  const {
    handleChangeSelectMeeting,
    selectedMeeting,
    handleChangeStateFormCreateNote,
    heightHighlightBar
  } = useLeadDetailContext()

  // Higher-order functions

  // Component life-cycle methods (useEffect)
  useEffect(() => {
    if (!isLoading && meetingList?.length > 0 && !selectedMeeting?.uuid) {
      if (!isRendered) {
        setRender(true)
        handleChangeStateFormCreateNote({
          open: true,
          openFrom: 1
        })
      }
      handleChangeSelectMeeting(sortDataByNewestTime(meetingList)[0])
    }
  }, [
    meetingList,
    handleChangeSelectMeeting,
    selectedMeeting,
    isLoading,
    isRendered,
    handleChangeStateFormCreateNote
  ])
  useEffect(() => {
    if (!isLoading && meetingList === null) {
      setOpenMeetingCreateForm(true)
      setRender(true)
    }
  }, [meetingList, isLoading])

  // Component render
  return (
    <>
      <MeetingDateWrapper $extractHeight={heightHighlightBar}>
        <div className='meeting-date-header'>
          <div className='title'>
            <div className='space'></div>
            <p className='text'>Meeting Date</p>
          </div>
          <StyledButton
            type='primary'
            className='add-btn'
            ghost
            onClick={() => {
              setOpenMeetingCreateForm(true)
              handleChangeStateFormCreateNote({
                open: false,
                openFrom: 0
              })
            }}
          >
            Add
          </StyledButton>
        </div>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin />
          </div>
        ) : meetingList?.length > 0 ? (
          <div className='meeting-date-body'>
            {sortDataByNewestTime(meetingList).map((m: any) => (
              <div key={m.uuid} className='meeting-item'>
                <Collapse
                  collapsible='icon'
                  ghost
                  items={[
                    {
                      key: m.uuid,
                      label: (
                        <div
                          className='item-header'
                          onClick={() => {
                            handleChangeSelectMeeting(m)
                            handleChangeStateFormCreateNote({
                              open: true,
                              openFrom: 1
                            })
                          }}
                        >
                          <div className='date-time'>
                            {timestampToDateTime(m.start_time)}
                          </div>
                        </div>
                      ),
                      children: (
                        <>
                          {m?.note_creators?.length > 0 ? (
                            m.note_creators.map((item: any) => (
                              <div
                                key={item?.note_uuid}
                                className='creator'
                                onClick={() => {
                                  focusMeetingNote(item?.note_uuid)
                                }}
                              >
                                <div className='creator-name'>
                                  {item?.creator?.displayname}
                                </div>
                              </div>
                            ))
                          ) : (
                            <></>
                          )}
                        </>
                      )
                    }
                  ]}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyData className='no-shadow' />
        )}
      </MeetingDateWrapper>
      {isOpeningMeetingCreateForm && (
        <MeetingDateForm
          userList={userList}
          contactList={contactList}
          currentUser={currentUser}
          existMeetingDateList={meetingList}
          title={'Create Meeting'}
          visible={isOpeningMeetingCreateForm}
          onCloseModal={() => setOpenMeetingCreateForm(false)}
        />
      )}
    </>
  )
}

// Props Type declaration
interface MeetingDateProps {
  meetingList: IMeeting[]
  userList: IUser[]
  contactList: IContact[]
  currentUser: IUser
  isLoading: boolean
}

export default MeetingDate
