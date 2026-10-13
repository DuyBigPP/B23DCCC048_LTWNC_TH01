import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { toISODate } from '../../utils/date'
import { isOverdue } from './guards'
import type { Deadline, DeadlineStats, FilterValue } from './types'

const selectSlice = (state: RootState) => state.deadlines

export const selectAllDeadlines = createSelector([selectSlice], (state) => state.items)
export const selectFilter = createSelector([selectSlice], (state) => state.filter)
export const selectStatus = createSelector([selectSlice], (state) => state.status)
export const selectLoadError = createSelector([selectSlice], (state) => state.error)
export const selectCreateState = createSelector([selectSlice], (state) => ({
  isCreating: state.isCreating,
  createError: state.createError,
}))

export const selectSubjects = createSelector([selectAllDeadlines], (items) =>
  [...new Set(items.map((item) => item.subject))].sort((a, b) => a.localeCompare(b, 'vi')),
)

export const selectStats = createSelector([selectAllDeadlines], (items): DeadlineStats => {
  const today = toISODate(new Date())
  const stats: DeadlineStats = { total: items.length, pending: 0, overdue: 0, completed: 0 }

  for (const item of items) {
    if (item.completed) {
      stats.completed += 1
      continue
    }
    stats.pending += 1
    if (isOverdue(item, today)) stats.overdue += 1
  }

  return stats
})

function byDueDate(a: Deadline, b: Deadline): number {
  if (a.completed !== b.completed) return a.completed ? 1 : -1
  if (a.dueDate === b.dueDate) return 0
  return a.dueDate < b.dueDate ? -1 : 1
}

export const selectFilteredDeadlines = createSelector(
  [selectAllDeadlines, selectFilter],
  (items, filter: FilterValue) => {
    const today = toISODate(new Date())

    switch (filter) {
      case 'completed':
        return items.filter((item) => item.completed).toSorted(byDueDate)
      case 'overdue':
        return items.filter((item) => isOverdue(item, today)).toSorted(byDueDate)
      case 'pending':
        return items.filter((item) => !item.completed).toSorted(byDueDate)
      default:
        return items.toSorted(byDueDate)
    }
  },
)
