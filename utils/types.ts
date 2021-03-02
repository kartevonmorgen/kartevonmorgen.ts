import { EventID } from '../dtos/Event'
import { SearchEntryID } from '../dtos/SearchEntry'
import Category from '../dtos/Categories'

// todo: check if there's already a type from next/router
export type RouterQueryParam = string | string[] | undefined


export enum SlugVerb {
  SHOW = 'show',
  CREATE = 'create',
  EDIT = 'edit',
}

export enum SlugEntity {
  EVENT = 'event',
  ENTRY = 'entry',
  RESULT = 'result',
}

export enum PluralSlugEntity {
  EVENTS = 'events',
  ENTRIES = 'entries',
  RESULTS = 'results',
}

export const SlugEntities: PluralSlugEntity[] = [
  PluralSlugEntity.EVENTS,
  PluralSlugEntity.ENTRIES,
]
export type SlugId = EventID | SearchEntryID | null

export interface SlugAction {
  verb: SlugVerb
  entity: SlugEntity
  id: SlugId
}

export const mapTypeIdToPluralEntityName = {
  [Category.INITIATIVE]: PluralSlugEntity.ENTRIES,
  [Category.COMPANY]: PluralSlugEntity.ENTRIES,
  [Category.EVENT]: PluralSlugEntity.EVENTS,
}

export const mapPluralEntityNameToSingular = {
  [PluralSlugEntity.EVENTS]: SlugEntity.EVENT,
  [PluralSlugEntity.ENTRIES]: SlugEntity.ENTRY,
  [PluralSlugEntity.RESULTS]: SlugEntity.RESULT,
}

export const mapSingularEntityNameToPlural = Object
  .keys(mapPluralEntityNameToSingular)
  .reduce(
    (mappedNames, pluralEntityName) => {
      mappedNames[mapPluralEntityNameToSingular[pluralEntityName]] = pluralEntityName

      return mappedNames
    },
    {},
  )
