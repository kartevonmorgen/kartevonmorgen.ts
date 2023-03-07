import { createSlice } from '@reduxjs/toolkit'


interface EntityDetailSlice {
  shouldChangeZoomAndCenterOnEntrance: boolean
}

const entityDetailSlice = createSlice({
  name: 'entityDetail',
  initialState: {
    shouldChangeZoomAndCenterOnEntrance: false
  } as EntityDetailSlice,
  reducers: {
    setTrueShouldChangeZoomOnEntrance: (state) => {
      state.shouldChangeZoomAndCenterOnEntrance = true
    },

    setFalseShouldChangeZoomOnEntrance: (state) => {
      state.shouldChangeZoomAndCenterOnEntrance = false
    }
  }
})

export const {
  setTrueShouldChangeZoomOnEntrance,
  setFalseShouldChangeZoomOnEntrance
} = entityDetailSlice.actions

export const { actions } = entityDetailSlice

export default entityDetailSlice.reducer
