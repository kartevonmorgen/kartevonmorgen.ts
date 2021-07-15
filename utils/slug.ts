import { ParsedUrlQuery } from 'querystring'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import dropRight from 'lodash/dropRight'
import {
  mapPluralEntityNameToSingular,
  mapTypeIdToPluralEntityName,
  PluralEntityName,
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
  convertQueryParamToArray,
  convertQueryParamToString,
  removeRoutingQueryParams,
  updateRoutingQuery,
} from './utils'
import Category from '../dtos/Categories'


export const getProjectNameFromQuery = (query: ParsedUrlQuery): string => {
  const { slug } = query

  return convertQueryParamToString(slug)
}

export const getSingularFormOfEntity = (pluralEntityName: PluralEntityName): SingularEntityName => {
  return mapPluralEntityNameToSingular[pluralEntityName]
}

// is responsible for creating {action, entity, id} from query: (e.g {'show', 'event', '322'} )
// for more details read slugs.test.ts
export const getRootSlugActionFromQuery = (query: ParsedUrlQuery): SlugAction => {
  const { slug } = query

  const rootAction: SlugAction = {
    verb: SlugVerb.SHOW,
    entity: RootSlugEntity.RESULT,
    id: null,
    subSlug: null,
  }

  // todo: needs a double check
  if (isEmpty(slug) || isString(slug)) {
    return rootAction
  }

  const [_project, ...slugs] = slug

  let parentSlugAction = rootAction

  let parentEntityName = 'root'

  for (let i = 0; i < slugs.length;) {
    // i always points to the plural form of the entities: e.g (entries, events, ratings, replies)

    const childSlugAction: SlugAction = {
      verb: SlugVerb.SHOW,
      entity: '',
      id: null,
      subSlug: null,
    }

    const childEntityName = slugs[i]
    const pluralEntityName = childEntityName as PluralEntityName
    const singularEntityName = getSingularFormOfEntity(pluralEntityName)
    childSlugAction.entity = singularEntityName


    const validChildren = validChildrenForEntity[parentEntityName]

    // main/anInvalidEntity
    if (validChildren.indexOf(childEntityName) === -1) {
      break
    }

    // main/entries
    if (i + 1 === slugs.length) {
      // the child entity name is in the plural form, however we use the single form in the ui for readability
      // we have validated before to be a good child before so the type is safe here to be casted
      parentSlugAction.subSlug = childSlugAction

      break
    }

    // main/entries/create
    if (slugs[i + 1] === SlugVerb.CREATE) {
      childSlugAction.verb = SlugVerb.CREATE

      parentSlugAction.subSlug = childSlugAction

      break
    }

    // main/entries/entryId
    childSlugAction.id = slugs[i + 1]

    if (i + 2 === slugs.length) {
      parentSlugAction.subSlug = childSlugAction

      break
    }

    if (slugs[i + 2] === SlugVerb.EDIT) {
      childSlugAction.verb = SlugVerb.EDIT

      parentSlugAction.subSlug = childSlugAction

      break
    }


    i += 2

    // think like a linked list
    parentEntityName = singularEntityName
    parentSlugAction.subSlug = childSlugAction
    parentSlugAction = childSlugAction
  }

  return rootAction
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