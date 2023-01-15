import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMap } from 'react-leaflet'
import { convertQueryParamToFloat } from '../utils/utils'
import { getCenterLatLngFromRouter } from '../utils/router'


const MapLocationInitializer: FC = () => {
  const router = useRouter()
  const { query } = router

  const map = useMap()

  useEffect(() => {
    // the assumption is the lan, lng, zoom are set in the url from the query initializer
    const { z: zoomParam } = query
    const zoom = convertQueryParamToFloat(zoomParam)

    const { lat, lng } = getCenterLatLngFromRouter(router)

    map.flyTo([lat, lng], zoom)
  }, [])


  return null
}


export default MapLocationInitializer
