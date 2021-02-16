import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import Event, {EventsCollection} from '../dtos/Event'


const eventsSlice = createSlice({
  name: 'events',
  initialState: {} as EventsCollection,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state = action.payload.reduce(
        (eventsIndexer: EventsCollection, event: Event): EventsCollection => {
          eventsIndexer[event.id] = event

          return eventsIndexer
        },
        {} as EventsCollection
      )
    }
  }
})


export const {
  setEvents
} = eventsSlice.actions


export const {actions} = eventsSlice

export default eventsSlice.reducer