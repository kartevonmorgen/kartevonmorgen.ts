import { FC } from 'react'
import { useRouter } from 'next/router'
import { LeafletEvent, LeafletMouseEvent } from 'leaflet'
import { useMapEvents } from 'react-leaflet'
import toString from 'lodash/toString'
import { updateRoutingQuery } from '../utils/utils'
import { getRootSlugActionFromQuery } from '../utils/slug'
import { RootSlugEntity, SlugVerb } from '../utils/types'


// just this component has access to the map attributes, so only this one can make the search
const MapEventsListener: FC = () => {
  const router = useRouter()
  const { query } = router

  const map = useMapEvents({
    moveend: ((_event: LeafletEvent) => {

      const { lat, lng } = map.getCenter()

      const zoom = map.getZoom()

      // todo: debounce needed
      const paramsToUpdate = {
        lat: lat.toFixed(4),
        lng: lng.toFixed(4),
        zoom: zoom.toFixed(2),
      }

      const newQueryParams = updateRoutingQuery(query, paramsToUpdate)

      router.replace(
        {
          pathname: '/maps/[...slug]',
          query: newQueryParams,
        },
        undefined,
        { shallow: true },
      )
    }),

    click: ((event: LeafletMouseEvent) => {
      const { latlng } = event
      const { lat, lng } = latlng

      const slugAction = getRootSlugActionFromQuery(query)
      const { subSlugAction } = slugAction
      if (
        (subSlugAction !== null) &&
        (subSlugAction.entity === RootSlugEntity.EVENT || subSlugAction.entity === RootSlugEntity.ENTRY) &&
        (subSlugAction.verb === SlugVerb.CREATE || subSlugAction.verb === SlugVerb.EDIT)
      ) {
        const paramsToUpdate = {
          pinLat: toString(lat),
          pinLng: toString(lng),
        }

        const newQueryParams = updateRoutingQuery(query, paramsToUpdate)

        router.replace(
          {
            pathname: '/maps/[...slug]',
            query: newQueryParams,
          },
          undefined,
          { shallow: true },
        )
      }
    }),

  })

  return null
}


export default MapEventsListener