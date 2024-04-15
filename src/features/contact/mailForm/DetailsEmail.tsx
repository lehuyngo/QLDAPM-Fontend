import { Avatar, Spin } from 'antd'
import dompurify from 'dompurify'
import React, { useEffect, useState } from 'react'

import { useGetMailDetail } from '../../../api/reactQuery/BoardMail'
import ImageDefault from '../../../resources/images/image-default.jpg'
import { calculateTimeDifference } from '../../../utils/convertTimestamp'
import { DetailsEmailStyle, EmailModalStyle } from '../style'
import { useGetBatchMailDetail } from '../../../api/reactQuery/BatchMail'
import { FiXCircle } from 'react-icons/fi'

type Props = {
  isOpen: boolean
  onCloseModal: () => void
  mailId: string | null
  receiverId?: string | null
  isBatch?: boolean
}

const DetailsEmail: React.FC<Props> = ({
  isOpen,
  onCloseModal,
  mailId,
  receiverId,
  isBatch = false
}) => {
  const [receiver, setReceiver] = useState<any>(null)

  const sanitizer = dompurify.sanitize

  const { data: mailDetail, isLoading: mailLoading } = useGetMailDetail({
    mailId,
    isCall: !isBatch
  })
  const { data: batchMailDetail, isLoading: batchLoading } =
    useGetBatchMailDetail(mailId, true, isBatch)

  const { content, send_time, subject } = batchMailDetail || mailDetail || {}

  useEffect(() => {
    if (receiverId && batchMailDetail) {
      const result = batchMailDetail?.receivers?.find(
        (item: any) => item?.contact?.uuid === receiverId
      )
      setReceiver(result.contact)
    }

    if (!receiverId && mailDetail) {
      setReceiver(mailDetail?.receiver_contacts?.[0])
    }
  }, [mailDetail, batchMailDetail])

  let loading = mailLoading || batchLoading

  return (
    <EmailModalStyle
      className='modal-email details'
      title={
        <div className='modal-title'>
          <div className='title'>Mail Detail</div>

          <div className='btn-title close-modal' onClick={onCloseModal}>
            <FiXCircle style={{ fontSize: '28px', color: '#999' }} />
          </div>
        </div>
      }
      width={600}
      open={isOpen}
      onCancel={onCloseModal}
      onOk={onCloseModal}
      closeIcon={<></>}
      footer={false}
    >
      {loading && <Spin style={{ position: 'absolute', left: '50%' }} />}
      <DetailsEmailStyle>
        <div className='modal-content'>
          <div className='modal-title'>
            <div className='sender__container'>
              <div className='avt'>
                <Avatar size={40} src={receiver?.avatar || ImageDefault} />
              </div>
              <div className='info'>
                <div className='name'>{receiver?.fullname}</div>
                <div className='email'>{receiver?.email}</div>
              </div>
            </div>
            <div className='sentAt'>
              <span>{calculateTimeDifference(send_time)}</span>
            </div>
          </div>
          <div className='modal-body'>
            <div className='mail-title'>
              <span>{subject}</span>
            </div>
            <div className='description'>
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizer(content)
                }}
              ></div>
            </div>
            {/* <hr />
          <div className='attachments'>
            <div className='attachment-title'>
              <div className='number-file'>2 Attachment</div>
              <div className='btn-download'>Download All</div>
            </div>
            <div className='files'>
              <AttachmentItem />
              <AttachmentItem />
            </div>
          </div> */}
          </div>
          {/* <div className='modal-footer'>
          <div className='btn-delete'>
            <div className='icon'>
              <FiTrash2 style={{ fontSize: '16px', color: '#999' }} />
            </div>
            <div className='text'>
              <span>Delete</span>
            </div>
          </div>
        </div> */}
        </div>
      </DetailsEmailStyle>
    </EmailModalStyle>
  )
}

export default DetailsEmail
