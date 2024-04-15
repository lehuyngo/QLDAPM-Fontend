// External dependencies
import { useEffect } from 'react'
import { useParams } from 'react-router'

// Internal dependencies
import { useGetContactsList } from '../../../api/reactQuery/Contact'
import { useGetHighlightList } from '../../../api/reactQuery/Highlight'
import {
  useGetLeadDetail,
  useGetLeadStatus
} from '../../../api/reactQuery/Lead'
import { useGetMeetingList } from '../../../api/reactQuery/Meeting'
import { useGetMeetingNoteList } from '../../../api/reactQuery/MeetingNote'
import { useGetTaskListOfLead } from '../../../api/reactQuery/Task'
import { useGetMe, useGetUserList } from '../../../api/reactQuery/user'
import { useLeadDetailContext } from '../../../hooks/useLeadDetailContext'
import CrmPageLayout from '../../layout'
import Highlight from './Highlight'
import MeetingDate from './MeetingDate'
import MeetingNote from './MeetingNote'
import ProcessStatus from './ProcessStatus'
import TaskInformation from './TaskInformation'
import OverlayDefault from '../../../component/overlayLoading'

// StyleSheets
import { ContentLeadDetail } from '../style'

// Assets

const LeadDetail: React.FC<LeadDetailProps> = () => {
  // State logic

  // Ref

  // Variables

  // Custom hooks
  const { leadID = null } = useParams()
  const { handleChangeSelectLead, isFetchingAPI, selectedLead } =
    useLeadDetailContext()
  const {
    data: statusList,
    isLoading: isLoadingStatusList,
    isFetching: isFetchingStatusList
  } = useGetLeadStatus()
  const { data: leadDetail, isLoading: isLoadingLeadDetail } =
    useGetLeadDetail(leadID)
  const {
    data: meetingList,
    isLoading: isLoadingMeetingList,
    isFetching: isFetchingMeetingList
  } = useGetMeetingList(selectedLead?.uuid || '')
  const { data: userList } = useGetUserList()
  const { data: contactList } = useGetContactsList()
  const { data: currentUser } = useGetMe()
  const {
    data: taskList,
    isLoading: isLoadingTaskList,
    isFetching: isFetchingTaskList
  } = useGetTaskListOfLead(selectedLead?.uuid || '')
  const {
    data: highlightList,
    isLoading: isLoadingGetHighlight,
    isFetching: isFetchingGetHighlight
  } = useGetHighlightList(selectedLead?.uuid || '')
  const {
    data: meetingNoteList,
    isLoading: isLoadingGetMeetingNoteList,
    isFetching: isFetchingGetMeetingNoteList
  } = useGetMeetingNoteList(selectedLead?.uuid || '')

  // Higher-order functions

  // Component life-cycle methods (useEffect)
  useEffect(() => {
    if (!isLoadingLeadDetail && leadDetail) {
      handleChangeSelectLead(leadDetail)
    } else handleChangeSelectLead(null)
  }, [leadDetail, isLoadingLeadDetail, handleChangeSelectLead])

  // Component render
  return (
    <CrmPageLayout>
      {isLoadingLeadDetail ? (
        <OverlayDefault />
      ) : (
        <ContentLeadDetail>
          {isFetchingAPI && <OverlayDefault />}
          <ProcessStatus
            statusList={statusList || []}
            status={leadDetail?.project_status || 1}
            isLoading={isLoadingStatusList || isFetchingStatusList}
          />
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <div style={{ width: '75%' }}>
              <Highlight
                highlightList={highlightList?.data}
                isLoading={isFetchingGetHighlight || isLoadingGetHighlight}
                meetingNoteList={meetingNoteList?.data}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '25%' }}>
                  <MeetingDate
                    meetingList={meetingList?.data}
                    isLoading={isLoadingMeetingList || isFetchingMeetingList}
                    currentUser={currentUser}
                    userList={userList?.data}
                    contactList={contactList?.data}
                  />
                </div>
                <div style={{ width: '75%' }}>
                  <MeetingNote
                    meetingNoteList={meetingNoteList?.data}
                    isLoading={
                      isLoadingGetMeetingNoteList ||
                      isFetchingGetMeetingNoteList
                    }
                    userList={userList?.data}
                    contactList={contactList?.data}
                    currentUser={currentUser}
                    highlightList={highlightList?.data}
                  />
                </div>
              </div>
            </div>
            <div style={{ width: '25%' }}>
              <TaskInformation
                taskList={taskList?.data}
                isLoading={isLoadingTaskList || isFetchingTaskList}
              />
            </div>
          </div>
        </ContentLeadDetail>
      )}
    </CrmPageLayout>
  )
}

// Props type declaration
interface LeadDetailProps {}

export default LeadDetail
