import SearchEntry from './SearchEntry'
import { CompactEvent } from './Event'


export type SearchResult = (SearchEntry | CompactEvent)
export type SearchResults = SearchResult[]