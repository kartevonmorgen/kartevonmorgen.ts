import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import SearchEntry, {SearchEntriesIndexer} from '../dtos/SearchEntry'


const entriesSlice = createSlice({
  name: 'entries',
  initialState: {} as SearchEntriesIndexer,
  reducers: {
    setEntries: (state, action: PayloadAction<SearchEntry[]>) => {
      state = action.payload.reduce(
        (searchEntriesIndexer: SearchEntriesIndexer, searchEntry: SearchEntry): SearchEntriesIndexer => {
          searchEntriesIndexer[searchEntry.id] = searchEntry

          return searchEntriesIndexer
        },
        {} as SearchEntriesIndexer
        ) as SearchEntriesIndexer
    }
  }
})


export const {
  setEntries
} = entriesSlice.actions

export const {actions} = entriesSlice

export default entriesSlice.reducer