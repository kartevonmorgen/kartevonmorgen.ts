import { FC } from 'react'
import { useRouter } from 'next/router'
import { LatLng, LeafletEvent, LeafletMouseEvent } from 'leaflet'
import { useMapEvents } from 'react-leaflet'
import { updateRoutingQuery } from '../utils/utils'
import { createSlugPathFromQueryAndRemoveSlug, getRootSlugActionFromQuery } from '../utils/slug'
import { RootSlugEntity, SlugVerb } from '../utils/types'
import { convertLatLngToString } from '../utils/geolocation'


// just this component has access to the map attributes, so only this one can make the search
const MapEventsListener: FC = () => {
  const router = useRouter()
  const { query } = router

  const map = useMapEvents({
    moveend: ((_event: LeafletEvent) => {

      const mapCenter: LatLng = map.getCenter()

      const zoom = map.getZoom()

      // todo: debounce needed
      const paramsToUpdate = {
        c: convertLatLngToString(mapCenter),
        z: zoom.toFixed(2),
      }

      const newQueryParams = updateRoutingQuery(query, paramsToUpdate)
      const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

      router.replace(
        {
          pathname: `/m/${newPath}`,
          query: newQueryWithoutSlug,
        },
        undefined,
        { shallow: true },
      )
    }),

    click: ((event: LeafletMouseEvent) => {
      const { latlng } = event

      const slugAction = getRootSlugActionFromQuery(query)
      const { subSlugAction } = slugAction
      if (
        (subSlugAction !== null) &&
        (subSlugAction.entity === RootSlugEntity.EVENT || subSlugAction.entity === RootSlugEntity.ENTRY) &&
        (subSlugAction.verb === SlugVerb.CREATE || subSlugAction.verb === SlugVerb.EDIT)
      ) {
        const paramsToUpdate = {
          pinCenter: convertLatLngToString(latlng),
        }

        const newQueryParams = updateRoutingQuery(query, paramsToUpdate)
        const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

        router.replace(
          {
            pathname: `/m/${newPath}`,
            query: newQueryWithoutSlug,
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