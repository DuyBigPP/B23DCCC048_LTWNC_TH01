import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { createDeadline, fetchDeadlines } from './thunks'
import type { Deadline, FilterValue, RequestStatus } from './types'

export interface DeadlinesState {
  items: Deadline[]
  status: RequestStatus
  error: string | null
  filter: FilterValue
  isCreating: boolean
  createError: string | null
}

const initialState: DeadlinesState = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'all',
  isCreating: false,
  createError: null,
}

const deadlinesSlice = createSlice({
  name: 'deadlines',
  initialState,
  reducers: {
    toggleCompleted(state, action: PayloadAction<Deadline['id']>) {
      const target = state.items.find((item) => item.id === action.payload)
      if (target) target.completed = !target.completed
    },
    removeDeadline(state, action: PayloadAction<Deadline['id']>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setFilter(state, action: PayloadAction<FilterValue>) {
      state.filter = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeadlines.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDeadlines.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchDeadlines.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Không tải được danh sách bài tập.'
      })
      .addCase(createDeadline.pending, (state) => {
        state.isCreating = true
        state.createError = null
      })
      .addCase(createDeadline.fulfilled, (state, action) => {
        state.isCreating = false
        state.items.unshift(action.payload)
      })
      .addCase(createDeadline.rejected, (state, action) => {
        state.isCreating = false
        state.createError = action.payload ?? action.error.message ?? 'Không thêm được bài tập mới.'
      })
  },
})

export const { toggleCompleted, removeDeadline, setFilter } = deadlinesSlice.actions
export const deadlinesReducer = deadlinesSlice.reducer
