import { RootState } from '../slices'


const entriesSelector = (state: RootState) => (state.entries)

export default entriesSelector