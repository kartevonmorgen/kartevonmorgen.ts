import { FC } from 'react'

import { FaFutbol } from '@react-icons/all-files/fa/FaFutbol'
import { FaLock } from '@react-icons/all-files/fa/FaLock'
import { IconBaseProps, IconType } from 'react-icons'


interface MapMarkerIconProps extends IconBaseProps {
  icon: string
}

const MapMarkerIcon: FC<MapMarkerIconProps> = (props) => {
  const { icon, ...iconProps } = props

  let Icon = null
  switch (icon) {
    case 'FaFutbol':
      Icon = FaFutbol
      break
    case 'FaLock':
      Icon = FaLock
      break
    default:
      break
  }

  if (Icon === null) {
    return null
  }

  return (
    <Icon {...iconProps} />
  )
}

export default MapMarkerIcon
