import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Event, { Events } from '../dtos/Event'
import { SearchEventsRequest as SearchEventsRequestDTO } from '../dtos/SearchEventsRequest'
import { AppThunk } from '../store'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'


const eventsSlice = createSlice({
  name: 'events',
  initialState: [] as Events,
  reducers: {
    setEvents: (state, action: PayloadAction<Events>) => {
      state.splice(0, state.length)
      action.payload.forEach((event: Event) => {state.push(event)})
    },
    emptyEvents: (state, _action: PayloadAction) => {
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