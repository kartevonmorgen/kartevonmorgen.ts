import {FC, useEffect} from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import {useMap} from 'react-leaflet'
import toString from 'lodash/toString'

import {fetchEntries, emptyEntries} from '../slices/entriesSlice'

import { convertBBoxToString, convertQueryParamToArray, convertQueryParamToString } from '../utils/utils'
import { SearchEntriesRequest as SearchEntriesRequestDTO } from '../dtos/SearchEntriesRequest'
import { isEntryCategory } from '../dtos/Categories'


const SearchEventsListener: FC =  () => {
  const router = useRouter()
  const {query} = router
  const {
    search: searchParam,
    lat,
    lng,
    zoom,
    type: typesParam,
  } = query

  const dispatch = useDispatch()

  const map = useMap()
  const bbox = convertBBoxToString(map.getBounds())

  // changing these variables result in triggering search action
  // params can be array. we should be sure all the dependencies are comparable with `===` operator
  // these dependency list should be consistent with SearchEntryRequest DTO
  const searchEffectDependencies = [
    toString(searchParam),
    toString(lat),
    toString(lng),
    toString(zoom),
    toString(typesParam),
  ]

  useEffect(() => {
    const typesArray = convertQueryParamToArray(typesParam)

    // if no entry category is there, we should set the entries state to an empty array
    const entryCategories = typesArray.filter(t => isEntryCategory(t))
    if (entryCategories.length !== 0) {
      const searchEntriesRequestDTO: SearchEntriesRequestDTO = {
        bbox: bbox,
        text: convertQueryParamToString(searchParam),
        categories: toString(typesParam)
      }
      dispatch(fetchEntries(searchEntriesRequestDTO))
    } else {
      dispatch(emptyEntries())
    }

  }, searchEffectDependencies)


  return null
}


export default SearchEventsListener