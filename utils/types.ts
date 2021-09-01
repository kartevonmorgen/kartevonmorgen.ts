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

export enum BriefRootSlugEntity {
  EVENTS = 'ev',
  ENTRIES = 'e',
  RESULTS = 're',
}

export enum EntrySlugEntity {
  RATING = 'rating'
}

export enum BriefEntrySlugEntity {
  RATINGS = 'r'
}

export enum RatingSlugEntity {
  COMMENT = 'comment'
}

export enum BriefRatingSlugEntity {
  COMMENTS = 'c'
}


export type SingularEntityName = RootSlugEntity | EntrySlugEntity | RatingSlugEntity
export type BriefEntityName = BriefRootSlugEntity | BriefEntrySlugEntity | BriefRatingSlugEntity


export const validChildrenForEntity: Record<string, string[]> = {
  root: Object.values(BriefRootSlugEntity),
  [RootSlugEntity.ENTRY]: Object.values(BriefEntrySlugEntity),
  [EntrySlugEntity.RATING]: Object.values(BriefRatingSlugEntity),
}

export const RootSlugEntities: BriefRootSlugEntity[] = [
  BriefRootSlugEntity.EVENTS,
  BriefRootSlugEntity.ENTRIES,
]

export type SlugId = EventID | SearchEntryID | null

export interface SlugAction {
  verb: SlugVerb
  entity: string
  id: string
  subSlugAction: SlugAction
  parentSlugAction: SlugAction
}

export interface RootSlugAction extends SlugAction {
  entity: RootSlugEntity
  id: SlugId
}

export const mapTypeIdToBriefEntityName = {
  [Category.INITIATIVE]: BriefRootSlugEntity.ENTRIES,
  [Category.COMPANY]: BriefRootSlugEntity.ENTRIES,
  [Category.EVENT]: BriefRootSlugEntity.EVENTS,
}

export const mapBriefEntityNameToSingular: Record<BriefEntityName, SingularEntityName> = {
  [BriefRootSlugEntity.EVENTS]: RootSlugEntity.EVENT,
  [BriefRootSlugEntity.ENTRIES]: RootSlugEntity.ENTRY,
  [BriefRootSlugEntity.RESULTS]: RootSlugEntity.RESULT,
  [BriefEntrySlugEntity.RATINGS]: EntrySlugEntity.RATING,
  [BriefRatingSlugEntity.COMMENTS]: RatingSlugEntity.COMMENT,
}

export const mapSingularEntityNameToBrief = Object
  .keys(mapBriefEntityNameToSingular)
  .reduce(
    (mappedNames, briefEntityName) => {
      mappedNames[mapBriefEntityNameToSingular[briefEntityName]] = briefEntityName

      return mappedNames
    },
    {},
  )
