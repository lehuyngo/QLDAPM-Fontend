import { Image } from 'antd'
import React, { useEffect } from 'react'

import { useGetStaticFile } from '../../../api/reactQuery/AuthFile'
import { NotificationCustom } from '../../../component/notification/Notification'
import OverlayDefault from '../../../component/overlayLoading'

import { ViewImageModalWrapper } from '../style'

const ViewImageModal: React.FC<ViewImageModalProps> = ({
  fileID,
  fileName,
  visible,
  onClose
}) => {
  const { data, isLoading } = useGetStaticFile({ fileID, fileName })

  useEffect(() => {
    if (!isLoading && !data) {
      NotificationCustom({
        type: 'error',
        message: 'Error',
        description: 'Unable to load this image.'
      })
    }
  }, [isLoading, data])

  return (
    <>
      {isLoading ? (
        <OverlayDefault />
      ) : (
        data && (
          <ViewImageModalWrapper open={visible}>
            <Image
              src={URL.createObjectURL(data)}
              preview={{
                visible: visible,
                onVisibleChange: (visible: boolean) => {
                  if (!visible) {
                    onClose()
                  }
                },
                imageRender(originalNode) {
                  return {
                    ...originalNode,
                    props: {
                      ...originalNode.props,
                      style: {
                        ...originalNode.props.style,
                        maxHeight: '100%'
                      }
                    }
                  }
                }
              }}
            />
          </ViewImageModalWrapper>
        )
      )}
    </>
  )
}

interface ViewImageModalProps {
  fileID: string
  fileName: string
  visible: boolean
  onClose: () => void
}

export default ViewImageModal
