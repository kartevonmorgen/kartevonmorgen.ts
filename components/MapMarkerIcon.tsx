import { FC } from 'react'

import { FaFutbol } from '@react-icons/all-files/fa/FaFutbol'
import { IconBaseProps, IconType } from 'react-icons'


interface MapMarkerIconProps extends IconBaseProps {
  icon: string
}

const MapMarkerIcon: FC<MapMarkerIconProps> = (props) => {
  const { icon, ...iconProps } = props

  let Icon: IconType | null = null
  switch (icon) {
    case 'FaFutbol':
      Icon = FaFutbol
      break
    default:
      break
  }

  return (
    <FaFutbol {...iconProps} />
  )
}

export default MapMarkerIcon
