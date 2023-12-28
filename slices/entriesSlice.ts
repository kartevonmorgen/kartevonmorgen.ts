import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import SearchEntry, { SearchEntries } from '../dtos/SearchEntry'
import SearchEntriesResponseDTO from '../dtos/SearchEntriesResponse'
import { SearchEntriesRequest as SearchEntriesRequestDTO } from '../dtos/SearchEntriesRequest'
import { BoundingBox } from '../dtos/BoundingBox'
import {SliceActions} from '../store'


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


type ThunkResult<R> = ThunkAction<R, SearchEntries, undefined, SliceActions<typeof entriesSlice.actions>>


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
): ThunkResult<Promise<void>> => async (dispatch) => {

  const searchEntriesReq = await AxiosInstance.GetRequest<SearchEntriesResponseDTO>(
    API_ENDPOINTS.searchEntries(),
    {
      params: searchEntriesRequestDTO,
    },
  )

  const searchEntries = AxiosInstance.GetSuccessData(searchEntriesReq)

  dispatch(setEntries(searchEntries.visible))
}


export const fetchAllEntries = (bbox: BoundingBox): ThunkResult<Promise<void>> => async (dispatch) => {

  const searchEntriesRequestDTO: SearchEntriesRequestDTO = {
    bbox,
  }

  dispatch(fetchEntries(searchEntriesRequestDTO))
}

///////////////////////////////

export default entriesSlice.reducer
