import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import Event, {EventID} from '../dtos/Event'


type Events = Event & {
  [index: string]: EventID
}

const eventsSlice = createSlice({
  name: 'events',
  initialState: {} as Events,
  reducers: {}
})


export default eventsSlice.reducer