import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import toString from 'lodash/toString'
import Category from '../dtos/Categories'
import { types as defaultTypes } from './TypeChooser'
import { convertQueryParamToArray, convertQueryParamToFloat, updateRoutingQuery } from '../utils/utils'
import { MapLocationProps } from './Map'


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
      lat: latParam,
      lng: lngParam,
      zoom: zoomParam,
      type: typesParam,
      start_min: startMinParam,
      start_max: startMaxParam,
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

    const startMin = startMinParam ?
      toString(convertQueryParamToFloat(startMinParam)) :
      toString(moment().startOf('day').subtract(1, 'days').unix())

    const startMax = startMaxParam ?
      toString(convertQueryParamToFloat(startMaxParam)) :
      toString(moment().startOf('day').add(7, 'days').unix())


    const paramsToUpdate = {
      lat,
      lng,
      zoom,
      type: types,
      start_min: startMin,
      start_max: startMax,
    }

    // filter query params out of all params including the dynamic ones
    const newQueryParams = updateRoutingQuery(query, paramsToUpdate)

    //todo: how about having other params like fixedTags but not zoom or things like that
    router.replace(
      {
        pathname: '/maps/[...slug]',
        query: newQueryParams,
      },
      undefined,
      { shallow: true },
    )
  }, [])

  return null
}


export default RouterQueryInitializer