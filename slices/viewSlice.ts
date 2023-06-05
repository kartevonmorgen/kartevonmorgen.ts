import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SearchEntryID } from '../dtos/SearchEntry'
import { EventID } from '../dtos/Event'


export type HighlightID = SearchEntryID | EventID
export type HighlightIDOrNull = HighlightID | null

interface ViewSlice {
  highlight: HighlightIDOrNull,
  errorMessage: string | null,
}

const viewSlice = createSlice({
  name: 'view',
  initialState: {
    highlight: null,
    errorMessage: null,
  } as ViewSlice,
  reducers: {
    setHighlight: (state, action: PayloadAction<HighlightID>) => {
      state.highlight = action.payload
    },

    unsetHighlight: (state) => {
      state.highlight = null
    },

    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload
    }
  },
})


export const {
  setHighlight,
  unsetHighlight,
  setErrorMessage
} = viewSlice.actions


export const { actions } = viewSlice

export default viewSlice.reducer
