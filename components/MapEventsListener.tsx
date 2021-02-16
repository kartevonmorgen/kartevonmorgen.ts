import { FC } from 'react'
import { useRouter } from 'next/router'

import { useMapEvents } from 'react-leaflet'
import toString from 'lodash/toString'

import { updateRoutingQueryWithoutDynamicParams } from '../utils/utils'

import { MAP_ROUTING as MAP_ROUTING_CONSTS } from '../consts/map'
import qs from 'qs'


// just this component has access to the map attributes, so only this one can make the search
const MapEventsListener: FC = () => {
  const router = useRouter()
  const { query } = router
  const { project } = query


  const map = useMapEvents({
    moveend: (_event => {
      const { lat, lng } = map.getCenter()
      const zoom = map.getZoom()

      // todo: debounce needed
      const paramsToUpdate = {
        lat: toString(lat),
        lng: toString(lng),
        zoom: toString(zoom),
      }

      const newQueryParams = updateRoutingQueryWithoutDynamicParams(
        query,
        paramsToUpdate,
        MAP_ROUTING_CONSTS.dynamicParams,
      )

      router.replace(
        `/maps/${project}?${qs.stringify(newQueryParams, { arrayFormat: 'repeat' })}`,
        undefined,
        { shallow: true },
      )
    }),
  })

  return null
}


export default MapEventsListener