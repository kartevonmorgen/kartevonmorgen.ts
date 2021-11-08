import { ParsedUrlQuery } from 'querystring'
import { SearchEventsRequest as SearchEventsRequestDTO } from '../dtos/SearchEventsRequest'
import { convertQueryParamToInt, convertQueryParamToString } from '../utils/utils'
import { EventTimeBoundaries, getEventTimeBoundariesFromQuery } from '../utils/router'


export const convertQueryToEventRequestAndSetTimeBoundaries = (query: ParsedUrlQuery): SearchEventsRequestDTO => {
  // todo: can be used for searching for the result list

  const eventTimeBoundaries: EventTimeBoundaries = getEventTimeBoundariesFromQuery(query)

  const searchEventsRequest: SearchEventsRequestDTO = {
    tag: query.tag ? convertQueryParamToString(query.tag) : undefined,
    limit: query.limit ? convertQueryParamToInt(query.limit) : undefined,
    text: query.text ? convertQueryParamToString(query.text) : undefined,
    bbox: query.bbox ? convertQueryParamToString(query.bbox) : undefined,
    created_by: query.created_by ? convertQueryParamToString(query.created_by) : undefined,
    start_min: eventTimeBoundaries.startMin.unix(),
    start_max: eventTimeBoundaries.startMax?.unix(),
    end_min: eventTimeBoundaries.endMin.unix(),
  }

  Object.keys(searchEventsRequest).forEach(key => {
    if (searchEventsRequest[key] === undefined) {
      delete searchEventsRequest[key]
    }
  })

  return searchEventsRequest
}