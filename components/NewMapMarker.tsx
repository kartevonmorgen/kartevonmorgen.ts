import { FC } from 'react'
import { getIcon } from './MapMarkers'
import Category from '../dtos/Categories'
import { Marker } from 'react-leaflet'
import { useRouter } from 'next/router'
import { LatLng } from '../utils/geolocation'
import { getLatLngFromRouterWithParamName, isLatLngValid } from '../utils/router'


const NewMapMarker: FC = () => {
  const router = useRouter()

  const markedPinLatLng: LatLng = getLatLngFromRouterWithParamName(router, 'pinCenter')
  const showMarkedPin = isLatLngValid(markedPinLatLng)

  if (!showMarkedPin) {
    return null
  }

  return (
    <Marker
      position={markedPinLatLng}
      icon={getIcon([Category.UNKNOWN])}
    />
  )
}


export default NewMapMarker