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
import { useBatchCreateHighlight } from '../../../api/reactQuery/Highlight'
import { useCreateMeetingNote } from '../../../api/reactQuery/MeetingNote'
import { DatePickerLocale } from '../../../component/datePicker'
import { TimePickerLocale } from '../../../component/datePicker/TimePicker'
import { NotificationCustom } from '../../../component/notification/Notification'
import {
  HIGHLIGHT_NOTE,
  IMAGE_NOTE,
  LOCAL_STORAGE_ITEM,
  MEETING_NOTE_QUILL_FORMAT,
  MEETING_NOTE_QUILL_MODULE_CLIPBOARD,
  MEETING_NOTE_QUILL_MODULE_MAGIC_URL,
  MEETING_NOTE_QUILL_MODULE_TOOLBAR_CONTAINER
} from '../../../constants/common'
import { useLeadDetailContext } from '../../../hooks/useLeadDetailContext'
import { IContact } from '../../../interfaces/IContact'
import { IHighlightCreate, ISelectedText } from '../../../interfaces/IHighlight'
import {
  IDraftMeetingNote,
  IMeetingNote
} from '../../../interfaces/IMeetingNote'
import { IUser } from '../../../interfaces/IUser'
import { useCheckUploadFile } from '../../../utils/BeforeUploadFile'
import {
  customFilterOption,
  endsWithWhitespace,
  getHTMLText,
  getNowTimeNearest,
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

const MeetingNoteFormCreate: React.FC<MeetingNoteFormProps> = ({
  onCloseForm,
  isOpened,
  openFrom,
  mentionModule,
  contactList,
  currentUser,
  existMeetingNoteList
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
  const quillWrapperRef = useRef<any>(null)
  const mouseTrackRef = useRef<any>(null)

  // Variables

  // Custom hooks
  const [form] = Form.useForm<FormInstance>()
  const queryClient = useQueryClient()
  const { selectedMeeting, selectedLead, recentNote, handleChangeFetchAPI } =
    useLeadDetailContext()
  const { mutate: mutateCreateMeetingNote } = useMutation({
    mutationFn: useCreateMeetingNote
  })
  const { mutate: mutateBatchCreateHighlight } = useMutation({
    mutationFn: useBatchCreateHighlight
  })
  const { mutate: mutateUploadStaticFile } = useMutation({
    mutationFn: useUploadStaticFile
  })
  useAutoFocus(editorRef, isOpened && mentionModule)
  const prevAttendeesData = useMemo(() => {
    let prevAttendees: IContributor[] = []
    let attendees: IContributor[] = []
    let contacts: IContributor[] = []
    if (openFrom === 1 && selectedMeeting) {
      if (selectedMeeting.attendees?.length > 0) {
        prevAttendees = selectedMeeting.attendees
      }
    } else if (openFrom === 2 && recentNote) {
      if (recentNote.contributors?.length > 0) {
        prevAttendees = recentNote.contributors
      }
    }

    prevAttendees.forEach((item) => {
      if (item.user) {
        attendees.push(item)
      } else if (item.contact) {
        contacts.push(item)
      }
    })

    return { attendees, contacts }
  }, [recentNote, openFrom, selectedMeeting])
  const { beforeUploadFile } = useCheckUploadFile({
    typeAccept: ['image'],
    maxSizeMB: 10,
    maxLengthNameFile: 200
  })
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
      let termID = openFrom === 1 && selectedMeeting ? selectedMeeting.uuid : ''
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
    if (isOpened && selectedMeeting?.uuid) {
      form.resetFields()
      if (selectedMeeting?.start_time) {
        let duplicateTimeMeetingNote = existMeetingNoteList?.find(
          (note) => note.start_time === selectedMeeting.start_time
        )
        let date_time = duplicateTimeMeetingNote?.uuid
          ? getNowTimeNearest()
          : timestampToObjectDate(selectedMeeting.start_time)

        form.setFieldValue('meeting_date', date_time)
        form.setFieldValue('meeting_time', date_time)
      }
      if (selectedMeeting?.location) {
        form.setFieldValue('location', selectedMeeting.location)
      }

      form.setFieldValue(
        'contacts',
        prevAttendeesData.contacts.map((item) => {
          return `${item.contact.uuid}`
        })
      )

      let creatingDraftList: IDraftMeetingNote[] = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_ITEM.DRAFT_MEETING_NOTE) || '[]'
      )
      let termID = openFrom === 1 && selectedMeeting ? selectedMeeting.uuid : ''
      let termLeadID = selectedLead?.uuid || ''
      let draft: IDraftMeetingNote | undefined = creatingDraftList.find(
        (item) => item.id === termID && item.leadID === termLeadID
      )
      if (draft) {
        setDraftForm({
          openForm: true,
          content: draft.content,
          createdAt: draft.createdAt,
          id: draft.id,
          leadID: termLeadID
        })
      }

      if (prevAttendeesData.attendees.length > 0) {
        let quill = editorRef?.current?.getEditor()
        if (quill) {
          let defaultHtml = getHTMLText`<span>Attendees: ${prevAttendeesData.attendees.map(
            (item) =>
              `<span class="mention" data-index="${item.uuid}" data-id="${item.user.uuid}" data-denotation-char="@" data-value="${item.user.displayname}"><span contenteditable="false">@${item.user.displayname}</span></span>`
          )}</span>`

          quill.root.innerHTML = defaultHtml || ''
        }
      }
    }
  }, [
    form,
    isOpened,
    selectedMeeting,
    prevAttendeesData,
    openFrom,
    existMeetingNoteList
  ])
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

  const handleCreateMeetingNote = () => {
    form
      .validateFields()
      .then((values) => {
        onCreateMeetingNote(values)
      })
      .catch((info) => {
        console.log('Validate Failed:', info)
      })
  }
  const onCreateMeetingNote = (values: any) => {
    const { meeting_date, meeting_time, location, contacts = [], note } = values

    let data: any = {}
    let addHighlights: IHighlightCreate[] = []
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
          item?.creator?.uuid === currentUser?.uuid
      )
      if (matchedTimeMeetingNote?.uuid) {
        message.error('This meeting note has already existed!')
        return
      } else {
        data['start_time'] = startTime
      }
    }

    if (note) {
      data['note'] = note.replaceAll('&nbsp;', ' ')
      let e = document.createElement('div')
      e.innerHTML = note
      let highlights = e.querySelectorAll(`.${HIGHLIGHT_NOTE.CLASS}`)
      if (highlights.length > 0) {
        highlights.forEach((item: Element) => {
          addHighlights.push({ title: item.innerHTML, position_uuid: item.id })
        })
      }
    }

    if (location) {
      data['location'] = location
    }

    if (contacts.length > 0) {
      data['contact_uuids'] = contacts
    }

    if (newAttendeeUUIDs.length > 0) {
      let uniqueAttendeeUUIDList = newAttendeeUUIDs.filter(
        (value, index, self) => {
          return self.indexOf(value) === index
        }
      )
      data['user_uuids'] = uniqueAttendeeUUIDList
    }

    const dataSend: any = {
      projectID: selectedLead?.uuid,
      meetingDateID: selectedMeeting?.uuid,
      bodyRequest: data
    }

    if (addHighlights.length > 0) {
      createMeetingNotWithHighlight(dataSend, addHighlights)
    } else {
      createMeetingNotWithoutHighlight(dataSend)
    }
  }
  const createMeetingNotWithoutHighlight = (dataSend: any) => {
    handleChangeFetchAPI(true)
    mutateCreateMeetingNote(dataSend, {
      onSuccess: () => {
        removeDraftMeetingNote(
          openFrom === 1 && selectedMeeting ? selectedMeeting.uuid : ''
        )
        queryClient.invalidateQueries({
          queryKey: ['GetMeetingNoteList', selectedLead?.uuid]
        })
        queryClient.invalidateQueries({
          queryKey: ['GetMeetingList', selectedLead?.uuid]
        })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The meeting note has been created successfully!'
        })
        handleChangeFetchAPI(false)
        form.resetFields()
        onCloseForm()
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
  const createMeetingNotWithHighlight = (
    dataSend: any,
    highlights: IHighlightCreate[]
  ) => {
    handleChangeFetchAPI(true)
    mutateCreateMeetingNote(dataSend, {
      onSuccess: (data) => {
        removeDraftMeetingNote(
          openFrom === 1 && selectedMeeting ? selectedMeeting.uuid : ''
        )
        onBatchCreateHighlight(data.uuid, highlights)
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
  const onBatchCreateHighlight = (
    meetingNoteID: string,
    highlightTags: IHighlightCreate[]
  ) => {
    let data: any = {}

    data['highlights'] = highlightTags

    const dataSend: any = {
      meetingNoteID: meetingNoteID,
      bodyRequest: data
    }

    mutateBatchCreateHighlight(dataSend, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['GetHighlightList', selectedLead?.uuid]
        })
        queryClient.invalidateQueries({
          queryKey: ['GetMeetingNoteList', selectedLead?.uuid]
        })
        queryClient.invalidateQueries({
          queryKey: ['GetMeetingList', selectedLead?.uuid]
        })
        NotificationCustom({
          type: 'success',
          message: 'Create success',
          description: 'The meeting note has been created successfully!'
        })
        handleChangeFetchAPI(false)
        form.resetFields()
        onCloseForm()
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
          handleChangeFetchAPI(false)
          console.error('Error data', error)
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
        onFinish={handleCreateMeetingNote}
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
            rules={[maxLengthRule(255)]}
          >
            <StyledInput placeholder='Fill your location' />
          </Form.Item>
          <Form.Item name='contacts' className='contacts'>
            <StyledSelect
              className='select-contacts'
              mode='multiple'
              placeholder='Select contacts'
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
              {contactList.map((item: any) => (
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
            key='create'
            type='primary'
            htmlType='submit'
            style={{ backgroundColor: '#fc7634', borderColor: '#fc7634' }}
          >
            Create
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

// Props type declaration
interface MeetingNoteFormProps {
  onCloseForm: () => void
  isOpened: boolean
  openFrom: number
  mentionModule: any
  contactList: IContact[]
  currentUser: IUser
  existMeetingNoteList: IMeetingNote[]
}

export default MeetingNoteFormCreate
