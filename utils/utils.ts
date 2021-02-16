import produce from 'immer'
import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'
import toString from 'lodash/toString'
import { ParsedUrlQuery } from 'querystring'
import { LatLngBounds } from 'leaflet'


export const convertQueryParamToString = (stringOrArrayOfStrings: string | string[]): string => {
  if (isEmpty(stringOrArrayOfStrings)) {
    return ''
  }

  if (isString(stringOrArrayOfStrings)) {
    return stringOrArrayOfStrings
  }

  return stringOrArrayOfStrings[0]
}

export const convertStringToFloat = (str: string): number => {
  const result = parseFloat(str)
  if (isNaN(result)) {
    return 0.0
  }

  return result
}

export const convertQueryParamToFloat = (param: string | string[]): number => (
  convertStringToFloat(
    convertQueryParamToString(param),
  )
)

export const updateRoutingQuery = (query: ParsedUrlQuery, newParams: ParsedUrlQuery): ParsedUrlQuery => {
  return produce(query, draftState => {
    Object.keys(newParams).forEach(param => {
      draftState[param] = newParams[param]
    })
  })
}

export const removeDynamicRoutingParams = (query: ParsedUrlQuery, dynamicParams: string[]): ParsedUrlQuery => {
  return produce(query, draftState => dynamicParams.forEach(param => {
    delete draftState[param]
  }))
}

export const updateRoutingQueryWithoutDynamicParams = (
  query: ParsedUrlQuery,
  newParams: ParsedUrlQuery,
  dynamicParams: string[],
): ParsedUrlQuery => {
  return removeDynamicRoutingParams(
    updateRoutingQuery(query, newParams),
    dynamicParams,
  )
}

export const convertBBoxToString = (bbox: LatLngBounds): string => {
  // const bboxCoords = [sw.lat, sw.lng, ne.lat, ne.lng]
  const sw = bbox.getSouthWest()
  const ne = bbox.getNorthEast()

  const bboxCoords = [
    sw.lat,
    sw.lng,
    ne.lat,
    ne.lng
  ]

  return toString(bboxCoords)
}