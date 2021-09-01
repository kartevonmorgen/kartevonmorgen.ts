import { NextRouter } from 'next/router'
import { convertQueryParamToString, convertStringToFloat, SEP } from './utils'
import { RouterQueryParam } from './types'
import { LatLng } from './geolocation'


export const isRouterInitialized = (router: NextRouter): boolean => {
  const { query } = router
  const {
    c: center,
    z: zoom,
  } = query
  const initializeIndicators = [center, zoom]

  const areAllIndicatorsInitialized: boolean = initializeIndicators.every((indicator) => indicator !== undefined)

  return areAllIndicatorsInitialized
}

export const convertQueryParamToLatLng = (param: RouterQueryParam): LatLng => {
  const stringifiedParam: string = convertQueryParamToString(param)

  const [lat, lng] = stringifiedParam.split(SEP)
  const parsedLat: number = convertStringToFloat(lat, 4)
  const parsedLng: number = convertStringToFloat(lng, 4)

  return { lat: parsedLat, lng: parsedLng }
}

export const getLatLngFromRouterWithParamName = (router: NextRouter, paramName: string): LatLng => {
  const { query } = router
  const param = query[paramName]

  return convertQueryParamToLatLng(param)
}

export const getCenterLatLngFromRouter = (router: NextRouter): LatLng => {
  const centerLatLng: LatLng = getLatLngFromRouterWithParamName(router, 'c')

  return centerLatLng
}