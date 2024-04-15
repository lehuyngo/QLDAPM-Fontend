import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Modal, Space, Spin, Upload } from 'antd'
import React, { useState, useEffect } from 'react'
import { FiFolder, FiXCircle } from 'react-icons/fi'
import styled from 'styled-components'

import { fetchDataAndSaveAs } from '../../api/reactQuery/AuthFile'
import {
  useAttachFileClient,
  useDeleteAttachFileClient,
  useGetAttachFilesClient
} from '../../api/reactQuery/Client'
import {
  useAttachFileContact,
  useDeleteAttachFileContact,
  useGetAttachFilesContact
} from '../../api/reactQuery/Contact'
import { ALLOW_FILE, DETAIL_PAGE_TYPE } from '../../constants/common'
import DeleteForm from '../deleteForm/DeleteForm'
import { NotificationCustom } from '../notification/Notification'
import { useCheckUploadFile } from '../../utils/BeforeUploadFile'
import { LoadingOutlined } from '@ant-design/icons'

interface AttachmentsFileProps {
  uuid: string | null
  pageType: string
  collapse: boolean
}

const AttachmentsFile: React.FC<AttachmentsFileProps> = ({
  uuid,
  pageType,
  collapse
}) => {
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false)
  const [idFile, setIdFile] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [openFileLoading, setOpenFileLoading] = useState<boolean>(false)
  const [attachFilesWrapperStyle, setAttachFilesWrapperStyle] = useState({
    maxHeight: '100%',
    overflow: 'auto'
  })
  const [sidebarElement, setSidebarElement] = useState<any>(null)

  const { beforeUploadFile, allowedFileExtensions } = useCheckUploadFile({
    typeAccept: ['image', 'pdf', 'word', 'excel', 'video']
  })

  const queryClient = useQueryClient()
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

  const { mutate: mutateViewFiles } = useMutation({
    mutationFn: fetchDataAndSaveAs
  })

  const { mutate: mutateAttachFilesClient } = useMutation({
    mutationFn: useAttachFileClient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['GetAttachFilesClient']
      })

      NotificationCustom({
        type: 'success',
        message: 'Upload file successfully!'
      })
      setIsLoading(false)
    }
  })
  const { mutate: mutateDeleteFilesClient } = useMutation({
    mutationFn: useDeleteAttachFileClient
  })

  const { mutate: mutateAttachFilesContact } = useMutation({
    mutationFn: useAttachFileContact,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['GetAttachFilesContact']
      })
      NotificationCustom({
        type: 'success',
        message: 'Upload file successfully!'
      })
      setIsLoading(false)
    }
  })

  const { mutate: mutateDeleteFilesContact } = useMutation({
    mutationFn: useDeleteAttachFileContact
  })

  const { data: clientFileData, isLoading: fileClientLoading } =
    useGetAttachFilesClient(uuid, pageType === DETAIL_PAGE_TYPE.CLIENT)
  const { data: contactFileData, isLoading: fileContactLoading } =
    useGetAttachFilesContact(uuid, pageType === DETAIL_PAGE_TYPE.CONTACT)

  useEffect(() => {
    const getElement = document.querySelector('.sidebar-contain')

    if (getElement === null) {
      const timeoutId = setTimeout(() => {
        const retryCanBeNull = document.querySelector('.sidebar-contain')
        setSidebarElement(retryCanBeNull)
      }, 800)

      return () => clearTimeout(timeoutId)
    }

    setSidebarElement(getElement)
  }, [fileContactLoading, fileClientLoading])

  useEffect(() => {
    if (sidebarElement !== null) {
      const getElementHeight =
        (sidebarElement as HTMLElement).offsetHeight + 148 + 24 //padding + title + collapse-btn

      const updatedStyle = {
        maxHeight: `calc(100vh - ${getElementHeight}px)`,
        overflow: 'auto'
      }
      setAttachFilesWrapperStyle(updatedStyle)
    }
  }, [collapse, sidebarElement])

  const handleViewFile = (url: string, nameFile: string) => {
    const lowerCaseFileName = nameFile.toLowerCase()

    const getFileData = (fileType: string) => ({
      url: url,
      nameFile: nameFile,
      fileType: fileType
    })

    let dataToSend: any

    if (ALLOW_FILE.IMAGE.some((ext) => lowerCaseFileName.endsWith(ext))) {
      dataToSend = getFileData('image/jpeg')
    } else if (ALLOW_FILE.PDF.some((ext) => lowerCaseFileName.endsWith(ext))) {
      dataToSend = getFileData('application/pdf')
    } else if (
      ALLOW_FILE.EXCEL.some((ext) => lowerCaseFileName.endsWith(ext))
    ) {
      dataToSend = getFileData(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
    } else if (ALLOW_FILE.WORD.some((ext) => lowerCaseFileName.endsWith(ext))) {
      dataToSend = getFileData(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    } else if (
      ALLOW_FILE.VIDEO.some((ext) => lowerCaseFileName.endsWith(ext))
    ) {
      dataToSend = getFileData('video/mp4')
    }

    setOpenFileLoading(true)
    mutateViewFiles(dataToSend, {
      onSuccess() {
        setOpenFileLoading(false)
      },
      onError() {
        setOpenFileLoading(false)
      }
    })
  }

  const handleUpFile = (e: any) => {
    setIsLoading(true)
    const formData = new FormData()
    const dataSend = {
      formData: formData,
      uuid: uuid
    }

    if (e?.file?.originFileObj) {
      formData.set('file', e?.file?.originFileObj)
      if (pageType === DETAIL_PAGE_TYPE.CLIENT) {
        mutateAttachFilesClient(dataSend, {
          onError: (error) => {
            NotificationCustom({
              type: 'error',
              message: 'Upload fail',
              description: error.message
            })
            setIsLoading(false)
            console.error('Error data', error)
          }
        })
      }
      if (pageType === DETAIL_PAGE_TYPE.CONTACT) {
        mutateAttachFilesContact(dataSend, {
          onError: (error) => {
            NotificationCustom({
              type: 'error',
              message: 'Upload fail',
              description: error.message
            })
            setIsLoading(false)
            console.error('Error data', error)
          }
        })
      }
    } else {
      setIsLoading(false)
    }
  }

  const handleDelete = (onChangeLoading: any) => {
    onChangeLoading(true)
    const dataDelete = {
      uuid: uuid,
      fileId: idFile
    }

    if (pageType === DETAIL_PAGE_TYPE.CLIENT) {
      mutateDeleteFilesClient(dataDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['GetAttachFilesClient']
          })
          NotificationCustom({
            type: 'success',
            message: 'Delete file successfully!'
          })
          onChangeLoading(false)
          setIsOpenDelete(false)
        },
        onError: (error) => {
          NotificationCustom({
            type: 'error',
            message: 'Delete fail',
            description: error.message
          })
          onChangeLoading(false)
          console.error('Error data', error)
        }
      })
    } else if (pageType === DETAIL_PAGE_TYPE.CONTACT) {
      mutateDeleteFilesContact(dataDelete, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['GetAttachFilesContact']
          })
          NotificationCustom({
            type: 'success',
            message: 'Delete file successfully!'
          })
          onChangeLoading(false)
          setIsOpenDelete(false)
        },
        onError: (error) => {
          NotificationCustom({
            type: 'error',
            message: 'Delete fail',
            description: error.message
          })
          onChangeLoading(false)
          console.error('Error data', error)
        }
      })
    }
  }

  return (
    <AttachFilesWrapper>
      <div className='title-wrapper'>
        <div className='title'>
          <FiFolder />
          <span className=''>Attachments</span>
        </div>
        <div className='button-add'>
          <Upload
            accept={allowedFileExtensions}
            beforeUpload={beforeUploadFile}
            multiple
            customRequest={() => {}}
            onChange={handleUpFile}
          >
            <AddAttachmentFile loading={isLoading}>Add</AddAttachmentFile>
          </Upload>
        </div>
      </div>

      <div className='file-container' style={attachFilesWrapperStyle}>
        {openFileLoading && (
          <Modal
            className='modal-file-downloading'
            open={openFileLoading}
            onCancel={() => setOpenFileLoading(!openFileLoading)}
            footer={false}
            width={272}
          >
            <Space align='center' direction='vertical'>
              <Spin indicator={antIcon} />
              <p>The file is being downloaded...</p>
            </Space>
          </Modal>
        )}

        {pageType === DETAIL_PAGE_TYPE.CLIENT &&
          clientFileData?.data?.map((fileItem: any) => {
            const nameFile: string = fileItem.name || ''

            return (
              <div key={fileItem.uuid} className='attachment-item'>
                <div className='file-name'>
                  <span onClick={() => handleViewFile(fileItem?.url, nameFile)}>
                    {nameFile || fileItem.name}
                  </span>
                </div>
                <div
                  className='action-delete'
                  onClick={() => {
                    setIsOpenDelete(true)
                    setIdFile(fileItem.uuid)
                  }}
                >
                  <FiXCircle />
                </div>
              </div>
            )
          })}

        {pageType === DETAIL_PAGE_TYPE.CONTACT &&
          contactFileData?.data?.map((fileItem: any) => {
            const nameFile: string = fileItem.name || ''

            return (
              <div key={fileItem.uuid} className='attachment-item'>
                <div className='file-name'>
                  <span
                    className='file-name--overflow'
                    onClick={() => handleViewFile(fileItem?.url, nameFile)}
                  >
                    {nameFile || fileItem.name}
                  </span>
                </div>

                <div
                  className='action-delete'
                  onClick={() => {
                    setIsOpenDelete(true)
                    setIdFile(fileItem.uuid)
                  }}
                >
                  <FiXCircle />
                </div>
              </div>
            )
          })}
      </div>
      <DeleteForm
        visible={isOpenDelete}
        onClose={() => setIsOpenDelete(false)}
        onDelete={handleDelete}
        question='Do you want to delete this file?'
      />
    </AttachFilesWrapper>
  )
}

export default AttachmentsFile

const AddAttachmentFile = styled(Button)`
  font-size: 12px;
  font-weight: 700;
  line-height: 150%;
  padding: 6px 12px;
  border: 1.5px solid #3b5bd5 !important;
  color: #3b5bd5 !important;
  background-color: #fff !important;
  border-radius: 6px;
  cursor: pointer;
`

const AttachFilesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  .title-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 16px;
    font-weight: 700;
    line-height: 160%;
    margin-bottom: 8px;

    .title {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }

  .file-container {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .attachment-item {
      display: flex;
      justify-content: space-between;
      position: relative;

      border-radius: 8px;
      padding: 8px;
      background-color: #f4f4f4;

      .file-name {
        color: #fc7634;
        margin-right: 8px;
        font-size: 14px;
        font-weight: 700;
        line-height: 170%;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;

        cursor: pointer;
      }

      .action-delete {
        display: flex;
        text-align: center;
        align-items: center;

        font-size: 16px;
        color: #ccc;
        cursor: pointer;

        &:hover {
          color: #999;
        }
      }
    }
  }
`
