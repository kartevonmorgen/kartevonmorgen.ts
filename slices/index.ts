import eventReducer from './eventsSlice'
import entriesReducer from './entriesSlice'


const reducers = {
  events: eventReducer,
  entries: entriesReducer
}


export default reducers