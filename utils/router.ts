import { NextRouter } from 'next/router'
import {
  convertQueryParamToArray,
  convertQueryParamToInt,
  convertQueryParamToString,
  convertStringToFloat,
  SEP,
} from './utils'
import { RouterQueryParam } from './types'
import { LatLng } from './geolocation'
import { knownCategoryNames } from '../dtos/Categories'
import moment, { Moment } from 'moment'


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

export const getTypeNamesFromRouter = (router: NextRouter): string[] => {
  const { query } = router
  const { type: typeParams } = query

  const typeNames: string[] = convertQueryParamToArray(typeParams)

  return typeNames
}

export const getTypeNamesFromRouterOrKnownCategoryNamesIfEmpty = (router: NextRouter): string[] => {
  const typeNameFromRouter: string[] = getTypeNamesFromRouter(router)
  if (typeNameFromRouter.length === 0) {
    return knownCategoryNames
  }

  return typeNameFromRouter
}

export interface MapTimes {
  startMin?: Moment
  startMax?: Moment
  endMin?: Moment
}

export const getMapTimesFromRouter = (router: NextRouter): MapTimes => {
  const { query } = router
  const {
    start_min: startMinParam,
    start_max: startMaxParam,
    end_min: endMinParam,
  } = query

  const mapTimes: MapTimes = {}

  if (startMinParam) {
    mapTimes.startMin = moment.unix(convertQueryParamToInt(startMinParam))
  }

  if (startMaxParam) {
    mapTimes.startMax = moment.unix(convertQueryParamToInt(startMaxParam))
  }

  mapTimes.endMin = moment().endOf('day')
  if (endMinParam) {
    mapTimes.endMin = moment.unix(convertQueryParamToInt(endMinParam))
  }

  return mapTimes
}