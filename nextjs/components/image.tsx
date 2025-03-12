/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable custom-rules/encourage-object-params */
"use client"

import React from "react"

import Image, {
  type StaticImageData,
  type ImageProps,
} from "next/image"

import {
  getConfigs,
} from "~/shared/hooks/data/use-config"
import {
  useLazyRef,
} from "~/shared/hooks/state/use-lazy-ref"

export interface ImageViewProps extends Omit<ImageProps, "src"> {
  src?: string | StaticImageData | false
  defaultSrc?: string
  isAvatar?: boolean
}

export const ImageView = React.memo(({
  src, defaultSrc: defaultSrcProp, isAvatar, ...props
}: ImageViewProps) => {
  const configsRef = useLazyRef(getConfigs)

  const defaultSrc = defaultSrcProp
    ? defaultSrcProp
    : isAvatar
      ? configsRef.current?.config_default_avatar_link ?? "/images/profile/user-1.jpg"
      : configsRef.current?.config_default_image_link ?? "/images/default-image.jpg"
  return (
    <Image
      src={src ? src : defaultSrc}
      {...props}
    />
  )
})
ImageView.displayName = "ImageView"
