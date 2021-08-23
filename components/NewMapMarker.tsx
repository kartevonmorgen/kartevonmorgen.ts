import { FC } from 'react'
import { latLng, LatLng } from 'leaflet'
import { convertQueryParamToFloat } from '../utils/utils'
import { getIcon } from './MapMarkers'
import Category from '../dtos/Categories'
import { Marker } from 'react-leaflet'
import { useRouter } from 'next/router'


const NewMapMarker: FC = () => {

  const router = useRouter()
  const { query } = router

  const markedPinLatLng: LatLng = latLng(convertQueryParamToFloat(query.pinLat), convertQueryParamToFloat(query.pinLng))
  const showMarkedPin = !!markedPinLatLng.lat && !!markedPinLatLng.lng

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