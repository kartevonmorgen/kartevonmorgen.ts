import { RootState } from '../slices'


export const highlightSelector = (state: RootState) => (state.view.highlight)

export const errorMessageSelector = (state: RootState) => (state.view.errorMessage)
