// External dependencies
import { useContext, useState } from 'react'
import React from 'react'

// Internal dependencies
import { IMeeting } from '../interfaces/IMeeting'
import { IMeetingNote } from '../interfaces/IMeetingNote'
import { ILead } from '../interfaces/ILead'

// StyleSheets

// Assets

const LeadDetailContext = React.createContext<
  LeadDetailContextValue | undefined
>(undefined)

export const LeadDetailProvider: React.FC<LeadDetailProviderProps> = ({
  children
}) => {
  // State logic
  const [selectedMeeting, setSelectedMeeting] = useState<IMeeting | null>(null)
  const [selectedNote, setSelectedNote] = useState<IMeetingNote | null>(null)
  const [recentNote, setRecentNote] = useState<IMeetingNote | null>(null)
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null)
  const [stateFormCreateNote, setStateFormCreateNote] =
    useState<StateFormCreateNote>({
      open: false,
      openFrom: 0
    })
  const [isOpeningFormEditNote, setOpenFormEditNote] = useState<boolean>(false)
  const [isFetchingAPI, setFetchAPI] = useState<boolean>(false)
  const [heightHighlightBar, setHeightHighlightBar] = useState<number>(0)

  // Ref

  // Variables

  // Custom hooks

  // Higher-order functions

  // Component life-cycle methods (useEffect)

  const handleChangeSelectMeeting = (meeting: IMeeting | null) => {
    setSelectedMeeting(meeting)
  }
  const handleChangeSelectNote = (note: IMeetingNote | null) => {
    setSelectedNote(note)
  }
  const handleChangeRecentNote = (note: IMeetingNote | null) => {
    setRecentNote(note)
  }
  const handleChangeSelectLead = (lead: ILead | null) => {
    setSelectedLead(lead)
  }
  const handleChangeStateFormCreateNote = (state: StateFormCreateNote) => {
    setStateFormCreateNote(state)
  }
  const handleChangeOpenFormEditNote = (open: boolean) => {
    setOpenFormEditNote(open)
  }
  const handleChangeFetchAPI = (fetching: boolean) => {
    setFetchAPI(fetching)
  }
  const handleChangeHeightHighlightBar = (height: number) => {
    setHeightHighlightBar(height)
  }

  // Component render
  return (
    <LeadDetailContext.Provider
      value={{
        selectedMeeting,
        handleChangeSelectMeeting,
        selectedNote,
        handleChangeSelectNote,
        recentNote,
        handleChangeRecentNote,
        selectedLead,
        handleChangeSelectLead,
        stateFormCreateNote,
        handleChangeStateFormCreateNote,
        isOpeningFormEditNote,
        handleChangeOpenFormEditNote,
        isFetchingAPI,
        handleChangeFetchAPI,
        heightHighlightBar,
        handleChangeHeightHighlightBar
      }}
    >
      {children}
    </LeadDetailContext.Provider>
  )
}

// Props types declaration
interface LeadDetailContextValue {
  selectedMeeting: IMeeting | null
  handleChangeSelectMeeting: (meeting: IMeeting | null) => void
  selectedNote: IMeetingNote | null
  handleChangeSelectNote: (note: IMeetingNote | null) => void
  recentNote: IMeetingNote | null
  handleChangeRecentNote: (note: IMeetingNote | null) => void
  selectedLead: ILead | null
  handleChangeSelectLead: (lead: ILead | null) => void
  stateFormCreateNote: StateFormCreateNote
  handleChangeStateFormCreateNote: (open: StateFormCreateNote) => void
  isOpeningFormEditNote: boolean
  handleChangeOpenFormEditNote: (open: boolean) => void
  heightHighlightBar: number
  handleChangeHeightHighlightBar: (height: number) => void
  isFetchingAPI: boolean
  handleChangeFetchAPI: (fetching: boolean) => void
}

interface LeadDetailProviderProps {
  children: React.ReactNode
}

interface StateFormCreateNote {
  open: boolean
  openFrom: number // 0: Nothing, 1: meeting-date, 2: meeting-note
}

export const useLeadDetailContext = () => {
  const context = useContext(LeadDetailContext)
  if (!context) {
    throw new Error(
      'useLeadDetailContext must be used within a LeadDetailContextProvider'
    )
  }
  return context
}
