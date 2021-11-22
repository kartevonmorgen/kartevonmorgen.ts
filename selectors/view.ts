import { RootState } from '../slices'


export const highlightSelector = (state: RootState) => (state.view.highlight)