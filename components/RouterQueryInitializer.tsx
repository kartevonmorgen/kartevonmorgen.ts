import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'

import qs from 'qs'
import toString from 'lodash/toString'

import { convertQueryParamToFloat, updateRoutingQueryWithoutDynamicParams } from '../utils/utils'

import { MAP_ROUTING as MAP_ROUTING_CONSTS } from '../consts/map'

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
    const { lat: latParam, lng: lngParam, zoom: zoomParam, project } = query

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
    const paramsToUpdate = { lat, lng, zoom }

    // filter query params out of all params including the dynamic ones
    const newQueryParams = updateRoutingQueryWithoutDynamicParams(
      query,
      paramsToUpdate,
      MAP_ROUTING_CONSTS.dynamicParams,
    )


    //todo: how about having other params like fixedTags but not zoom or things like that
    router.replace(
      `/maps/${project}?${qs.stringify(newQueryParams, { arrayFormat: 'repeat' })}`,
      undefined,
      { shallow: true },
    )
  }, [])

  return null
}


export default RouterQueryInitializer