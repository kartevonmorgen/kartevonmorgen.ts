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
  RESULT = 'result',
  EVENT = 'event',
  COMPANY = 'company',
  INITIATIVE = 'initiative',
  ENTRY = 'entry',
  UNKNOWN = 'UNKNOWN'
}

export enum BriefRootSlugEntity {
  EVENTS = 'ev',
  ENTRIES = 'e',
  RESULTS = 're',
  INITIATIVES = 'i',
  COMPANIES = 'c',
  UNKNOWN = 'unknown'
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
  COMMENTS = 'co'
}


export type SingularEntityName = RootSlugEntity | EntrySlugEntity | RatingSlugEntity
export type BriefEntityName = BriefRootSlugEntity | BriefEntrySlugEntity | BriefRatingSlugEntity


export const validChildrenForEntity: Record<string, string[]> = {
  root: Object.values(BriefRootSlugEntity),
  [RootSlugEntity.ENTRY]: Object.values(BriefEntrySlugEntity),
  [RootSlugEntity.INITIATIVE]: Object.values(BriefEntrySlugEntity),
  [RootSlugEntity.COMPANY]: Object.values(BriefEntrySlugEntity),
  [EntrySlugEntity.RATING]: Object.values(BriefRatingSlugEntity),
}

export const RootSlugEntities: BriefRootSlugEntity[] = [
  BriefRootSlugEntity.EVENTS,
  BriefRootSlugEntity.ENTRIES,
  BriefRootSlugEntity.INITIATIVES,
  BriefRootSlugEntity.COMPANIES
]

export type SlugId = EventID | SearchEntryID | null

export interface SlugAction {
  verb: SlugVerb
  entity: string
  id: string | null
  subSlugAction: SlugAction | null
  parentSlugAction: SlugAction | null
}

export interface RootSlugAction extends SlugAction {
  entity: RootSlugEntity
  id: SlugId
}

// todo: if someday we separated the slug of initiative from company, modify here
export const mapTypeIdToBriefEntityName = {
  [Category.INITIATIVE]: BriefRootSlugEntity.ENTRIES,
  [Category.COMPANY]: BriefRootSlugEntity.ENTRIES,
  [Category.EVENT]: BriefRootSlugEntity.EVENTS,
  [Category.UNKNOWN]: BriefRootSlugEntity.UNKNOWN
}

export const mapBriefEntityNameToSingular: Record<BriefEntityName, SingularEntityName> = {
  [BriefRootSlugEntity.RESULTS]: RootSlugEntity.RESULT,
  [BriefRootSlugEntity.EVENTS]: RootSlugEntity.EVENT,
  [BriefRootSlugEntity.ENTRIES]: RootSlugEntity.ENTRY,
  [BriefRootSlugEntity.INITIATIVES]: RootSlugEntity.INITIATIVE,
  [BriefRootSlugEntity.COMPANIES]: RootSlugEntity.COMPANY,
  [BriefEntrySlugEntity.RATINGS]: EntrySlugEntity.RATING,
  [BriefRatingSlugEntity.COMMENTS]: RatingSlugEntity.COMMENT,
  [BriefRootSlugEntity.UNKNOWN]: RootSlugEntity.UNKNOWN,
}

export const mapSingularEntityNameToBrief: Record<SingularEntityName, BriefEntityName> = Object
  .keys(mapBriefEntityNameToSingular)
  .reduce(
    (mappedNames, briefEntityName) => {
      mappedNames[mapBriefEntityNameToSingular[briefEntityName as BriefEntityName] as SingularEntityName] = briefEntityName as BriefEntityName

      return mappedNames
    },
    {} as Record<SingularEntityName, BriefEntityName>,
  )
