import { ParsedUrlQuery } from 'querystring'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import dropRight from 'lodash/dropRight'
import {
  mapPluralEntityNameToSingular,
  mapTypeIdToPluralEntityName,
  PluralSlugEntity,
  SlugAction,
  SlugEntities,
  SlugEntity,
  SlugId,
  SlugVerb,
} from './types'
import { SearchEntryID } from '../dtos/SearchEntry'
import { EventID } from '../dtos/Event'
import { NextRouter } from 'next/router'
import { convertQueryParamToArray, removeRoutingQueryParams, updateRoutingQuery } from './utils'
import Category from '../dtos/Categories'


// is responsible for creating {action, entity, id} from query: (e.g {'show', 'event', '322'} )
export const getSlugActionFromQuery = (query: ParsedUrlQuery): SlugAction => {
  const { slug } = query

  const defaultAction: SlugAction = {
    verb: SlugVerb.SHOW,
    entity: SlugEntity.RESULT,
    id: null,
  }

  if (isEmpty(slug) || isString(slug)) {
    return defaultAction
  }

  const [_project, pluralEntityName, entityIdOrVerb, optionalVerb] = slug

  // check entity is valid
  if (!SlugEntities.includes(pluralEntityName as PluralSlugEntity)) {
    return defaultAction
  }

  // create verb does not contain entity id, so the length would be 3: [project, entityName, verb]
  if (slug.length === 3 && entityIdOrVerb === SlugVerb.CREATE) {
    const verb = SlugVerb.CREATE

    return {
      verb,
      entity: mapPluralEntityNameToSingular[pluralEntityName] as SlugEntity,
      id: null,
    }
  }

  let verb = SlugVerb.SHOW
  const entityId = entityIdOrVerb
  if (!!optionalVerb && Object.values(SlugVerb).includes(optionalVerb as SlugVerb)) {
    verb = optionalVerb as SlugVerb
  }

  return {
    verb: verb as SlugVerb,
    entity: mapPluralEntityNameToSingular[pluralEntityName] as SlugEntity,
    id: entityId as SlugId,
  }
}


export const redirectToEntityDetail = (
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

  const pluralTypeName = mapTypeIdToPluralEntityName[category]

  const updatedQueryParams = updateRoutingQuery(
    prunedQueryParams,
    {
      slug: [...skippedSlugArray, pluralTypeName, id],
    },
  )

  router.replace(
    {
      pathname: '/maps/[...slug]',
      query: updatedQueryParams,
    },
    undefined,
    { shallow: true },
  )
}