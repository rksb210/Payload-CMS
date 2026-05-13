'use client'

import { cn } from '@/utilities/ui'
import React from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

export const AudioMedia: React.FC<MediaProps> = (props) => {
  const { resource, controls = true } = props

  if (resource && typeof resource === 'object') {
    const { filename, url, mimeType } = resource
    const audioUrl = url || getMediaUrl(`/media/${filename}`)

    return (
      <audio
        className="w-full"
        controls={controls}
        key={audioUrl}
        preload="metadata"
      >
        <source src={audioUrl} type={mimeType || undefined} />
        Your browser does not support the audio tag.
      </audio>
    )
  }

  return null
}
