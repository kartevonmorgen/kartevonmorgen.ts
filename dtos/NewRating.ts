import { SearchEntryID } from './SearchEntry'


export interface NewRating {
  entry: SearchEntryID
  title: string
  context: string
  value: number
  comment: string
  source: string
}