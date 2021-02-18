import {createSelector} from '@reduxjs/toolkit'
import entriesSelector from './entries'
import { compactEventsSelector } from './events'
import { CompactEvents } from '../dtos/Event'
import { SearchEntries } from '../dtos/SearchEntry'


const searchResultSelector = createSelector(
  entriesSelector,
  compactEventsSelector,
  (entries: SearchEntries, events: CompactEvents) => ([...entries, ...events]))


export default searchResultSelector