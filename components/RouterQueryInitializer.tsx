import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import toString from 'lodash/toString'
import Category, { knownCategories } from '../dtos/Categories'
import {
  convertArrayToQueryParam,
  convertQueryParamToArray,
  convertQueryParamToBoolean,
  convertQueryParamToFloat,
  convertQueryParamToString,
  updateRoutingQuery,
} from '../utils/utils'
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
      type: typesParam,
      start_min: startMinParam,
      start_max: startMaxParam,
      isSidebarOpen: isSidebarOpenParam,
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
      toString(convertQueryParamToFloat(zoomParam)) :
      toString(initMapLocationProps.zoom)

    let types: Category[] = convertQueryParamToArray(typesParam) as Category[]
    types = types.length !== 0 ? types : knownCategories

    const startMin: string = startMinParam ?
      toString(convertQueryParamToFloat(startMinParam)) :
      toString(moment().startOf('day').subtract(1, 'days').unix())

    const startMax: string = startMaxParam ?
      toString(convertQueryParamToFloat(startMaxParam)) :
      toString(moment().startOf('day').add(7, 'days').unix())

    const isSidebarOpen: string = isSidebarOpenParam ?
      toString(convertQueryParamToBoolean(isSidebarOpenParam)) :
      toString(true)


    const paramsToUpdate = {
      c: center,
      z: zoom,
      type: convertArrayToQueryParam(types),
      start_min: startMin,
      start_max: startMax,
      isSidebarOpen,
    }

    // filter query params out of all params including the dynamic ones
    // if not removing slug from the query it will add it as a query param not a part of path
    const newQueryParams = updateRoutingQuery(query, paramsToUpdate)
    const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

    //todo: how about having other params like fixedTags but not zoom or things like that
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