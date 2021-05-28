import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppThunk } from '../store'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import SearchEntry, { SearchEntries } from '../dtos/SearchEntry'
import SearchEntriesResponseDTO from '../dtos/SearchEntriesResponse'
import { SearchEntriesRequest as SearchEntriesRequestDTO } from '../dtos/SearchEntriesRequest'


const entriesSlice = createSlice({
  name: 'entries',
  initialState: [] as SearchEntries,
  reducers: {
    setEntries: (state, action: PayloadAction<SearchEntries>) => {
      // clear the store
      state.splice(0, state.length)
      action.payload.forEach((searchEntry: SearchEntry) => {
        state.push(searchEntry)
      })
    },

    emptyEntries: (state, _action: PayloadAction) => {
      state.splice(0, state.length)
    },

    prependEntry: (state, action: PayloadAction<SearchEntry>) => {
      state.splice(0, 0, action.payload)
    },

  },
})


export const {
  setEntries,
  emptyEntries,
  prependEntry,
} = entriesSlice.actions

export const { actions } = entriesSlice


///////////////////////////////
// Thunks
// todo: maybe createAsyncThunk is a better idea

export const fetchEntries = (
  searchEntriesRequestDTO: SearchEntriesRequestDTO,
): AppThunk => async dispatch => {

  const searchEntriesReq = await AxiosInstance.GetRequest<SearchEntriesResponseDTO>(
    API_ENDPOINTS.searchEntries(),
    {
      params: searchEntriesRequestDTO,
    },
  )

  const searchEntries = AxiosInstance.GetSuccessData(searchEntriesReq)

  dispatch(setEntries(searchEntries.visible))
}

///////////////////////////////

export default entriesSlice.reducer