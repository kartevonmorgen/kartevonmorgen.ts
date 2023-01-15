import { createSelector } from '@reduxjs/toolkit'
import entriesSelector from './entries'
import { compactEventsSelector } from './events'
import { CompactEvents } from '../dtos/Event'
import { SearchEntries } from '../dtos/SearchEntry'


const searchResultSelector = createSelector(
  entriesSelector,
  compactEventsSelector,
  (entries: SearchEntries, events: CompactEvents) => (
    [...entries, ...events]
  ),
)

// https://github.com/kartevonmorgen/kartevonmorgen/issues/820
// WARNING: the assumption is openfairDB returns sorted entities
export const sortedSearchResultSelector = createSelector(
  entriesSelector,
  compactEventsSelector,
  (entries: SearchEntries, events: CompactEvents) => {
    const indexOfFirstBadRankedEntry = entries.findIndex(entry => entry.ratings.total <= 0)

    return [
      ...entries.slice(0, indexOfFirstBadRankedEntry),
      ...events,
      ...entries.slice(indexOfFirstBadRankedEntry, entries.length),
    ]
  },
)


export default searchResultSelector