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

export enum RootSlugEntity {
  EVENT = 'event',
  ENTRY = 'entry',
  RESULT = 'result',
}

export enum PluralRootSlugEntity {
  EVENTS = 'events',
  ENTRIES = 'entries',
  RESULTS = 'results',
}

export enum EntrySlugEntity {
  RATING = 'rating'
}

export enum PluralEntrySlugEntity {
  RATINGS = 'ratings'
}

export enum RatingSlugEntity {
  REPLY = 'reply'
}

export enum PluralRatingSlugEntity {
  REPLIES = 'replies'
}


export type SingularEntityName = RootSlugEntity | EntrySlugEntity | RatingSlugEntity
export type PluralEntityName = PluralRootSlugEntity | PluralEntrySlugEntity | PluralRatingSlugEntity


export const validChildrenForEntity: Record<string, string[]> = {
  root: Object.values(PluralRootSlugEntity),
  [RootSlugEntity.ENTRY]: Object.values(PluralEntrySlugEntity),
  [EntrySlugEntity.RATING]: Object.values(PluralRatingSlugEntity),
}

export const RootSlugEntities: PluralRootSlugEntity[] = [
  PluralRootSlugEntity.EVENTS,
  PluralRootSlugEntity.ENTRIES,
]

export type SlugId = EventID | SearchEntryID | null

export interface SlugAction {
  verb: SlugVerb
  entity: string
  id: string
  subSlug: SlugAction
}

export interface RootSlugAction extends SlugAction {
  entity: RootSlugEntity
  id: SlugId
}

export const mapTypeIdToPluralEntityName = {
  [Category.INITIATIVE]: PluralRootSlugEntity.ENTRIES,
  [Category.COMPANY]: PluralRootSlugEntity.ENTRIES,
  [Category.EVENT]: PluralRootSlugEntity.EVENTS,
}

export const mapPluralEntityNameToSingular: Record<PluralEntityName, SingularEntityName> = {
  [PluralRootSlugEntity.EVENTS]: RootSlugEntity.EVENT,
  [PluralRootSlugEntity.ENTRIES]: RootSlugEntity.ENTRY,
  [PluralRootSlugEntity.RESULTS]: RootSlugEntity.RESULT,
  [PluralEntrySlugEntity.RATINGS]: EntrySlugEntity.RATING,
  [PluralRatingSlugEntity.REPLIES]: RatingSlugEntity.REPLY,
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
