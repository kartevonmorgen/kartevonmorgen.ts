import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMap } from 'react-leaflet'
import { convertQueryParamToFloat, convertQueryParamToString } from '../utils/utils'
import { LatLngExpression } from 'leaflet'


const MapQueryParamsListener: FC = () => {
  const map = useMap()

  const router = useRouter()
  const { query } = router
  const {
    lat: latParam,
    lng: lngParam,
    z: zoomParam,
  } = query

  const lat = convertQueryParamToFloat(latParam)
  const lng = convertQueryParamToFloat(lngParam)
  const zoom = convertQueryParamToFloat(zoomParam)

  const effectDependencies: string[] = [
    convertQueryParamToString(latParam),
    convertQueryParamToString(lngParam),
    convertQueryParamToString(zoomParam),
  ]

  useEffect(() => {

    const latlng: LatLngExpression = [lat, lng]

    map.flyTo(latlng, zoom)

  }, effectDependencies)

  return null
}


export default MapQueryParamsListener