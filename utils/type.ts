import { EventID } from '../dtos/Event'
import { SearchEntryID } from '../dtos/SearchEntry'

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
  RESULTS = 'results',
}

export const SlugEntities: string[] = ['events', 'entries']
export type SlugId = EventID | SearchEntryID | null

export interface SlugAction {
  verb: SlugVerb
  entity: SlugEntity
  id: SlugId
}
