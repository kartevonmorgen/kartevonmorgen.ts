import { ParsedUrlQuery } from 'querystring'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import isArray from 'lodash/isArray'

import { SlugAction, SlugEntities, SlugEntity, SlugId, SlugVerb } from './type'


// is responsible for creating {action, entity, id} from query: (e.g {'show', 'event', '322'} )
export const getSlugActionFromQuery = (query: ParsedUrlQuery): SlugAction => {
  const {slug} = query

  const defaultAction: SlugAction = {
    verb: SlugVerb.SHOW,
    entity: SlugEntity.RESULTS,
    id: null
  }

  if (
    isEmpty(slug) ||
    isString(slug) ||
    (isArray(slug) && slug.length < 4)
  ) {
    return defaultAction
  }

  const [_project, entity, entityId, verb] = slug
  if (!SlugEntities.includes(entity)) {
    return defaultAction
  }

  return {
    verb: verb as SlugVerb,
    entity: entity as SlugEntity,
    id: entityId as SlugId
  }
}