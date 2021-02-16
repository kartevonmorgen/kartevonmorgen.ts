import {FC, useEffect} from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import {useMap} from 'react-leaflet'
import toString from 'lodash/toString'

import {fetchEntries} from '../slices/entriesSlice'

import { convertBBoxToString, convertQueryParamToString } from '../utils/utils'
import { SearchEntriesRequest as SearchEntriesRequestDTO } from '../dtos/SearchEntriesRequest'


const SearchEventsListener: FC =  () => {
  const router = useRouter()
  const {query} = router

  const dispatch = useDispatch()

  const map = useMap()
  const bbox = convertBBoxToString(map.getBounds())

  // changing these variables result in triggering search action
  // params can be array. we should be sure all the dependencies are comparable with `===` operator
  // these dependency list should be consistent with SearchEntryRequest DTO
  const searchEffectDependencies = [
    toString(query.search),
    toString(query.lat),
    toString(query.lng),
    toString(query.zoom),
    bbox
  ]

  useEffect(() => {
    const {search: searchQuery} = query

    const searchEntriesRequestDTO: SearchEntriesRequestDTO = {
      bbox: bbox,
      text: convertQueryParamToString(searchQuery),
    }

    dispatch(fetchEntries(searchEntriesRequestDTO))

  }, searchEffectDependencies)


  return null
}


export default SearchEventsListener