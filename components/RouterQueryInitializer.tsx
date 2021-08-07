import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import toString from 'lodash/toString'
import Category from '../dtos/Categories'
import { types as defaultTypes } from './TypeChooser'
import {
  convertQueryParamToArray,
  convertQueryParamToBoolean,
  convertQueryParamToFloat,
  updateRoutingQuery,
} from '../utils/utils'
import { MapLocationProps } from './Map'
import { createSlugPathFromQueryAndRemoveSlug } from '../utils/slug'
import { getCurrentPosition } from '../utils/geolocation'


interface RouterQueryInitializerProps {
  initMapLocationProps: MapLocationProps
}

// todo: this component should be eliminated and merged into getServerSideProps
const RouterQueryInitializer: FC<RouterQueryInitializerProps> = (props) => {
  const { initMapLocationProps } = props

  const router = useRouter()
  const { query } = router
  // initialize the routing params
  useEffect(()=> {

    async function initialParams () {
      

      // all of that is to set the default URL query params
      // todo: make it a function because of readability and more params may come in the future
      const {
        lat: latParam,
        lng: lngParam,
        zoom: zoomParam,
        type: typesParam,
        start_min: startMinParam,
        start_max: startMaxParam,
        isSidebarOpen: isSidebarOpenParam,
      } = query

      // coming from the dynamic routing. we should not add them as the query params
      const lat: string = latParam ?
        toString(convertQueryParamToFloat(latParam)) :
        toString(initMapLocationProps.lat)
      const lng: string = lngParam ?
        toString(convertQueryParamToFloat(lngParam)) :
        toString(initMapLocationProps.lng)
      const zoom: string = zoomParam ?
        toString(convertQueryParamToFloat(zoomParam)) :
        toString(initMapLocationProps.zoom)

      let types: Category[] = convertQueryParamToArray(typesParam) as Category[]
      types = types.length !== 0 ? types : defaultTypes.map(t => t.id)

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
        lat,
        lng,
        zoom,
        type: types,
        start_min: startMin,
        start_max: startMax,
        isSidebarOpen,
      }

      try {
        const currentPosition: GeolocationPosition = await getCurrentPosition()
        paramsToUpdate.lat = currentPosition.coords.latitude.toFixed(4)
        paramsToUpdate.lng = currentPosition.coords.longitude.toFixed(4)
      } catch (e) {

      }

      // filter query params out of all params including the dynamic ones
      // if not removing slug from the query it will add it as a query param not a part of path
      const newQueryParams = updateRoutingQuery(query, paramsToUpdate)
      const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

      //todo: how about having other params like fixedTags but not zoom or things like that
      router.replace(
        {
          pathname: `/maps/${newPath}`,
          query: newQueryWithoutSlug,
        },
        undefined,
        { shallow: true },
      )
    }

    initialParams()
  }, [])



  return null
}




export default RouterQueryInitializer