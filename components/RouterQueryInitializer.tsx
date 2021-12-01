import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import lodashToString from 'lodash/toString'
import { convertQueryParamToFloat, convertQueryParamToString, updateRoutingQuery } from '../utils/utils'
import { MapLocationProps } from './Map'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import { convertLatLngToString, LatLng } from '../utils/geolocation'


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
    // all of that is to set the default URL query params
    // todo: make it a function because of readability and more params may come in the future
    const {
      c: centerParam,
      z: zoomParam,
    } = query


    let center: string = convertQueryParamToString(centerParam)
    if (center === '') {
      const centerLatLng: LatLng = {
        lat: initMapLocationProps.lat,
        lng: initMapLocationProps.lng,
      }

      center = convertLatLngToString(centerLatLng)
    }

    const zoom: string = zoomParam ?
      lodashToString(convertQueryParamToFloat(zoomParam)) :
      lodashToString(initMapLocationProps.zoom)

    const paramsToUpdate = {
      c: center,
      z: zoom,
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
  }, [])

  return null
}


export default RouterQueryInitializer
