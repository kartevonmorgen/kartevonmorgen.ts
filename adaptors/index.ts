import { ParsedUrlQuery } from 'querystring'
import { SearchEventsRequest as SearchEventsRequestDTO } from '../dtos/SearchEventsRequest'
import {
  concatTagsWithSearchTerm,
  convertQueryParamToArray,
  convertQueryParamToInt,
  convertQueryParamToString,
} from '../utils/utils'
import { EventTimeBoundaries, getEventTimeBoundariesFromQueryOrDefaults } from '../utils/router'


export const convertQueryToEventRequestAndSetTimeBoundaries = (query: ParsedUrlQuery): SearchEventsRequestDTO => {

  const {
    search: searchParam,
    fixedTags: fixedTagsParam,
    tag: tagsParam,
    limit: limitParam,
    bbox: bboxParam,
    created_by: createdByParam,
  } = query

  // todo: can be used for searching for the result list
  const fixedTags: string[] = convertQueryParamToArray(fixedTagsParam)
  const tags: string[] = convertQueryParamToArray(tagsParam)
  const compoundTags = [...fixedTags, ...tags]

  const searchTerm: string = convertQueryParamToString(searchParam)
  const searchTextWithTags = concatTagsWithSearchTerm(searchTerm, compoundTags)

  const eventTimeBoundaries: EventTimeBoundaries = getEventTimeBoundariesFromQueryOrDefaults(query)

  const searchEventsRequest: SearchEventsRequestDTO = {
    limit: limitParam ? convertQueryParamToInt(limitParam) : undefined,
    text: searchTextWithTags,
    bbox: bboxParam ? convertQueryParamToString(bboxParam) : undefined,
    created_by: createdByParam ? convertQueryParamToString(createdByParam) : undefined,
    start_min: eventTimeBoundaries.startMin?.unix(),
    start_max: eventTimeBoundaries.startMax?.unix(),
    end_min: eventTimeBoundaries.endMin?.unix(),
  }

  Object.keys(searchEventsRequest).forEach(key => {
    if (searchEventsRequest[key as keyof SearchEventsRequestDTO] === undefined) {
      delete searchEventsRequest[key as keyof SearchEventsRequestDTO]
    }
  })

  return searchEventsRequest
}
