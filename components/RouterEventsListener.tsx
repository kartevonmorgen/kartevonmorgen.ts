import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'

import qs from 'qs'
import toString from 'lodash/toString'

import { convertQueryParamToFloat, removeDynamicRoutingParams, updateRoutingQuery } from '../utils/utils'

import MAP_CONSTANTS, { MAP_ROUTING as MAP_ROUTING_CONSTS } from '../consts/map'

import { SearchEntryRequest as  SearchEntryRequestDTO } from '../dtos/SearchEntryRequest'

import { MapLocationProps } from './Map'


interface RouterEventsListenerProps {
  initMapLocationProps: MapLocationProps

}

const RouterEventsListener: FC<RouterEventsListenerProps> = (props) => {
  const { initMapLocationProps } = props

  const router = useRouter()
  const { query } = router
  // changing these variables result in triggering search action
  // params can be array. we should be sure all the dependencies are comparable with `===` operator
  // these dependency list should be consistent with SearchEntryRequest DTO
  const searchEffectDependencies = [
    toString(query.search),
    toString(query.lat),
    toString(query.lng),
    toString(query.zoom),
  ]

  // initialize the routing params
  useEffect(() => {
    // all of that is to set the default URL query params
    // todo: make it a function because of readability and more params may come in the future
    const { lat: latParam, lng: lngParam, zoom: zoomParam, project } = query
    // coming from the dynamic routing. we should not add them as the query params
    const lat: string = latParam ?
      convertQueryParamToFloat(latParam).toPrecision(MAP_CONSTANTS.precisions.lat) :
      initMapLocationProps.lat.toPrecision(MAP_CONSTANTS.precisions.lat)
    const lng: string = lngParam ?
      convertQueryParamToFloat(lngParam).toPrecision(MAP_CONSTANTS.precisions.lng) :
      initMapLocationProps.lng.toPrecision(MAP_CONSTANTS.precisions.lng)
    const zoom: string = zoomParam ?
      convertQueryParamToFloat(zoomParam).toPrecision(MAP_CONSTANTS.precisions.zoom) :
      initMapLocationProps.zoom.toPrecision(MAP_CONSTANTS.precisions.zoom)
    const paramsToUpdate = { lat, lng, zoom }

    // filter query params out of all params including the dynamic ones
    // todo: chain the updateRoutingParams + removeDynamicRoutingParams = updateRoutingParamsWithoutDynamicParams
    let newQueryParams = updateRoutingQuery(query, paramsToUpdate)
    newQueryParams = removeDynamicRoutingParams(newQueryParams, MAP_ROUTING_CONSTS.dynamicParams)


    //todo: how about having other params like fixedTags but not zoom or things like that
    router.replace(
      `/maps/${project}?${qs.stringify(newQueryParams, { arrayFormat: 'repeat' })}`,
      undefined,
      { shallow: true },
    )
  }, [])

  // todo: on based on what url params we should fetch new entries
  useEffect(() => {
    const searchRequest: SearchEntryRequestDTO = {
      bbox: '48.48748647988415,3.4936523437500004,53.05442186546102,18.336181640625004'
    }

  }, searchEffectDependencies)

  // todo: on what criteria we should change the view, like showing an entry or the result list
  useEffect(() => {

  }, [])

  return null
}


export default RouterEventsListener