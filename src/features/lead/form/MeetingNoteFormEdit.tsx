// External dependencies
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, Select, message } from 'antd'
import { FormInstance } from 'antd/lib'
import randomColor from 'randomcolor'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FiAlertCircle, FiX } from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'
import _debounce from 'lodash/debounce'

// Internal dependencies
import { useUploadStaticFile } from '../../../api/reactQuery/AuthFile'
import {
  useBatchCreateHighlight,
  useBatchDeleteHighlight
} from '../../../api/reactQuery/Highlight'
import {
  useBatchCreateContributors,
  useBatchDeleteContributors,
  useUpdateMeetingNote
} from '../../../api/reactQuery/MeetingNote'
import { DatePickerLocale } from '../../../component/datePicker'
import { TimePickerLocale } from '../../../component/datePicker/TimePicker'
import { NotificationCustom } from '../../../component/notification/Notification'
import {
  HIGHLIGHT_NOTE,
  IMAGE_NOTE,
  MEETING_NOTE_QUILL_FORMAT,
  MEETING_NOTE_QUILL_MODULE_CLIPBOARD,
  MEETING_NOTE_QUILL_MODULE_TOOLBAR_CONTAINER,
  MEETING_NOTE_QUILL_MODULE_MAGIC_URL,
  LOCAL_STORAGE_ITEM
} from '../../../constants/common'
import { useLeadDetailContext } from '../../../hooks/useLeadDetailContext'
import { IContact } from '../../../interfaces/IContact'
import {
  IHighlight,
  IHighlightCreate,
  ISelectedText
} from '../../../interfaces/IHighlight'
import {
  IDraftMeetingNote,
  IMeetingNote
} from '../../../interfaces/IMeetingNote'
import { IUser } from '../../../interfaces/IUser'
import { useCheckUploadFile } from '../../../utils/BeforeUploadFile'
import {
  customFilterOption,
  endsWithWhitespace,
  findTextWithPrefixAndSuffix,
  getHTMLText,
  getNowTimeSaveDraftNote,
  removeDraftMeetingNote,
  startsWithWhitespace
} from '../../../utils/FunctionsShare'
import useAutoFocus from '../../../utils/autoFocus'
import {
  timestampToObjectDate,
  toTimestampFromDateAndMinute
} from '../../../utils/convertTimestamp'
import { maxLengthRule, validateEditor } from '../../../utils/validate'
import TaskForm from '../../task/form/TaskForm'
import { IContributor } from '../../../interfaces/IContributor'
import ConfirmDraftNoteForm from './ConfirmDraftNoteForm'

// StyleSheets
import 'quill-mention/dist/quill.mention.css'
import 'react-quill/dist/quill.snow.css'
import {
  StyledButton,
  StyledInput,
  StyledSelect
} from '../../../component/componentOfForm/ComponentOfForm.style'
import {
  MeetingNoteForm,
  MeetingNotePopover,
  MeetingNoteReactQuill
} from '../style'

// Assets

