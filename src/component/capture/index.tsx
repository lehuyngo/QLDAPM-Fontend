import React, { useState, useRef } from 'react'

import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'

import 'react-image-crop/dist/ReactCrop.css'
import { ScreenshotCaptureStyle } from './style'
import { useRenderImageWithAuth } from '../getImageWithAuth/ImageWithAuth'
import ImageDefault from '../../resources/images/image-default.jpg'
import NameCardDefault from '../../resources/images/name-card-default.png'

type Props = {
  oldSrc: any
  onEndCapture: (url: string) => void
  type?: string
}

const ScreenshotCapture: React.FC<Props> = ({
  oldSrc,
  onEndCapture,
  type = 'image'
}) => {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  const { data: image, isLoading, isError } = useRenderImageWithAuth(oldSrc)

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          onEndCapture
        )
      }
    },
    100,
    [completedCrop]
  )

  return (
    <ScreenshotCaptureStyle>
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        minWidth={64}
        minHeight={64}
      >
        <img
          ref={imgRef}
          alt='Crop me'
          src={
            isError || isLoading || !image
              ? type === 'name-card'
                ? NameCardDefault
                : ImageDefault
              : image
          }
        />
      </ReactCrop>

      {!!completedCrop && (
        <>
          <div>
            <canvas
              id={'test-canvas'}
              ref={previewCanvasRef}
              style={{
                display: 'none',
                border: '1px solid black',
                objectFit: 'contain',
                width: completedCrop.width,
                height: completedCrop.height
              }}
            />
          </div>
        </>
      )}
    </ScreenshotCaptureStyle>
  )
}

export default ScreenshotCapture
