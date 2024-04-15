// External dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Spin } from 'antd'
import randomColor from 'randomcolor'
import React, { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'
// Internal dependencies
import {
  useBatchCreateHighlight,
  useBatchDeleteHighlight,
  useDeleteHighlight
} from '../../../api/reactQuery/Highlight'
import { useUpdateMeetingNote } from '../../../api/reactQuery/MeetingNote'
import DeleteForm from '../../../component/deleteForm/DeleteForm'
import EmptyData from '../../../component/emptyData'
import { NotificationCustom } from '../../../component/notification/Notification'
import { HIGHLIGHT_NOTE } from '../../../constants/common'
import { useLeadDetailContext } from '../../../hooks/useLeadDetailContext'
import { IHighlight, IHighlightCreate } from '../../../interfaces/IHighlight'
import { IMeetingNote } from '../../../interfaces/IMeetingNote'
import {
  findTextRemovePrefixAndSuffix,
  findTextWithPrefixAndSuffix,
  focusMeetingNote
} from '../../../utils/FunctionsShare'
import { sortDataByCreatedAt } from '../../../utils/SortData'
import HighlightWithTooltip from './HighlightWithTooltip'

// StyleSheets
import { HighlightWrapper, TagStyled, TagsWrapper } from '../style'

// Assets

const Highlight: React.FC<HighlightProps> = ({
  highlightList,
  meetingNoteList,
  isLoading
}) => {
  // State logic
  const [isOpeningToDelete, setOpeningToDelete] = useState<boolean>(false)
  const [selectedHighlight, setSelectedHighlight] = useState<IHighlight | null>(
    null
  )
  // Ref

  // Variables
  let selectedMeetingNote =
    meetingNoteList?.find(
      (item: IMeetingNote) => item.uuid === selectedHighlight?.meeting_note_uuid
    ) || null
  let contentOfMeetingNote = selectedMeetingNote?.note || ''

  // Custom hooks
  const queryClient = useQueryClient()
  const { selectedLead, handleChangeHeightHighlightBar } =
    useLeadDetailContext()
  const { mutate: mutateDeleteHighlight } = useMutation({
    mutationFn: useDeleteHighlight
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

  // Higher-order functions

  // Component life-cycle methods (useEffect)
  useEffect(() => {
    let findHeightHighlightBar = setTimeout(() => {
      let e = document.getElementById(`highlight-list-${selectedLead?.uuid}`)
      if (e) handleChangeHeightHighlightBar(e.offsetHeight + 60)
    }, 500)
    return () => clearTimeout(findHeightHighlightBar)
  }, [isLoading, selectedLead?.uuid, handleChangeHeightHighlightBar])

  const onDeleteHighlight = (onChangeLoading: any) => {
    onChangeLoading(true)
    let bodyData = {
      highLightID: selectedHighlight?.uuid || '',
      meetingNoteID: selectedHighlight?.meeting_note_uuid || ''
    }
    mutateDeleteHighlight(bodyData, {
      onSuccess: () => {
        onUpdateMeetingNote(onChangeLoading)
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        onChangeLoading(false)
      }
    })
  }
  const onUpdateMeetingNote = (onChangeLoading: any) => {
    let removeHighlights_v0: string[] = []
    let addHighlights: IHighlightCreate[] = []
    let formattedNote = contentOfMeetingNote
      .replaceAll('&nbsp;', ' ')
      .replaceAll(HIGHLIGHT_NOTE.STYLE_SUB, HIGHLIGHT_NOTE.STYLE_MAIN)

    if (formattedNote && selectedHighlight?.title) {
      if (selectedHighlight?.position_uuid) {
        let e = document.createElement('div')
        e.innerHTML = formattedNote
        let highlights = e.querySelectorAll(`.${HIGHLIGHT_NOTE.CLASS}`)
        highlights.forEach((item) => {
          if (item.id === selectedHighlight?.position_uuid) {
            e.innerHTML = e.innerHTML.replace(item.outerHTML, item.innerHTML)
          }
        })
        contentOfMeetingNote = e.innerHTML
      } else {
        contentOfMeetingNote = findTextRemovePrefixAndSuffix(
          formattedNote,
          HIGHLIGHT_NOTE.PREFIX,
          HIGHLIGHT_NOTE.SUFFIX,
          selectedHighlight.title
        )
      }

      // Convert to new data of highlights by add position_uuid ===
      let existHighlights_v0 =
        highlightList?.filter(
          (item: IHighlight) =>
            item.meeting_note_uuid === selectedMeetingNote?.uuid &&
            !item.position_uuid
        ) || []
      let existHighlights_v1 =
        highlightList?.filter(
          (item: IHighlight) =>
            item.meeting_note_uuid === selectedMeetingNote?.uuid &&
            item.position_uuid
        ) || []

      if (existHighlights_v0?.length > 0) {
        let highlightsOldToNew = findTextWithPrefixAndSuffix(
          contentOfMeetingNote,
          HIGHLIGHT_NOTE.PREFIX,
          HIGHLIGHT_NOTE.SUFFIX
        )

        highlightsOldToNew.forEach((item: any) => {
          let e = document.createElement('span')
          e.setAttribute('class', HIGHLIGHT_NOTE.CLASS)
          e.setAttribute('id', uuidv4())
          e.setAttribute('style', `color: ${randomColor()};`)
          e.innerHTML = item.text

          contentOfMeetingNote = contentOfMeetingNote.replace(
            item.fullText,
            e.outerHTML
          )
        })
        existHighlights_v0?.forEach((item: any) => {
          removeHighlights_v0.push(item.uuid)
        })
      }

      let n = document.createElement('div')
      n.innerHTML = contentOfMeetingNote
      let highlightsOfNote = n.querySelectorAll(`.${HIGHLIGHT_NOTE.CLASS}`)
      let highlightsInNewContent: IHighlightCreate[] = []

      highlightsOfNote.forEach((item: Element) =>
        highlightsInNewContent.push({
          title: item.innerHTML,
          position_uuid: item.id
        })
      )

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

      if (removeHighlights_v0.length > 0) {
        batchDeleteHighlight(removeHighlights_v0, onChangeLoading)
      }

      if (addHighlights.length > 0) {
        batchCreateHighlight(addHighlights, onChangeLoading)
      }
      // ===

      const dataSend: any = {
        projectID: selectedLead?.uuid,
        meetingNoteID: selectedMeetingNote?.uuid,
        bodyRequest: { ...selectedMeetingNote, note: contentOfMeetingNote }
      }

      mutateUpdateMeetingNote(dataSend, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['GetMeetingNoteList', selectedLead?.uuid]
          })
          queryClient.invalidateQueries({
            queryKey: ['GetHighlightList', selectedLead?.uuid]
          })
          NotificationCustom({
            type: 'success',
            message: 'Delete success',
            description: 'The highlight has been deleted successfully!'
          })
          onChangeLoading(false)
          setSelectedHighlight(null)
        },
        onError: (error) => {
          NotificationCustom({
            type: 'error',
            message: 'Delete fail',
            description: error.message
          })
          onChangeLoading(false)
        }
      })
    }
  }
  const batchCreateHighlight = (
    highLightTags: IHighlightCreate[],
    onChangeLoading: any
  ) => {
    let data: any = {}

    data['highlights'] = highLightTags

    const dataSend: any = {
      meetingNoteID: selectedHighlight?.meeting_note_uuid || '',
      bodyRequest: data
    }

    mutateBatchCreateHighlight(dataSend, {
      onSuccess: (data) => {},
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        onChangeLoading(false)
      }
    })
  }
  const batchDeleteHighlight = (
    removeHighlightList: string[],
    onChangeLoading: any
  ) => {
    const dataSend: any = {
      meetingNoteID: selectedHighlight?.meeting_note_uuid || '',
      bodyRequest: {
        uuids: removeHighlightList
      }
    }

    mutateBatchDeleteHighlight(dataSend, {
      onSuccess: () => {},
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Create fail',
          description: error.message
        })
        onChangeLoading(false)
      }
    })
  }

  const handleCloseDeleteForm = () => {
    setOpeningToDelete(false)
    setSelectedHighlight(null)
  }

  // Component render
  return (
    <>
      <HighlightWrapper>
        <div className='title'>
          <div className='space'></div>
          <p className='text'>Highlights</p>
        </div>
        <TagsWrapper id={`highlight-list-${selectedLead?.uuid}`}>
          {isLoading ? (
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Spin />
            </div>
          ) : highlightList?.length > 0 ? (
            sortDataByCreatedAt(highlightList).map((item: IHighlight) => {
              return (
                <TagStyled
                  closable={false}
                  key={item.uuid}
                  color='#FFF4E8'
                  onClick={() => {
                    focusMeetingNote(item.meeting_note_uuid)
                  }}
                >
                  <HighlightWithTooltip text={item.title} />
                  <FiX
                    className='icon icon-delete'
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedHighlight(item)
                      setOpeningToDelete(true)
                    }}
                  />
                </TagStyled>
              )
            })
          ) : (
            <EmptyData className='no-padding no-shadow' />
          )}
        </TagsWrapper>
      </HighlightWrapper>
      {/* Delete Highlight */}
      {isOpeningToDelete && !!selectedHighlight?.uuid && (
        <DeleteForm
          title='Delete Highlight'
          question='Do you want to delete this highlight?'
          onDelete={(onChangeLoading: any) =>
            onDeleteHighlight(onChangeLoading)
          }
          visible={isOpeningToDelete && !!selectedHighlight?.uuid}
          onClose={() => handleCloseDeleteForm()}
        />
      )}
    </>
  )
}

// Props types declaration
interface HighlightProps {
  highlightList: IHighlight[]
  isLoading: boolean
  meetingNoteList: IMeetingNote[]
}

export default Highlight