const MeetingNoteFormEdit: React.FC<MeetingNoteFormProps> = ({
  isOpened,
  onCloseForm,
  currentUser,
  contactList,
  highlightList,
  existMeetingNoteList,
  mentionModule
}) => {
  // State logic
  const [isOpeningToCreateTask, setOpeningToCreateTask] =
    useState<boolean>(false)
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
  const [draftForm, setDraftForm] = useState<IDraftMeetingNote>({
    openForm: false,
    content: '',
    createdAt: 0,
    id: '',
    leadID: ''
  })

  // Ref
  const editorRef = useRef<any>(null)
  const mouseTrackRef = useRef<any>(null)
  const quillWrapperRef = useRef<any>(null)

  // Variables

  // Custom hooks
  const { selectedLead, selectedNote, handleChangeFetchAPI } =
    useLeadDetailContext()
  const [form] = Form.useForm<FormInstance>()
  const queryClient = useQueryClient()
  const { mutate: mutateUpdateMeetingNote } = useMutation({
    mutationFn: useUpdateMeetingNote
  })
  const { mutate: mutateBatchCreateHighlight } = useMutation({
    mutationFn: useBatchCreateHighlight
  })
  const { mutate: mutateBatchDeleteHighlight } = useMutation({
    mutationFn: useBatchDeleteHighlight
  })
  const { mutate: mutateBatchCreateContributors } = useMutation({
    mutationFn: useBatchCreateContributors
  })
  const { mutate: mutateBatchDeleteContributors } = useMutation({
    mutationFn: useBatchDeleteContributors
  })
  const { mutate: mutateUploadStaticFile } = useMutation({
    mutationFn: useUploadStaticFile
  })
  useAutoFocus(editorRef, isOpened)
  const { beforeUploadFile } = useCheckUploadFile({
    typeAccept: ['image'],
    maxSizeMB: 10,
    maxLengthNameFile: 200
  })
  const prevAttendeesData = useMemo(() => {
    let attendees: IContributor[] = []
    let contacts: IContributor[] = []

    selectedNote?.contributors?.forEach((item) => {
      if (item.user) {
        attendees.push(item)
      } else if (item.contact) {
        contacts.push(item)
      }
    })

    return { attendees, contacts }
  }, [selectedNote])
  const existHighlights_v0 = useMemo(
    () =>
      highlightList?.filter(
        (item: IHighlight) =>
          item.meeting_note_uuid === selectedNote?.uuid && !item.position_uuid
      ) || [],
    [highlightList, selectedNote?.uuid]
  )
  const existHighlights_v1 = useMemo(
    () =>
      highlightList?.filter(
        (item: any) =>
          item.meeting_note_uuid === selectedNote?.uuid && item.position_uuid
      ) || [],
    [highlightList, selectedNote?.uuid]
  )

  // Higher-order functions
  const handleChangeContentNote = _debounce(
    (content: string) => {
      let creatingDraftList: IDraftMeetingNote[] = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_ITEM.DRAFT_MEETING_NOTE) || '[]'
      )
      let draft: IDraftMeetingNote = {
        createdAt: 0,
        id: '',
        content: '',
        leadID: ''
      }
      let createdAt = getNowTimeSaveDraftNote().valueOf()
      let termID = selectedNote?.uuid || ''
      let termLeadID = selectedLead?.uuid || ''

      draft.createdAt = createdAt
      draft.content = content || ''
      draft.id = termID
      draft.leadID = termLeadID
      creatingDraftList = creatingDraftList.filter(
        (draft) => draft.id !== termID || draft.leadID !== termLeadID
      )
      creatingDraftList.push(draft)
      localStorage.setItem(
        LOCAL_STORAGE_ITEM.DRAFT_MEETING_NOTE,
        JSON.stringify(creatingDraftList)
      )
    },
    300,
    { maxWait: 5000 }
  )

  // Component life-cycle methods (useEffect)
  useEffect(() => {
    if (isOpened && selectedNote) {
      if (selectedNote?.start_time) {
        let date_time = timestampToObjectDate(selectedNote.start_time)
        form.setFieldValue('meeting_date', date_time)
        form.setFieldValue('meeting_time', date_time)
      }
      if (selectedNote?.location) {
        form.setFieldValue('location', selectedNote.location)
      }
      if (selectedNote?.note) {
        let quill = editorRef?.current?.getEditor()
        if (quill) {
          let newAttendeeUUIDs: string[] = []
          let prevContentNote = document.createElement('div')
          prevContentNote.innerHTML = selectedNote.note

          let mentionElements = prevContentNote.querySelectorAll('.mention')
          mentionElements?.forEach((item: Element) => {
            let id = item.getAttribute('data-id')
            if (id) {
              newAttendeeUUIDs.push(id)
            }
          })

          let creatingDraftList: IDraftMeetingNote[] = JSON.parse(
            localStorage.getItem(LOCAL_STORAGE_ITEM.DRAFT_MEETING_NOTE) || '[]'
          )
          let termID = selectedNote ? selectedNote.uuid : ''
          let draft: IDraftMeetingNote | undefined = creatingDraftList.find(
            (item) => item.id === termID && item.leadID === selectedLead?.uuid
          )
          if (draft) {
            setDraftForm({
              openForm: true,
              content: draft.content,
              createdAt: draft.createdAt,
              id: draft.id,
              leadID: draft.leadID
            })
          }

          if (
            prevAttendeesData.attendees.length > 0 &&
            newAttendeeUUIDs.length === 0
          ) {
            let defaultHtml = getHTMLText`<p>Attendees: ${prevAttendeesData.attendees.map(
              (item, index) =>
                `<span class="mention" data-index="${index}" data-denotation-char="@" data-id="${item.user.uuid}" data-value="${item.user.displayname}"><span contenteditable="false">@${item.user.displayname}</span></span>`
            )}</p>`

            quill.root.innerHTML = defaultHtml + selectedNote?.note || ''
          } else {
            quill.root.innerHTML = selectedNote?.note || ''
          }
        }
      }

      form.setFieldValue(
        'contacts',
        prevAttendeesData.contacts.map((item) => {
          return `${item.contact.uuid}`
        })
      )
    }
  }, [form, selectedNote, prevAttendeesData, isOpened, selectedLead?.uuid])
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

  const handleEditMeetingNote = () => {
    form
      .validateFields()
      .then((values) => {
        onEditMeetingNote(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }
  const onEditMeetingNote = (values: any) => {
    const { meeting_date, meeting_time, location, contacts = [], note } = values

    let data: any = {}
    let addHighlights: IHighlightCreate[] = []
    let removeHighlights_v0: string[] = []
    let removeHighlights_v1: string[] = []
    let addAttendeeContributors: string[] = []
    let addContactContributors: string[] = []
    let removeContributors: string[] = []
    let newAttendeeUUIDs: string[] = []

    let mentionElements = editorRef?.current
      ?.getEditor()
      ?.root?.querySelectorAll('.mention')
    mentionElements?.forEach((item: Element) => {
      let id = item.getAttribute('data-id')
      if (id) {
        newAttendeeUUIDs.push(id)
      }
    })

    if (meeting_date && meeting_time) {
      let startTime = toTimestampFromDateAndMinute(meeting_date, meeting_time)
      let matchedTimeMeetingNote = existMeetingNoteList?.find(
        (item: IMeetingNote) =>
          item?.start_time === startTime &&
          item?.creator?.uuid === currentUser?.uuid &&
          selectedNote?.uuid !== item?.uuid
      )
      if (matchedTimeMeetingNote?.uuid) {
        message.error('This meeting note has already existed!')
        return
      } else {
        data['start_time'] = startTime
      }
    }

    if (note) {
      let formattedNote = note
        .replaceAll('&nbsp;', ' ')
        .replaceAll(HIGHLIGHT_NOTE.STYLE_SUB, HIGHLIGHT_NOTE.STYLE_MAIN)

      // Convert to new data of highlights by add position_uuid ===
      if (existHighlights_v0?.length > 0) {
        let highlightsOldToNew = findTextWithPrefixAndSuffix(
          formattedNote,
          HIGHLIGHT_NOTE.PREFIX,
          HIGHLIGHT_NOTE.SUFFIX
        )

        highlightsOldToNew.forEach((item: any) => {
          let e = document.createElement('span')
          e.setAttribute('class', HIGHLIGHT_NOTE.CLASS)
          e.setAttribute('id', uuidv4())
          e.setAttribute('style', `color: ${randomColor()};`)
          e.innerHTML = item.text

          formattedNote = formattedNote.replace(item.fullText, e.outerHTML)
        })

        existHighlights_v0?.forEach((item: any) => {
          removeHighlights_v0.push(item.uuid)
        })
      }
      // ===

      let e = document.createElement('div')
      e.innerHTML = formattedNote
      let highlights = e.querySelectorAll(`.${HIGHLIGHT_NOTE.CLASS}`)
      let highlightsInNewContent_v1: IHighlightCreate[] = []

      highlights.forEach((item: Element) => {
        if (item.innerHTML) {
          highlightsInNewContent_v1.push({
            title: item.innerHTML,
            position_uuid: item.id
          })
        } else {
          formattedNote = formattedNote.replace(item.outerHTML, '')
          item.remove()
        }
      })

      formattedNote = formattedNote
        .replaceAll('<span></span>', '')
        .replaceAll('<span> </span>', ' ')

      highlightsInNewContent_v1.forEach((newItem) => {
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
          !highlightsInNewContent_v1.find(
            (newItem) => newItem.position_uuid === existItem.position_uuid
          )
        ) {
          removeHighlights_v1.push(existItem.uuid)
        }
      })
      data['note'] = formattedNote
    }

    if (location) {
      data['location'] = location
    }

    // Handle contact contributors when edit meeting note
    contacts.forEach((newContactUUID: string) => {
      if (
        !prevAttendeesData.contacts.find(
          (prevContact) => prevContact.contact.uuid === newContactUUID
        )
      ) {
        addContactContributors.push(newContactUUID)
      }
    })
    prevAttendeesData.contacts.forEach((prevContact) => {
      if (
        !contacts.find(
          (newContactUUID: string) =>
            newContactUUID === prevContact.contact.uuid
        )
      ) {
        removeContributors.push(prevContact.uuid)
      }
    })

    // Handle user contributors when edit meeting note
    newAttendeeUUIDs.forEach((newAttendeeUUID: string) => {
      if (
        !prevAttendeesData.attendees.find(
          (prevAttendee) => prevAttendee.user.uuid === newAttendeeUUID
        )
      ) {
        addAttendeeContributors.push(newAttendeeUUID)
      }
    })
    prevAttendeesData.attendees.forEach((prevAttendee) => {
      if (
        !newAttendeeUUIDs.find(
          (newAttendeeUUID: string) =>
            newAttendeeUUID === prevAttendee.user.uuid
        )
      ) {
        removeContributors.push(prevAttendee.uuid)
      }
    })

    const dataSend: any = {
      projectID: selectedLead?.uuid,
      meetingNoteID: selectedNote?.uuid,
      bodyRequest: data
    }

    handleChangeFetchAPI(true)

    if (removeContributors.length > 0) {
      batchDeleteContributors(removeContributors)
    }

    if (
      addAttendeeContributors.length > 0 ||
      addContactContributors.length > 0
    ) {
      batchCreateContributors(addAttendeeContributors, addContactContributors)
    }

    if (removeHighlights_v1.length > 0) {
      batchDeleteHighlight(removeHighlights_v1)
    }

    if (removeHighlights_v0.length > 0) {
      batchDeleteHighlight(removeHighlights_v0)
    }

    if (addHighlights.length > 0) {
      batchCreateHighlight(addHighlights)
    }

    mutateUpdateMeetingNote(dataSend, {
      onSuccess: () => {
        removeDraftMeetingNote(selectedNote?.uuid || '')
        queryClient.invalidateQueries({
          queryKey: ['GetMeetingNoteList', selectedLead?.uuid]
        })
        NotificationCustom({
          type: 'success',
          message: 'Update success',
          description: 'The meeting note has been updated successfully!'
        })
        handleChangeFetchAPI(false)
        form.resetFields()
        onCloseForm()
      },
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Update fail',
          description: error.message
        })
        handleChangeFetchAPI(false)
      }
    })
  }
  const batchCreateHighlight = (highLightList: IHighlightCreate[]) => {
    let data: any = {}

    data['highlights'] = highLightList

    const dataSend: any = {
      meetingNoteID: selectedNote?.uuid,
      bodyRequest: data
    }

    mutateBatchCreateHighlight(dataSend, {
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
  const batchDeleteHighlight = (highLightList: string[]) => {
    const dataSend: any = {
      meetingNoteID: selectedNote?.uuid,
      bodyRequest: {
        uuids: highLightList
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
          message: 'Delete fail',
          description: error.message
        })
        handleChangeFetchAPI(false)
      }
    })
  }
  const batchCreateContributors = (
    user_uuids: string[],
    contact_uuids: string[]
  ) => {
    let data: any = {}

    if (user_uuids.length > 0) {
      data['user_uuids'] = user_uuids
    }
    if (contact_uuids.length > 0) {
      data['contact_uuids'] = contact_uuids
    }

    const dataSend: any = {
      meetingNoteID: selectedNote?.uuid,
      bodyRequest: data
    }

    mutateBatchCreateContributors(dataSend, {
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
  const batchDeleteContributors = (uuids: string[]) => {
    let data: any = {}

    data['uuids'] = uuids

    const dataSend: any = {
      meetingNoteID: selectedNote?.uuid,
      bodyRequest: data
    }

    mutateBatchDeleteContributors(dataSend, {
      onError: (error) => {
        NotificationCustom({
          type: 'error',
          message: 'Delete fail',
          description: error.message
        })
        handleChangeFetchAPI(false)
      }
    })
  }

  const handleSubmit = (e: any) => {
    if (!e.shiftKey) {
      if (!editorRef.current) return
    } else {
      let timer: any
      clearTimeout(timer)
      timer = setTimeout(() => {
        handleMouseUp(e)
      }, 300)
    }

    if (e.key === 'Enter') {
      e.preventDefault()
    }
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
  const draftCreateHighlight = () => {
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
  }
  const imageHandler = useCallback(() => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0]
        uploadFile(file)
      }
    }
  }, [])
  const uploadFile = (file: File) => {
    if (file && beforeUploadFile(file, [file])) {
      handleChangeFetchAPI(true)
      const formData = new FormData()
      const dataSend = {
        formData: formData
      }
      formData.set('file', file)
      mutateUploadStaticFile(dataSend, {
        onSuccess: (data) => {
          let fileName = file.name
          let fileID = data.uuid
          let pointerCurrent = document?.getSelection()

          if (pointerCurrent?.rangeCount) {
            let range = pointerCurrent?.getRangeAt(0)
            let imageElement = document.createElement('span')

            imageElement.setAttribute('class', IMAGE_NOTE.CLASS)
            imageElement.setAttribute(`${IMAGE_NOTE.DATA_FILE_ID}`, fileID)
            imageElement.setAttribute(`${IMAGE_NOTE.DATA_FILE_NAME}`, fileName)
            imageElement.setAttribute('style', IMAGE_NOTE.STYLE)
            imageElement.innerHTML = 'Image'

            range.deleteContents()
            range.insertNode(imageElement)
          }
          handleChangeFetchAPI(false)
        },
        onError: (error) => {
          NotificationCustom({
            type: 'error',
            message: 'Upload fail',
            description: error.message
          })
          console.error('Error data', error)
          handleChangeFetchAPI(false)
        }
      })
    }
  }
  const handleApplyDraft = () => {
    if (isOpened) {
      let quill = editorRef?.current?.getEditor()
      if (quill) {
        quill.root.innerHTML = draftForm.content
      }
    }
    setDraftForm({
      openForm: false,
      content: '',
      createdAt: 0,
      id: '',
      leadID: ''
    })
  }
  const handleDeleteDraft = () => {
    removeDraftMeetingNote(draftForm.id)
    setDraftForm({
      openForm: false,
      content: '',
      createdAt: 0,
      id: '',
      leadID: ''
    })
  }

  useEffect(() => {
    let quillWrapper = quillWrapperRef.current
    const handlePaste = (event: any) => {
      const clipboardData = event.clipboardData
      if (clipboardData.items) {
        for (const item of clipboardData.items) {
          if (item.kind === 'file' && item.type.includes('image')) {
            const file = item.getAsFile()
            uploadFile(file)
          }
        }
      }
    }
    const handleDrop = (event: any) => {
      event.stopPropagation()
      event.preventDefault()
      const files = event.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        uploadFile(file)
        if (files.length > 1) {
          message.warning('Only one file can be uploaded at a time!')
        }
      }
    }
    const handleDragOver = (event: any) => {
      event.stopPropagation()
      event.preventDefault()
    }

    if (quillWrapper) {
      quillWrapper.addEventListener('paste', handlePaste)
      quillWrapper.addEventListener('drop', handleDrop)
      quillWrapper.addEventListener('dragover', handleDragOver)
      return () => {
        quillWrapper.removeEventListener('paste', handlePaste)
        quillWrapper.removeEventListener('drop', handleDrop)
        quillWrapper.removeEventListener('dragover', handleDragOver)
      }
    }
  }, [])

  // Component render
  return (
    <>
      <MeetingNoteForm
        form={form}
        onFinish={handleEditMeetingNote}
        onMouseUp={(e) => handleMouseUp(e)}
      >
        <div className='notice'>
          <div className='icon'>
            <FiAlertCircle />
          </div>
          <p className='text'>
            After operating, a draft will be automatically saved and accessible
            for 7 days.
          </p>
        </div>
        <div className='quill-wrapper' ref={quillWrapperRef}>
          <Form.Item
            rules={[validateEditor]}
            name='note'
            style={{ margin: 0 }}
            initialValue={''}
          >
            <MeetingNoteReactQuill
              ref={editorRef}
              modules={{
                toolbar: {
                  container: MEETING_NOTE_QUILL_MODULE_TOOLBAR_CONTAINER,
                  handlers: {
                    image: imageHandler
                  }
                },
                clipboard: MEETING_NOTE_QUILL_MODULE_CLIPBOARD,
                mention: mentionModule,
                magicUrl: MEETING_NOTE_QUILL_MODULE_MAGIC_URL
              }}
              formats={MEETING_NOTE_QUILL_FORMAT}
              theme='snow'
              onKeyDown={(e: any) => {
                handleSubmit(e)
              }}
              onChange={(value) => {
                form.setFieldValue('note', value)
                handleChangeContentNote(value)
              }}
            />
          </Form.Item>
        </div>
        <div className='sub-field-list'>
          <Form.Item
            name='meeting_date'
            className='meeting-date'
            rules={[
              {
                required: true,
                message: 'This field is required!'
              }
            ]}
          >
            <DatePickerLocale />
          </Form.Item>
          <Form.Item
            name='meeting_time'
            className='meeting-time'
            rules={[
              {
                required: true,
                message: 'This field is required!'
              }
            ]}
          >
            <TimePickerLocale
              changeOnBlur={true}
              minuteStep={5}
              format={'HH:mm'}
            />
          </Form.Item>
          <Form.Item
            name='location'
            className='location'
            rules={[maxLengthRule(100)]}
          >
            <StyledInput placeholder='Fill your location' />
          </Form.Item>
          <Form.Item name='contacts' className='contacts'>
            <StyledSelect
              mode='multiple'
              placeholder='Select contacts'
              className='select-contacts'
              suffixIcon={<></>}
              filterOption={customFilterOption}
              tagRender={(props: any) => {
                return (
                  <span className='ant-select-selection-item'>
                    <span className='ant-select-selection-item-content'>
                      {props?.label[0] && props.label[0]}
                      {props?.label[1] && props.label[1]}
                    </span>
                    <span
                      className='ant-select-selection-item-remove'
                      unselectable='on'
                      aria-hidden='true'
                      style={{ userSelect: 'none' }}
                      onClick={props.onClose}
                    >
                      <FiX style={{ fontSize: '14px' }} />
                    </span>
                  </span>
                )
              }}
            >
              {contactList.map((item) => (
                <Select.Option key={item.uuid} value={`${item.uuid}`}>
                  {item.shortname || item.fullname}
                  {item.email && ` - ${item.email}`}
                </Select.Option>
              ))}
            </StyledSelect>
          </Form.Item>
        </div>
        <div className='footer-form'>
          <StyledButton key='cancel' onClick={onCloseForm}>
            Cancel
          </StyledButton>
          <StyledButton
            type='primary'
            htmlType='submit'
            key='edit'
            style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
          >
            Save
          </StyledButton>
        </div>
      </MeetingNoteForm>
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
              draftCreateHighlight()

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
      {isOpeningToCreateTask && (
        <TaskForm
          title='Create Task'
          visible={isOpeningToCreateTask}
          setVisible={setOpeningToCreateTask}
          selectedLead={selectedLead}
          titleTask={newTitleTask}
        />
      )}
      {draftForm.openForm && (
        <ConfirmDraftNoteForm
          visible={draftForm.openForm}
          onClose={() => {
            setDraftForm({
              openForm: false,
              content: '',
              createdAt: 0,
              id: '',
              leadID: ''
            })
          }}
          onApply={handleApplyDraft}
          onDelete={handleDeleteDraft}
          content={draftForm.content}
          createdAt={draftForm.createdAt}
        />
      )}
    </>
  )
}

// Props types declaration
interface MeetingNoteFormProps {
  isOpened: boolean
  onCloseForm: () => void
  highlightList: IHighlight[]
  contactList: IContact[]
  currentUser: IUser
  mentionModule: any
  existMeetingNoteList: IMeetingNote[]
}

export default MeetingNoteFormEdit
