import ReviewStatus from './ReviewStatus'
import { BoundingBox } from './BoundingBox'
import { OrgTagFilter } from './OrgTagFilter'
import {IdList} from './IdList'
import { TagList } from './TagList'
import { PaginationLimit } from './PaginationLimit'


export interface SearchEntryRequest {
  bbox: BoundingBox
  org_tag?: OrgTagFilter
  categories?: string
  text?: string
  ids?: IdList
  tags?: TagList
  status?: ReviewStatus
  limit?: PaginationLimit
}