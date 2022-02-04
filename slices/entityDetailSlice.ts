import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface EntityDetailSlice {
  shouldChangeZoomOnEntrance: boolean
}

const entityDetailSlice = createSlice({
  name: 'entityDetail',
  initialState: {
    shouldChangeZoomOnEntrance: false
  } as EntityDetailSlice,
  reducers: {
    setTrueShouldChangeZoomOnEntrance: (state) => {
      state.shouldChangeZoomOnEntrance = true
    },

    setFalseShouldChangeZoomOnEntrance: (state) => {
      state.shouldChangeZoomOnEntrance = false
    }
  }
})

export const {
  setTrueShouldChangeZoomOnEntrance,
  setFalseShouldChangeZoomOnEntrance
} = entityDetailSlice.actions

export const { actions } = entityDetailSlice

export default entityDetailSlice.reducer