import { SearchEventsRequest as SearchEventsRequestDTO } from '../dtos/SearchEventsRequest'
import { ParsedUrlQuery } from 'querystring'
import { convertQueryParamToInt, convertQueryParamToString } from '../utils/utils'


export const convertQueryToEventRequest = (query: ParsedUrlQuery): SearchEventsRequestDTO => {
  // todo: can be used for searching for the result list

  return {
    tag: query.tag ? convertQueryParamToString(query.tag) : undefined,
    limit: query.limit ? convertQueryParamToInt(query.limit) : undefined,
    text: query.text ? convertQueryParamToString(query.text) : undefined,
    bbox: query.bbox ? convertQueryParamToString(query.bbox) : undefined,
    created_by: query.created_by ? convertQueryParamToString(query.created_by) : undefined,
    start_max: query.start_max ? convertQueryParamToInt(query.start_max) : undefined,
    start_min: query.start_min ? convertQueryParamToInt(query.start_min) : undefined,
  }
}