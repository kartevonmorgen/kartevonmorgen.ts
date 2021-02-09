import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import Event, {EventsIndexer} from '../dtos/Event'


const eventsSlice = createSlice({
  name: 'events',
  initialState: {} as EventsIndexer,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state = action.payload.reduce(
        (eventsIndexer: EventsIndexer, event: Event): EventsIndexer => {
          eventsIndexer[event.id] = event

          return eventsIndexer
        },
        {} as EventsIndexer
      )
    }
  }
})


export const {
  setEvents
} = eventsSlice.actions


export const {actions} = eventsSlice

export default eventsSlice.reducer