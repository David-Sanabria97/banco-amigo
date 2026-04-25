import { configureStore } from '@reduxjs/toolkit'
import solicitudReducer from './slices/solicitudSlice'

export const store = configureStore({
  reducer: {
    solicitud: solicitudReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
