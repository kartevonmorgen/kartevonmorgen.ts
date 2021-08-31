// TODO: use debounce to prevent extra queries
import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

import { useMap } from 'react-leaflet'
import toString from 'lodash/toString'
import toNumber from 'lodash/toNumber'

import { emptyEntries, fetchEntries } from '../slices/entriesSlice'
import { emptyEvents, fetchEvents } from '../slices/eventsSlice'

import {
  convertBBoxToString,
  convertQueryParamToArray,
  convertQueryParamToInt,
  convertQueryParamToString,
} from '../utils/utils'
import { SearchEntriesRequest as SearchEntriesRequestDTO } from '../dtos/SearchEntriesRequest'
import Category, { isEntryCategory } from '../dtos/Categories'
import { SearchEventsRequest as SearchEventsRequestDTO } from '../dtos/SearchEventsRequest'


const SearchEventsListener: FC = () => {
  const router = useRouter()
  const { query } = router
  const {
    search: searchParam,
    z: zoomParam,
    type: typesParam,
    limit: limitParam,
    tag: tagsParam,
    start_min: startMin,
    start_max: startMax,
  } = query

  const dispatch = useDispatch()
  const map = useMap()

  const bbox = convertBBoxToString(map.getBounds())


  // changing these variables result in triggering search action
  // params can be array. we should be sure all the dependencies are comparable with `===` operator
  // these dependency list should be consistent with SearchEntryRequest DTO
  const searchEffectDependencies = [
    toString(searchParam),
    bbox,
    toNumber(zoomParam),
    toString(typesParam),
    toNumber(limitParam),
    toString(tagsParam),
    toNumber(startMin),
    toNumber(startMax),
  ]


  // todo: separate the searching functionalities to a class for reusability
  useEffect(() => {
    const searchTerm: string = convertQueryParamToString(searchParam)

    // should not include limit if it's zero or not convertable to a number
    let limit: number | undefined = convertQueryParamToInt(limitParam)
    limit = limit !== 0 ? limit : undefined

    const typesArray = convertQueryParamToArray(typesParam)

    // search entries
    // if no entry category is there, we should set the entries state to an empty array
    const entryCategories = typesArray.filter(t => isEntryCategory(t))
    if (entryCategories.length !== 0) {
      const searchEntriesRequestDTO: SearchEntriesRequestDTO = {
        bbox: bbox,
        text: searchTerm,
        categories: toString(typesParam),
        limit: limit,
        tags: toString(tagsParam),
      }
      dispatch(fetchEntries(searchEntriesRequestDTO))
    } else {
      dispatch(emptyEntries())
    }

    // search events
    if (typesArray.includes(Category.EVENT)) {
      const searchEventsRequestDTO: SearchEventsRequestDTO = {
        bbox: bbox,
        text: searchTerm,
        limit: limit,
        tag: toString(tagsParam),
        start_min: toNumber(startMin),
        start_max: toNumber(startMax),
      }
      dispatch(fetchEvents(searchEventsRequestDTO))
    } else {
      dispatch(emptyEvents())
    }

  }, searchEffectDependencies)


  return null
}


export default SearchEventsListener