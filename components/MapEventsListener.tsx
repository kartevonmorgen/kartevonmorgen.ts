import { FC, useEffect } from 'react'
import {useRouter} from 'next/router'

import {useMapEvents} from 'react-leaflet'

import { updateRoutingQueryWithoutDynamicParams } from '../utils/utils'

import { MAP_ROUTING as MAP_ROUTING_CONSTS } from '../consts/map'
import qs from 'qs'


// just this component has access to the map attributes, so only this one can make the search
const MapEventsListener: FC = () => {
  const router = useRouter()
  const { query } = router
  const {project} = query

  useEffect(() => {
  //  todo: somehow fly to the that center!
    console.log(
      query.lat,
      query.lng
    )
  }, [])

  const map = useMapEvents({
    moveend: (_event => {
      console.log(map.getCenter())

      // const paramsToUpdate = {
      //   name: 'navid'
      // }
      //
      // const newQueryParams = updateRoutingQueryWithoutDynamicParams(
      //   query,
      //   paramsToUpdate,
      //   MAP_ROUTING_CONSTS.dynamicParams,
      // )
      //
      // router.replace(
      //   `/maps/${project}?${qs.stringify(newQueryParams, { arrayFormat: 'repeat' })}`,
      //   undefined,
      //   { shallow: true },
      // )
    }),
    loading: (_event) => {
      console.log('loading')
    }
  })

  return null
}


export default MapEventsListener