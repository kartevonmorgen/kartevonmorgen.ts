/*
The compact view of an entry as returned in search results.
*/
import ReviewStatus from './ReviewStatus'
import Category from './Categories'
import Tag from './Tag'
import Ratings, { newRatings } from './Ratings'
import { NewEntry } from './NewEntry'


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

export type SearchEntries = SearchEntry[]

export type SearchEntriesCollection = SearchEntry & {
  [index: string]: SearchEntry
}

export const convertNewEntryToSearchEntry = (
  id: SearchEntryID,
  newEntry: NewEntry,
): SearchEntry => {
  return {
    id,
    status: ReviewStatus.created,
    lat: newEntry.lat,
    lng: newEntry.lng,
    title: newEntry.title,
    description: newEntry.description,
    categories: newEntry.categories,
    tags: newEntry.tags,
    ratings: newRatings(),
  }
}

export default SearchEntry