import { ParsedUrlQuery } from 'querystring'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'

import {
  mapPluralEntityNameToSingular,
  PluralSlugEntity,
  SingularSlugEntity,
  SlugAction,
  SlugEntities,
  SlugId,
  SlugVerb,
} from './types'


// is responsible for creating {action, entity, id} from query: (e.g {'show', 'event', '322'} )
export const getSlugActionFromQuery = (query: ParsedUrlQuery): SlugAction => {
  const { slug } = query

  const defaultAction: SlugAction = {
    verb: SlugVerb.SHOW,
    entity: SingularSlugEntity.RESULT,
    id: null,
  }

  if (
    isEmpty(slug) ||
    isString(slug) ||
    (isArray(slug) && slug.length < 3)
  ) {
    return defaultAction
  }

  const [_project, pluralEntityName, entityId, verbFromSlug] = slug

  let verb = SlugVerb.SHOW
  if (!!verbFromSlug && Object.values(SlugVerb).includes(verbFromSlug as SlugVerb)) {
    verb = verbFromSlug as SlugVerb
  }

  if (!SlugEntities.includes(pluralEntityName as PluralSlugEntity)) {
    return defaultAction
  }

  return {
    verb: verb as SlugVerb,
    entity: mapPluralEntityNameToSingular[pluralEntityName] as SingularSlugEntity,
    id: entityId as SlugId,
  }
}