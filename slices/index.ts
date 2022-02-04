import { combineReducers } from '@reduxjs/toolkit'

import eventReducer, { actions as eventsActions } from './eventsSlice'
import entriesReducer, { actions as entriesActions } from './entriesSlice'
import viewReducer, { actions as viewActions } from './viewSlice'
import entityDetailReducer, { actions as entityDetailActions } from './entityDetailSlice'

export { actions as eventsActions } from './eventsSlice'
export { actions as entriesActions } from './entriesSlice'
export { actions as viewActions } from './viewSlice'
export { actions as entityDetailActions } from './entityDetailSlice'


const rootReducer = combineReducers({
  events: eventReducer,
  entries: entriesReducer,
  view: viewReducer,
  entityDetail: entityDetailReducer
})


export const actions = {
  ...eventsActions,
  ...entriesActions,
  ...viewActions,
  ...entityDetailActions,
}

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer