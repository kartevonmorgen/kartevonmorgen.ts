import { combineReducers } from '@reduxjs/toolkit'

import eventReducer, { actions as eventsActions } from './eventsSlice'
import entriesReducer, { actions as entriesActions } from './entriesSlice'


const rootReducer = combineReducers({
  events: eventReducer,
  entries: entriesReducer,
})

export const actions = {
  ...eventsActions,
  ...entriesActions,
}

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer