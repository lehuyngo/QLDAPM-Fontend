import { Image } from 'antd'
import { useParams } from 'react-router-dom'

import { useGetStaticFile } from '../../api/reactQuery/AuthFile'
import OverlayDefault from '../../component/overlayLoading'

import { ErrorLoadingImageWrapper, ViewImageWrapper } from './style'
import { FiFrown } from 'react-icons/fi'

const ViewImage = () => {
  const { fileID, fileName } = useParams()
  const { data, isLoading } = useGetStaticFile({ fileID, fileName })

  return (
    <ViewImageWrapper>
      {isLoading ? (
        <OverlayDefault />
      ) : data ? (
        <Image
          src={URL.createObjectURL(data)}
          preview={{
            visible: true,
            closeIcon: null,
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
      ) : (
        <ErrorLoadingImageWrapper>
          <FiFrown />
          <p>Unable to load this image!</p>
        </ErrorLoadingImageWrapper>
      )}
    </ViewImageWrapper>
  )
}

export default ViewImage
