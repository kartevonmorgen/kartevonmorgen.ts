import { FC } from 'react'

// Icons Football EU
import { FaFutbol, FaLock, FaMapPin, FaSeedling, FaTractor, FaTruckLoading, FaTint, FaLaptopCode } from 'react-icons/fa'
import { FaTruckArrowRight } from 'react-icons/fa6'
import { IoMdFootball, IoIosFootball } from 'react-icons/io'
import { IoFootball, IoFootballOutline, IoStorefrontSharp } from 'react-icons/io5'
// Icons refill
import { IoIosWater, IoMdWater } from 'react-icons/io'
import { FaHandHoldingWater } from 'react-icons/fa'
import { IoWater, IoWaterOutline } from 'react-icons/io5'
import { FaGlassWater, FaBottleWater, FaGlassWater, FaGlassWaterDroplet, FaWater } from 'react-icons/fa6'
import { MdOutlineWaterDrop, MdWaterDrop } from 'react-icons/md'
import { GiWaterDrop } from 'react-icons/gi'
import { RiHomeOfficeFill } from 'react-icons/ri'
import { TbMapPinDown, TbDropletStar } from 'react-icons/tb'
import { PiPlant, PiFarm } from 'react-icons/pi'

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
    case 'IoFootballOutline':
      Icon = IoFootballOutline
      break
// refill
    case 'IoIosWater': Icon = IoIosWater break
    case 'IoMdWater': Icon = IoMdWater break
    case 'FaGlassWater': Icon = FaGlassWater break
      case 'FaGlassWaterDroplet': Icon = FaGlassWaterDroplet break
    case 'FaBottleWater': Icon = FaBottleWater break
    case 'FaHandHoldingWater': Icon = FaHandHoldingWater break
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
