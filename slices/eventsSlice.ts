import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {EventsIndexer} from '../dtos/Event'


const eventsSlice = createSlice({
  name: 'events',
  initialState: {} as EventsIndexer,
  reducers: {}
})


export default eventsSlice.reducer