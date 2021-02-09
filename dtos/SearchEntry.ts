/*
The compact view of an entry as returned in search results.
*/
import ReviewStatus from './ReviewStatus'
import Category from './Categories'
import Tag from './Tag'
import Ratings from './Ratings'


export type SearchEntryID = string

interface SearchEntry {
  id: SearchEntryID
  status: ReviewStatus
  lat: number
  lng: number
  title: string
  description: string
  categories: Category[]
  tags: Tag[]
  ratings: Ratings
}

export type SearchEntriesIndexer = SearchEntry & {
  [index: string]: SearchEntryID
}

export default SearchEntry