import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import lodashToString from 'lodash/toString'
import { convertQueryParamToFloat, convertQueryParamToString, updateRoutingQuery } from '../utils/utils'
import { MapLocationProps } from './Map'
import {
  createSlugPathFromQueryAndRemoveSlug, getOptionalEntrySlugActionFromRoot,
  getRootSlugActionFromQuery,
  isPossiblyEntitySlugActionLocatable,
} from '../utils/slug'
import { convertLatLngToString, getOptionalEntityLocation, LatLng } from '../utils/geolocation'
import { RootSlugEntity, SlugAction } from '../utils/types'
import MAP_CONSTANTS from '../consts/map'


interface RouterQueryInitializerProps {
  initMapLocationProps: MapLocationProps
}

// todo: this component should be eliminated and merged into getServerSideProps
const RouterQueryInitializer: FC<RouterQueryInitializerProps> = (props) => {
  const { initMapLocationProps } = props

  const router = useRouter()
  const { query } = router

  // initialize the routing params
  useEffect(() => {
    async function initializeRoutingParams() {
      // all of that is to set the default URL query params
      // todo: make it a function because of readability and more params may come in the future
      const rootSlugAction = getRootSlugActionFromQuery(query)
      const isPossiblyRootOrEntitySlugActionLocatable = isPossiblyEntitySlugActionLocatable(rootSlugAction)
      let optionalEntityLocation: LatLng | null = null
      if (isPossiblyRootOrEntitySlugActionLocatable) {
        const entrySlugAction = getOptionalEntrySlugActionFromRoot(rootSlugAction)
        optionalEntityLocation = await getOptionalEntityLocation(
          (entrySlugAction as SlugAction).id as string,
          (entrySlugAction as SlugAction).entity as RootSlugEntity,
        )
      }

      const {
        c: centerParam,
        z: zoomParam,
      } = query


      let center: string = convertQueryParamToString(centerParam)
      if (center === '') {
        let centerLatLng: LatLng = {
          lat: initMapLocationProps.lat,
          lng: initMapLocationProps.lng,
        }

        if (optionalEntityLocation) {
          centerLatLng = optionalEntityLocation
        }

        center = convertLatLngToString(centerLatLng)
      }

      let zoom = initMapLocationProps.zoom
      if (zoomParam) {
        zoom = convertQueryParamToFloat(zoomParam)
      } else if (isPossiblyRootOrEntitySlugActionLocatable) {
        zoom = MAP_CONSTANTS.map.close_zoom
      } else {
        zoom = MAP_CONSTANTS.map.default_zoom
      }

      const paramsToUpdate = {
        c: center,
        z: lodashToString(zoom),
      }

      // filter query params out of all params including the dynamic ones
      // if not removing slug from the query it will add it as a query param not a part of path
      const newQueryParams = updateRoutingQuery(query, paramsToUpdate)
      const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

      // todo: how about having other params like fixedTags but not zoom or things like that
      router.replace(
        {
          pathname: `/m/${newPath}`,
          query: newQueryWithoutSlug,
        },
        undefined,
        { shallow: true },
      )
    }

    initializeRoutingParams().then()
  }, [])

  return null
}


export default RouterQueryInitializer
