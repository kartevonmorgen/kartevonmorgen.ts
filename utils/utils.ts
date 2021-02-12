import produce from "immer"
import isString from 'lodash/isString'
import {ParsedUrlQuery} from 'querystring'


export const convertQueryParamToString = (stringOrArrayOfStrings: string | string[]): string => {
  if (isString(stringOrArrayOfStrings)) {
    return stringOrArrayOfStrings
  }

  if (stringOrArrayOfStrings.length === 0) {
    return ''
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

export const updateRoutingParams = (query: ParsedUrlQuery, newParams: ParsedUrlQuery): ParsedUrlQuery => {
  return produce(query, draftState => {
    Object.keys(newParams).forEach(param => {draftState[param] = newParams[param]})
  })
}

export const removeDynamicRoutingParams = (query: ParsedUrlQuery, dynamicParams: string[]): ParsedUrlQuery => {
  return produce(query, draftState => dynamicParams.forEach(param => {delete draftState[param]}))

}