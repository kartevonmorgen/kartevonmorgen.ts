import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SearchEntryID } from '../dtos/SearchEntry'
import { EventID } from '../dtos/Event'


export type HighlightID = SearchEntryID | EventID
export type HighlightIDOrNull = HighlightID | null

interface ViewSlice {
  highlight: HighlightIDOrNull
}

const viewSlice = createSlice({
  name: 'view',
  initialState: {} as ViewSlice,
  reducers: {
    setHighlight: (state, action: PayloadAction<HighlightID>) => {
      state.highlight = action.payload
    },

    unsetHighlight: (state) => {
      state.highlight = null
    },
  },
})


export const {
  setHighlight,
  unsetHighlight,
} = viewSlice.actions


export const { actions } = viewSlice

export default viewSlice.reducer