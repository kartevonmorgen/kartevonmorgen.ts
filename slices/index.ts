import { combineReducers } from '@reduxjs/toolkit'

import eventReducer, { actions as eventsActions } from './eventsSlice'
import entriesReducer, { actions as entriesActions } from './entriesSlice'
import viewReducer, { actions as viewActions } from './viewSlice'

export { actions as eventsActions } from './eventsSlice'
export { actions as entriesActions } from './entriesSlice'
export { actions as viewActions } from './viewSlice'


const rootReducer = combineReducers({
  events: eventReducer,
  entries: entriesReducer,
  view: viewReducer,
})


export const actions = {
  ...eventsActions,
  ...entriesActions,
  ...viewActions,
}

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer