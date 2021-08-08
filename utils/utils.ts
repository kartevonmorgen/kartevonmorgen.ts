import produce from 'immer'
import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'
import toString from 'lodash/toString'
import { ParsedUrlQuery } from 'querystring'
import { LatLngBounds } from 'leaflet'
import { RouterQueryParam } from './types'


export const convertStringToBoolean = (str: string): boolean => {
  return str === 'true'
}

export const convertUnknownToBoolean = (value: unknown): boolean => {
  return value === 'true'
}

export const convertUnknownToInt = (value: unknown): number => {
  return convertStringToInt(toString(value))
}

export const convertQueryParamToBoolean = (param: RouterQueryParam): boolean => {
  return convertStringToBoolean(
    convertQueryParamToString(param),
  )
}

export const convertQueryParamToString = (
  stringOrArrayOfStrings: RouterQueryParam,
  defaultValue: string = '',
): string => {
  if (isEmpty(stringOrArrayOfStrings)) {
    return defaultValue
  }

  if (isString(stringOrArrayOfStrings)) {
    return stringOrArrayOfStrings
  }

  return stringOrArrayOfStrings[0]
}

export const convertStringToFloat = (str: string, digits: number | null = null): number => {
  // todo: it's not the best function ever
  const result = parseFloat(str)
  if (isNaN(result)) {
    return 0.0
  }

  if (digits !== null) {
    return parseFloat(result.toFixed(digits))
  }

  return result
}

export const convertStringToInt = (str: string): number => {
  const result = parseInt(str)
  if (isNaN(result)) {
    return 0
  }

  return result
}

export const convertQueryParamToFloat = (param: RouterQueryParam): number => (
  convertStringToFloat(
    convertQueryParamToString(param),
  )
)

export const convertQueryParamToInt = (param: RouterQueryParam): number => (
  convertStringToInt(
    convertQueryParamToString(param),
  )
)

export const removeRoutingQueryParams = (query: ParsedUrlQuery, paramsToRemove: string[]): ParsedUrlQuery => {
  return produce(query, draftState => {
    paramsToRemove.forEach(paramsToRemove => {
      delete draftState[paramsToRemove]
    })
  })
}

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
  const sw = bbox.getSouthWest()
  const ne = bbox.getNorthEast()

  const bboxCoords = [
    sw.lat,
    sw.lng,
    ne.lat,
    ne.lng,
  ]

  return toString(bboxCoords)
}

export const convertQueryParamToArray = (param: RouterQueryParam): string[] => {
  if (isEmpty(param)) {
    return []
  }

  if (isString(param)) {
    return [param]
  }

  return param
}

interface cropTextLimit {
  sentenceLimit?: number
  wordLimit?: number
  charLimit?: number
}

export const cropText = (
  text: string,
  { sentenceLimit, wordLimit, charLimit }: cropTextLimit,
): string => {

  if (isEmpty(text) || !isString(text)) {
    return ''
  }

  if (sentenceLimit) {
    // https://stackoverflow.com/a/21034081/3744479
    const sentences = text.match(/\(?[^\.\?\!]+[\.!\?]\)?/g)
    if (sentences) {
      const selectedSentences = sentences.slice(0, sentenceLimit)

      text = selectedSentences.join('')
    }
  }

  if (wordLimit) {
    const words = text.split(' ').slice(0, wordLimit)
    text = words.join(' ')
  }

  if (charLimit) {
    text = text.substr(0, charLimit)
  }

  return text
}


export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
