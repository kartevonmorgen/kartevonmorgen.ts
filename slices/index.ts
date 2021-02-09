import eventReducer, {actions as eventsActions} from './eventsSlice'
import entriesReducer, {actions as entriesActions} from './entriesSlice'


const reducers = {
  events: eventReducer,
  entries: entriesReducer
}


export const actions = {
  ...eventsActions,
  ...entriesActions
}

export default reducers