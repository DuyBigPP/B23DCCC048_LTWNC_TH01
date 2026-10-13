import { configureStore } from '@reduxjs/toolkit'
import { deadlinesReducer } from '../features/deadlines/deadlineSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      deadlines: deadlinesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
}

export const store = makeStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
