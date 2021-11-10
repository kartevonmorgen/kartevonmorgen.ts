import { ParsedUrlQuery } from 'querystring'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import dropRight from 'lodash/dropRight'
import {
  BriefEntityName,
  mapBriefEntityNameToSingular,
  mapTypeIdToBriefEntityName,
  RootSlugEntity,
  SingularEntityName,
  SlugAction,
  SlugVerb,
  validChildrenForEntity,
} from './types'
import { SearchEntryID } from '../dtos/SearchEntry'
import { EventID } from '../dtos/Event'
import { NextRouter } from 'next/router'
import {
  convertBBoxToString,
  convertQueryParamToArray,
  convertQueryParamToString,
  removeRoutingQueryParams,
  updateRoutingQuery,
} from './utils'
import Category from '../dtos/Categories'
import { LatLngBounds } from 'leaflet'
import { TableViewQueryParams } from '../dtos/TableViewQueryParams'
import { EventTimeBoundaries, getEventTimeBoundariesFromQuery } from './router'


export const getProjectNameFromQuery = (query: ParsedUrlQuery): string => {
  const { slug } = query

  return convertQueryParamToString(slug)
}

export const getSingularFormOfEntity = (briefEntityName: BriefEntityName): SingularEntityName => {
  return mapBriefEntityNameToSingular[briefEntityName]
}

// is responsible for creating {action, entity, id} from query: (e.g {'show', 'event', '322'} )
// for more details read slugs.test.ts
export const getRootSlugActionFromQuery = (query: ParsedUrlQuery): SlugAction => {
  const { slug } = query

  const rootAction: SlugAction = {
    verb: SlugVerb.SHOW,
    entity: RootSlugEntity.RESULT,
    id: null,
    subSlugAction: null,
    parentSlugAction: null,
  }

  // todo: needs a double check
  if (isEmpty(slug) || isString(slug)) {
    return rootAction
  }

  const [_project, ...slugs] = slug

  let parentSlugAction = rootAction

  let parentEntityName = 'root'

  for (let i = 0; i < slugs.length;) {
    // i always points to the brief form of the entities: e.g (entries, events, ratings, replies)

    const childSlugAction: SlugAction = {
      verb: SlugVerb.SHOW,
      entity: '',
      id: null,
      subSlugAction: null,
      parentSlugAction: null,
    }

    const childEntityName = slugs[i]
    const briefEntityName = childEntityName as BriefEntityName
    const singularEntityName = getSingularFormOfEntity(briefEntityName)
    childSlugAction.entity = singularEntityName


    const validChildren = validChildrenForEntity[parentEntityName]

    // main/anInvalidEntity
    if (validChildren.indexOf(childEntityName) === -1) {
      break
    }

    // main/entries
    if (i + 1 === slugs.length) {
      // the child entity name is in the brief form, however we use the single form in the ui for readability
      // we have validated before to be a good child before so the type is safe here to be casted
      parentSlugAction.subSlugAction = childSlugAction
      childSlugAction.parentSlugAction = parentSlugAction

      break
    }

    // main/entries/create
    if (slugs[i + 1] === SlugVerb.CREATE) {
      childSlugAction.verb = SlugVerb.CREATE

      parentSlugAction.subSlugAction = childSlugAction
      childSlugAction.parentSlugAction = parentSlugAction

      break
    }

    // main/entries/entryId
    // todo: any kind of validation should go here
    childSlugAction.id = slugs[i + 1]

    if (i + 2 === slugs.length) {
      parentSlugAction.subSlugAction = childSlugAction
      childSlugAction.parentSlugAction = parentSlugAction

      break
    }

    if (slugs[i + 2] === SlugVerb.EDIT) {
      childSlugAction.verb = SlugVerb.EDIT

      parentSlugAction.subSlugAction = childSlugAction
      childSlugAction.parentSlugAction = parentSlugAction

      break
    }


    i += 2

    // think like a linked list
    parentEntityName = singularEntityName
    parentSlugAction.subSlugAction = childSlugAction
    childSlugAction.parentSlugAction = parentSlugAction
    parentSlugAction = childSlugAction
  }

  return rootAction
}


export const redirectToEntityDetailAndFlyToLocation = (
  router: NextRouter,
  id: SearchEntryID | EventID,
  category: Category,
  slugLevelsToIgnore: number = 0,
  paramsToRemove: string[] = [],
) => {
  const { query } = router
  const { slug } = query

  const slugArray = convertQueryParamToArray(slug)
  const skippedSlugArray = dropRight(slugArray, slugLevelsToIgnore)

  let prunedQueryParams: ParsedUrlQuery = removeRoutingQueryParams(
    query,
    paramsToRemove,
  )

  const briefTypeName = mapTypeIdToBriefEntityName[category]

  const updatedQueryParams = updateRoutingQuery(
    prunedQueryParams,
    {
      slug: [...skippedSlugArray, briefTypeName, id],
    },
  )

  router.replace(
    {
      pathname: '/m/[...slug]',
      query: updatedQueryParams,
    },
    undefined,
    { shallow: true },
  )
}

export const createSlugPathFromQueryAndRemoveSlug = (query: ParsedUrlQuery):
  [string, ParsedUrlQuery] => {

  const { slug } = query
  const slugArray = convertQueryParamToArray(slug)

  let slugPath = ''
  if (slugArray.length !== 0) {
    slugPath = slugArray.join('/')
  }

  const queryWithoutSlug = removeRoutingQueryParams(query, ['slug'])


  return [slugPath, queryWithoutSlug]
}

export const convertMapURLTOTableViewURL = (
  mapURL: string,
  mapViewQueryParams: ParsedUrlQuery,
  bbox: LatLngBounds,
): string => {
  const mapViewURL = new URL(mapURL)
  const { pathname: mapViewPathname, origin } = mapViewURL

  const tableViewPathname = mapViewPathname.replace('/m/', '/t/')
  const tableViewQueryParams = convertMapQueryParamsToTableViewQueryParams(mapViewQueryParams, bbox)

  const tableViewURL = new URL(origin)
  tableViewURL.pathname = tableViewPathname
  Object.keys(tableViewQueryParams).forEach(query => {
    tableViewURL.searchParams.append(query, tableViewQueryParams[query])
  })

  return tableViewURL.toString()
}

export const convertMapQueryParamsToTableViewQueryParams = (
  query: ParsedUrlQuery,
  bbox: LatLngBounds,
): TableViewQueryParams => {
  // todo: introduce a type for the map view and the table view query params

  const { search, type } = query
  const eventTimeBoundaries: EventTimeBoundaries = getEventTimeBoundariesFromQuery(query)

  const tableViewQueryParams = {
    text: convertQueryParamToString(search),
    tag: convertQueryParamToString(type),
    bbox: convertBBoxToString(bbox),
    start_min: eventTimeBoundaries.startMin.unix(),
    start_max: eventTimeBoundaries.startMax?.unix(),
    end_min: eventTimeBoundaries.endMin.unix(),
  }

  Object.keys(tableViewQueryParams).forEach(query => {
    if (tableViewQueryParams[query] === undefined) {
      delete tableViewQueryParams[query]
    }
  })

  return tableViewQueryParams
}