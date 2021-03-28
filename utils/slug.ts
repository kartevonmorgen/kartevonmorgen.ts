import { ParsedUrlQuery } from 'querystring'
import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import {
  mapPluralEntityNameToSingular,
  PluralSlugEntity,
  SlugAction,
  SlugEntities,
  SlugEntity,
  SlugId,
  SlugVerb,
} from './types'


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