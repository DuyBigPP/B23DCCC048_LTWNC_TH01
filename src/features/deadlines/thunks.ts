import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { getDeadlines, postDeadline } from './api/mockApi'
import type { Deadline, NewDeadlineInput } from './types'

interface ThunkConfig {
  state: RootState
  rejectValue: string
}

function toMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export const fetchDeadlines = createAsyncThunk<Deadline[], void, ThunkConfig>(
  'deadlines/fetchDeadlines',
  async (_, { rejectWithValue }) => {
    try {
      return await getDeadlines()
    } catch (error) {
      return rejectWithValue(toMessage(error, 'Không tải được danh sách bài tập.'))
    }
  },
  {
    condition: (_, { getState }) => getState().deadlines.status !== 'loading',
  },
)

export const createDeadline = createAsyncThunk<Deadline, NewDeadlineInput, ThunkConfig>(
  'deadlines/createDeadline',
  async (body, { rejectWithValue }) => {
    try {
      return await postDeadline(body)
    } catch (error) {
      return rejectWithValue(toMessage(error, 'Không thêm được bài tập mới.'))
    }
  },
)
