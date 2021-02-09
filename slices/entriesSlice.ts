import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {SearchEntriesIndexer} from '../dtos/SearchEntry'


const entriesSlice = createSlice({
  name: 'entries',
  initialState: {} as SearchEntriesIndexer,
  reducers: {}
})


export default entriesSlice.reducer