import { NextRouter } from 'next/router'
import {
  convertArrayToQueryParam,
  convertQueryParamToArray,
  convertQueryParamToInt,
  convertQueryParamToString,
  convertStringToFloat,
  removeRoutingQueryParams,
  SEP,
  updateRoutingQuery,
} from './utils'
import { RouterQueryParam } from './types'
import { LatLng } from './geolocation'
import { knownCategoryNames } from '../dtos/Categories'
import moment, { Moment } from 'moment'
import { ParsedUrlQuery } from 'querystring'
import { createSlugPathFromQueryAndRemoveSlug } from './slug'
import { produce } from 'immer'
import Tag from '../dtos/Tag'


const ExtraSearchParams = [
  'tag',
  'type',
  'end_min',
  'start_max'
]

export const isExtraSearchFiltersActivated = (router: NextRouter): boolean => {
  const {query} = router

  const isAnyFilterActivated = ExtraSearchParams.some(param => convertQueryParamToString(query[param]))

  return isAnyFilterActivated
}

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

export const isLatLngValid = (latLng: LatLng): boolean => {
  const isValid = !!latLng.lat && !!latLng.lng

  return isValid
}

export const getCenterLatLngFromRouter = (router: NextRouter): LatLng => {
  const centerLatLng: LatLng = getLatLngFromRouterWithParamName(router, 'c')

  return centerLatLng
}


export const getTypeNamesFromRouter = (router: NextRouter): string[] => {
  // type refers to the `type` from query params
  const { query } = router
  const { type: typeParams } = query

  const typeNames: string[] = convertQueryParamToArray(typeParams)

  return typeNames
}

export const getTypeNamesFromRouterOrKnownCategoryNamesIfEmpty = (router: NextRouter): string[] => {
  // type refers to the `type` from query params

  const typeNameFromRouter: string[] = getTypeNamesFromRouter(router)
  if (typeNameFromRouter.length === 0) {
    return knownCategoryNames
  }

  return typeNameFromRouter
}

export type TypeChooserVisibility = 'show' | 'hide' | 'no'

export const getTypeChooserVisibilityFromRouter = (router: NextRouter): TypeChooserVisibility => {
  const { query } = router
  const { typechooser: typeChooserParam } = query

  const typeChooserValue = convertQueryParamToString(typeChooserParam, 'show')

  // Validate the value and return 'show' as default if invalid
  if (typeChooserValue === 'hide' || typeChooserValue === 'no') {
    return typeChooserValue
  }

  return 'show'
}

export type BoxesVisibility = 'show' | 'search' | 'mapping' | 'hide'

export const getBoxesVisibilityFromRouter = (router: NextRouter): BoxesVisibility => {
  const { query } = router
  const { boxes: boxesParam } = query

  const boxesValue = convertQueryParamToString(boxesParam, 'show')

  // Validate the value and return 'show' as default if invalid
  if (boxesValue === 'search' || boxesValue === 'mapping' || boxesValue === 'hide') {
    return boxesValue
  }

  return 'show'
}

export const shouldShowBoxesOnSearchPage = (router: NextRouter): boolean => {
  const boxesVisibility = getBoxesVisibilityFromRouter(router)
  
  // Show on search page when: 'show' or 'search'
  // Hide when: 'hide' or 'mapping'
  return boxesVisibility === 'show' || boxesVisibility === 'search'
}

export const shouldShowBoxesOnMappingPage = (router: NextRouter): boolean => {
  const boxesVisibility = getBoxesVisibilityFromRouter(router)
  
  // Show on mapping (entity form) page when: 'show' or 'mapping'
  // Hide when: 'hide' or 'search'
  return boxesVisibility === 'show' || boxesVisibility === 'mapping'
}

export interface EventTimeBoundaries {
  startMin?: Moment
  startMax?: Moment
  endMin?: Moment
}

export const getEventTimeBoundariesFromQueryOrDefaults = (query: ParsedUrlQuery): EventTimeBoundaries => {
  const {
    start_min: startMinParam,
    start_max: startMaxParam,
    end_min: endMinParam,
  } = query

  const eventTimeBoundaries: EventTimeBoundaries = {}

  if (startMinParam) {
    eventTimeBoundaries.startMin = moment.unix(convertQueryParamToInt(startMinParam))
  }

  if (startMaxParam) {
    eventTimeBoundaries.startMax = moment.unix(convertQueryParamToInt(startMaxParam))
  }

  eventTimeBoundaries.endMin = moment().startOf('day')
  if (endMinParam) {
    eventTimeBoundaries.endMin = moment.unix(convertQueryParamToInt(endMinParam))
  }

  return eventTimeBoundaries
}

export const getEventTimeBoundariesFromRouter = (router: NextRouter): EventTimeBoundaries => {
  const { query } = router

  const eventTimeBoundaries: EventTimeBoundaries = getEventTimeBoundariesFromQueryOrDefaults(query)

  return eventTimeBoundaries
}

export const deleteSlugLevelsFromRouter = (numberOfLevels: number, router: NextRouter): ParsedUrlQuery => {
  const { query } = router
  const newQueryParams = produce(query, (draftState) => {
    const { slug } = draftState
    const slugArray = convertQueryParamToArray(slug)

    slugArray.splice(slugArray.length - numberOfLevels, numberOfLevels)
    draftState.slug = slugArray
  })

  return newQueryParams
}

export const addTagToRouter = (router: NextRouter) => (tag: string) => {
  const { query } = router
  const { tag: optionalTagsFromQuery } = query
  const optionalTags = convertQueryParamToArray(optionalTagsFromQuery)

  const newTags = !optionalTags.includes(tag) ? [...optionalTags, tag] : optionalTags

  const newQueryParams = updateRoutingQuery(query, { tag: convertArrayToQueryParam(newTags) })
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}

export const removeAllTagsFromRouter = (router: NextRouter) => () => {
  const { query } = router
  const newQueryParams = removeRoutingQueryParams(query, ['tag'])
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}

export const removeTagFromRouter = (router: NextRouter) => (tagToRemove: string) => {
  const { query } = router
  const { tag: optionalTagsFromQuery } = query
  const optionalTags = convertQueryParamToArray(optionalTagsFromQuery)

  const newTagsParameter = produce(optionalTags, (draft) => {
    const indexOfTagToRemove = draft.indexOf(tagToRemove)
    if (indexOfTagToRemove !== -1) {
      draft.splice(indexOfTagToRemove, 1)
    }
  })

  let newQueryParams = {}
  if (newTagsParameter.length !== 0) {
    newQueryParams = updateRoutingQuery(query, { tag: convertArrayToQueryParam(newTagsParameter) })
  } else {
    newQueryParams = removeRoutingQueryParams(query, ['tag'])
  }
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}

export const setTagToRouterAndRedirectToMap = (tag: Tag, router: NextRouter) => {

  let newQueryParams = deleteSlugLevelsFromRouter(2, router)
  newQueryParams = updateRoutingQuery(newQueryParams, { tag })
  const [newPath, newQueryWithoutSlug] = createSlugPathFromQueryAndRemoveSlug(newQueryParams)

  router.replace(
    {
      pathname: `/m/${newPath}`,
      query: newQueryWithoutSlug,
    },
    undefined,
    { shallow: true },
  )
}
