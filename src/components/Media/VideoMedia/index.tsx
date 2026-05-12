'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, resource, videoClassName, controls = true } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource === 'object') {
    const { filename, url, mimeType } = resource
    const videoUrl = url || getMediaUrl(`/media/${filename}`)

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls={controls}
        key={videoUrl}
        loop
        muted
        onClick={onClick}
        playsInline
        preload="metadata"
        ref={videoRef}
      >
        <source src={videoUrl} type={mimeType || undefined} />
        Your browser does not support the video tag.
      </video>
    )
  }

  return null
}
