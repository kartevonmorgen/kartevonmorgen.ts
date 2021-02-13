import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'

import MAP_CONSTANTS, { MAP_ROUTING as MAP_ROUTING_CONSTS } from '../consts/map'
import qs from 'qs'
import { useMap } from 'react-leaflet'
import { convertQueryParamToFloat } from '../utils/utils'


const MapLocationInitializer: FC = () => {
  const router = useRouter()
  const { query } = router

  const map = useMap()

  useEffect(() => {
    // the assumption is the lan, lng, zoom are set in the url from the query initializer
    const { lat: latParam, lng: lngParam, zoom: zoomParam} = query
    const lat = convertQueryParamToFloat(latParam)
    const lng = convertQueryParamToFloat(lngParam)
    const zoom = convertQueryParamToFloat(zoomParam)

    map.flyTo([lat, lng], zoom)
  }, [])


  return null
}


export default MapLocationInitializer