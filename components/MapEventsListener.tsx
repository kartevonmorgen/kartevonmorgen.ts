import { FC } from 'react'
import { useRouter } from 'next/router'

import { useMapEvents } from 'react-leaflet'
import toString from 'lodash/toString'

import { updateRoutingQuery } from '../utils/utils'


// just this component has access to the map attributes, so only this one can make the search
const MapEventsListener: FC = () => {
  const router = useRouter()
  const { query } = router

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

      const newQueryParams = updateRoutingQuery(query, paramsToUpdate)

      router.replace(
        {
          pathname: '/maps/[project]',
          query: newQueryParams,
        },
        undefined,
        { shallow: true }
      )
    }),
  })

  return null
}


export default MapEventsListener