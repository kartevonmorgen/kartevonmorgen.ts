import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EntryFormType } from '../components/EntryForm'
import EventDTO from '../dtos/Event'


export enum FORM_TYPE {
  ENTRY = 'ENTRY',
  EVENT = 'EVENT',
}

export enum FORM_STATUS {
  READY = 'READY',
  EXPIRED = 'EXPIRED',
}

type FormData = EntryFormType | EventDTO

interface FormSlice {
  type?: FORM_TYPE
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
      state.type = action.payload.type
      state.data = action.payload.data
    },
    expireFormCache: (state) => {
      state.status = FORM_STATUS.EXPIRED
    },
    clearFormCache: (state) => {
      state.status = FORM_STATUS.READY
      state.data = undefined
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
