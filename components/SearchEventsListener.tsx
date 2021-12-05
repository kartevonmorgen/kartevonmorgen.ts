// TODO: use debounce to prevent extra queries
import { FC, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useMap } from 'react-leaflet'
import toString from 'lodash/toString'
import toNumber from 'lodash/toNumber'
import { emptyEntries, fetchEntries } from '../slices/entriesSlice'
import { emptyEvents, fetchEvents } from '../slices/eventsSlice'
import { convertBBoxToString, convertQueryParamToInt, convertQueryParamToString } from '../utils/utils'
import { SearchEntriesRequest as SearchEntriesRequestDTO } from '../dtos/SearchEntriesRequest'
import Category, { CategoryNameToIdMapper, CategoryToNameMapper, isEntryCategory } from '../dtos/Categories'
import { SearchEventsRequest as SearchEventsRequestDTO } from '../dtos/SearchEventsRequest'
import {
  EventTimeBoundaries,
  getEventTimeBoundariesFromRouter,
  getTypeNamesFromRouterOrKnownCategoryNamesIfEmpty,
} from '../utils/router'


const SearchEventsListener: FC = () => {
  const router = useRouter()
  const { query } = router
  const {
    search: searchParam,
    z: zoomParam,
    type: typesParam,
    limit: limitParam,
    tag: tagsParam,
    start_min: startMinParam,
    start_max: startMaxParam,
    end_min: endMinParam,
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
    toNumber(startMinParam),
    toNumber(startMaxParam),
    toNumber(endMinParam),
  ]


  // todo: separate the searching functionalities to a class for reusability
  useEffect(() => {
    const searchTerm: string = convertQueryParamToString(searchParam)

    // should not include limit if it's zero or not convertable to a number
    let limit: number | undefined = convertQueryParamToInt(limitParam)
    limit = limit !== 0 ? limit : undefined

    const typeNames = getTypeNamesFromRouterOrKnownCategoryNamesIfEmpty(router)

    // search entries
    // if no entry category is there, we should set the entries state to an empty array
    const entryCategories = typeNames.filter((t) => isEntryCategory(t)).map((tName) => CategoryNameToIdMapper[tName])
    if (entryCategories.length !== 0) {
      const searchEntriesRequestDTO: SearchEntriesRequestDTO = {
        bbox: bbox,
        text: searchTerm.length !== 0 ? searchTerm : undefined,
        categories: toString(entryCategories),
        limit: limit,
        tags: toString(tagsParam),
      }
      dispatch(fetchEntries(searchEntriesRequestDTO))
    } else {
      dispatch(emptyEntries())
    }

    // search events
    if (typeNames.includes(CategoryToNameMapper[Category.EVENT])) {
      const mapTimes: EventTimeBoundaries = getEventTimeBoundariesFromRouter(router)

      const searchEventsRequestDTO: SearchEventsRequestDTO = {
        bbox: bbox,
        text: searchTerm.length !== 0 ? searchTerm : undefined,
        limit: limit,
        tag: toString(tagsParam),
        start_min: mapTimes.startMin?.unix(),
        start_max: mapTimes.startMax?.unix(),
        end_min: mapTimes.endMin.unix(),
      }
      dispatch(fetchEvents(searchEventsRequestDTO))
    } else {
      dispatch(emptyEvents())
    }
  }, searchEffectDependencies)


  return null
}


export default SearchEventsListener
