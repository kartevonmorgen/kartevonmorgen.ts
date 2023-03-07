import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EntryFormType } from '../components/EntryForm'
import EventDTO from '../dtos/Event'
import Category from '../dtos/Categories'


export enum FORM_STATUS {
  READY = 'READY',
  EXPIRED = 'EXPIRED',
}

type FormData = EntryFormType | EventDTO

interface FormSlice {
  category?: Category
  status: FORM_STATUS
  data?: FormData
}

const formSlice = createSlice({
  name: 'form',
  initialState: {
    status: FORM_STATUS.READY,
  } as FormSlice,
  reducers: {
    cacheFormData: (state, action: PayloadAction<Omit<FormSlice, 'status'>>) => {
      state.status = FORM_STATUS.READY
      state.category = action.payload.category
      state.data = action.payload.data
    },
    expireFormCache: (state) => {
      state.status = FORM_STATUS.EXPIRED
    },
    clearFormCache: (state) => {
      state.status = FORM_STATUS.READY
      state.data = undefined
    },
    setCategory: (state, action: PayloadAction<Category>) => {
      state.category = action.payload
    }
  },
})

export const {
  cacheFormData,
  expireFormCache,
  clearFormCache,
} = formSlice.actions

export const { actions } = formSlice

export default formSlice.reducer
