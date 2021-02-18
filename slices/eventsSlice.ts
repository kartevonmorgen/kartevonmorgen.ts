import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Event, { CompactEvent, Events } from '../dtos/Event'
import { SearchEventsRequest as SearchEventsRequestDTO } from '../dtos/SearchEventsRequest'
import { AppThunk } from '../store'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import { RootState } from './index'
import Category from '../dtos/Categories'


const eventsSlice = createSlice({
  name: 'events',
  initialState: [] as Events,
  reducers: {
    setEvents: (state, action: PayloadAction<Events>) => {
      state.splice(0, state.length)
      action.payload.forEach((event: Event) => {state.push(event)})
    },
    emptyEvents: (state, action: PayloadAction) => {
      state.splice(0, state.length)
    }
  }
})


export const {
  setEvents,
  emptyEvents
} = eventsSlice.actions


export const {actions} = eventsSlice

///////////////////////////////
// selectors
export const eventsSelector = (state: RootState) => (state.events)

// creates a view of entries to be shown on the map and the result list
export const compactEventsSelector = createSelector(
  eventsSelector,
  events => events.reduce(
    (compactEvents: CompactEvent[], event: Event) => {
      const compactEvent: CompactEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        lat: event.lat,
        lng: event.lng,
        categories: [Category.EVENT],
        tags: event.tags
      }

      compactEvents.push(compactEvent)

      return compactEvents
    }
  , [] as CompactEvent[])
)

///////////////////////////////
// Thunks
// todo: maybe createAsyncThunk is a better idea

export const fetchEvents = (
  searchEventsRequestDTO: SearchEventsRequestDTO,
): AppThunk => async dispatch => {

  const searchEventsReq = await AxiosInstance.GetRequest<Events>(
    API_ENDPOINTS.searchEvents(),
    {
      params: searchEventsRequestDTO,
    },
  )

  const searchEvents = AxiosInstance.GetSuccessData(searchEventsReq)

  dispatch(setEvents(searchEvents))
}

///////////////////////////////

export default eventsSlice.reducer