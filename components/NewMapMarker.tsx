import { FC } from 'react'
import { getBalloonIcon } from './MapMarker'
import Category from '../dtos/Categories'
import { Marker as LeafletMarker } from 'react-leaflet'
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
    <LeafletMarker
      position={markedPinLatLng}
      icon={getBalloonIcon(Category.UNKNOWN)}
    />
  )
}


export default NewMapMarker
