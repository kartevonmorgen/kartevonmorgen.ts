import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMap } from 'react-leaflet'
import { convertQueryParamToFloat } from '../utils/utils'
import { LatLngExpression } from 'leaflet'
import { getCenterLatLngFromRouter } from '../utils/router'


const MapQueryParamsListener: FC = () => {
  const map = useMap()

  const router = useRouter()
  const { query } = router
  const {
    z: zoomParam,
  } = query

  const { lat, lng } = getCenterLatLngFromRouter(router)
  const zoom = convertQueryParamToFloat(zoomParam)

  const effectDependencies: any[] = [
    lat,
    lng,
    zoom,
  ]

  useEffect(() => {
    const latlng: LatLngExpression = [lat, lng]

    map.flyTo(latlng, zoom)
  }, effectDependencies)

  return null
}


export default MapQueryParamsListener
