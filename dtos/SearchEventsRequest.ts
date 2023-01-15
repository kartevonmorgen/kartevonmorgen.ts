import { BoundingBox } from './BoundingBox'
import { PaginationLimit } from './PaginationLimit'
import { TagList } from './TagList'


// todo: check created by is an email or not
export interface SearchEventsRequest {
  bbox: BoundingBox
  limit?: PaginationLimit
  tag?: TagList
  start_min?: number
  start_max?: number
  end_min?: number
  text?: string
  created_by?: string
}