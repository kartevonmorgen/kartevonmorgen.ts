import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {ThunkAction} from 'redux-thunk'
import Event, { Events } from '../dtos/Event'
import { SearchEventsRequest as SearchEventsRequestDTO } from '../dtos/SearchEventsRequest'
import { SliceActions} from '../store'
import { AxiosInstance } from '../api'
import API_ENDPOINTS from '../api/endpoints'
import { BoundingBox } from '../dtos/BoundingBox'


const eventsSlice = createSlice({
  name: 'events',
  initialState: [] as Events,
  reducers: {
    setEvents: (state, action: PayloadAction<Events>) => {
      state.splice(0, state.length)
      action.payload.forEach((event: Event) => {
        state.push(event)
      })
    },
    emptyEvents: (state, _action: PayloadAction) => {
      state.splice(0, state.length)
    },

    prependEvent: (state, action: PayloadAction<Event>) => {
      state.splice(0, 0, action.payload)
    },

  },
})

type ThunkResult<R> = ThunkAction<R, Events, undefined, SliceActions<typeof eventsSlice.actions>>


export const {
  setEvents,
  emptyEvents,
  prependEvent,
} = eventsSlice.actions


export const { actions } = eventsSlice

///////////////////////////////
// Thunks
// todo: maybe createAsyncThunk is a better idea

export const fetchEvents = (
  searchEventsRequestDTO: SearchEventsRequestDTO,
): ThunkResult<Promise<void>> => async (dispatch) => {

  const searchEventsReq = await AxiosInstance.GetRequest<Events>(
    API_ENDPOINTS.searchEvents(),
    {
      params: searchEventsRequestDTO,
    },
  )

  const searchEvents = AxiosInstance.GetSuccessData(searchEventsReq)

  dispatch(setEvents(searchEvents))
}

export const fetchAllEvents = (bbox: BoundingBox): ThunkResult<Promise<void>> => async (dispatch) => {

  const searchEventsRequestDTO: SearchEventsRequestDTO = {
    bbox: bbox,
  }


  dispatch(fetchEvents(searchEventsRequestDTO))
}

///////////////////////////////

export default eventsSlice.reducer
