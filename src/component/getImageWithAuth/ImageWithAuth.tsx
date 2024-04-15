import { useQuery } from '@tanstack/react-query'
import { Image, Skeleton, Spin } from 'antd'
import axios from 'axios'

import { LOCAL_STORAGE_ITEM } from '../../constants/common'
import ImageDefault from '../../resources/images/image-default.jpg'
import NameCardDefault from '../../resources/images/name-card-default.png'
import { LoadingOutlined } from '@ant-design/icons'

export const useRenderImageWithAuth = (url: string) => {
  let token = localStorage.getItem(LOCAL_STORAGE_ITEM.TOKEN)
  const fetchData = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      })
      return URL.createObjectURL(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  return useQuery({
    queryKey: ['RenderImageWithAuth', url],
    queryFn: () => fetchData(),
    staleTime: 3 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!url
  })
}

export const ImageWithAuth = ({
  url,
  preview,
  type = 'image'
}: {
  url: string
  preview?: boolean
  type?: string
}) => {
  const { data, isLoading, isError } = useRenderImageWithAuth(url)

  return (
    <>
      {/* {isLoading && <Spin style={{ position: 'absolute', zIndex: 1000 }} />} */}
      <div style={{ position: 'relative', height: '100%' }}>
        {isLoading && (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000
            }}
          />
        )}

        {isError || !data ? (
          <Image
            className='image-with-auth'
            src={type === 'name-card' ? NameCardDefault : ImageDefault}
            preview={false}
          />
        ) : (
          <Image className='image-with-auth' src={data} preview={!!preview} />
        )}
      </div>
    </>
  )
}
