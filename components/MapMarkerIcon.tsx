import { FC } from 'react'

import { FaFutbol } from '@react-icons/all-files/fa/FaFutbol'
import { FaLock } from '@react-icons/all-files/fa/FaLock'
import { IoMdFootball } from '@react-icons/all-files/io/IoMdFootball'
import { IoIosFootball } from '@react-icons/all-files/io/IoIosFootball'
import { IoFootball } from @react-icons/io5/IoFootball'
import { IoFootballOutline } from @react-icons/io5/IoFootballOutline'
// Teikei Icons: 
import { TbMapPinDown } from "react-icons/tb";
import { IoStorefrontSharp } from "react-icons/io5";
import { PiPlant } from "react-icons/pi";
import { PiFarm } from "react-icons/pi";
import { FaTruckLoading } from "react-icons/fa";
import { FaTruckArrowRight } from "react-icons/fa6";
import { TbDropletStar } from "react-icons/tb";
import { RiHomeOfficeFill } from "react-icons/ri";
import { FaLaptopCode } from "react-icons/fa";
// others?
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
    case 'IoMdFootball':
      Icon = IoMdFootball
      break
    case 'IoIosFootball':
      Icon = IoIosFootball
      break
    case 'IoFootball':
      Icon = IoFootball
      break
    case 'IoMdFootball':
      Icon = IoMdFootball
      break
      // Teikei Icons: 
    case 'TbMapPinDown':
      Icon = TbMapPinDown
      break
    case 'IoStorefrontSharp':
      Icon = IoStorefrontSharp
      break
    case 'PiPlant':
      Icon = PiPlant
      break
    case 'PiFarm':
      Icon = PiFarm
      break
    case 'FaTruckLoading':
      Icon = FaTruckLoading
      break
    case 'FaTruckArrowRight':
      Icon = FaTruckArrowRight
      break
    case 'TbDropletStar':
      Icon = TbDropletStar
      break
    case 'RiHomeOfficeFill':
      Icon = RiHomeOfficeFill
      break
    case 'FaLaptopCode':
      Icon = FaLaptopCode
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
