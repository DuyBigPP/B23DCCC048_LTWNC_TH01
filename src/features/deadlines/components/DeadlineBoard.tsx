import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { setFilter } from '../deadlineSlice'
import {
  selectFilteredDeadlines,
  selectFilter,
  selectLoadError,
  selectStats,
  selectStatus,
} from '../selectors'
import { fetchDeadlines } from '../thunks'
import { FILTER_LABELS } from '../types'
import { DeadlineList } from './DeadlineList'
import { FilterGroup } from './FilterGroup'

export function DeadlineBoard() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectStatus)
  const error = useAppSelector(selectLoadError)
  const filter = useAppSelector(selectFilter)
  const stats = useAppSelector(selectStats)
  const deadlines = useAppSelector(selectFilteredDeadlines)

  useEffect(() => {
    if (status === 'idle') void dispatch(fetchDeadlines())
  }, [status, dispatch])

  if (status === 'loading') {
    return (
      <section className="board" aria-busy="true">
        <p className="board__status">Đang tải bài tập…</p>
        <div className="skeleton-list" aria-hidden="true">
          <div className="skeleton-row" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
        </div>
        <div className="deadline-list__rule" />
      </section>
    )
  }

  if (status === 'failed') {
    return (
      <section className="board">
        <div className="error-state" role="alert">
          <p className="error-state__title">Không tải được dữ liệu.</p>
          <p className="error-state__detail">{error}</p>
          <button
            type="button"
            className="button button--outline"
            onClick={() => void dispatch(fetchDeadlines())}
          >
            Thử lại
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="board" aria-label="Danh sách bài tập">
      <FilterGroup value={filter} onChange={(next) => dispatch(setFilter(next))} label="Lọc theo trạng thái">
        <FilterGroup.Option value="all" count={stats.total}>
          {FILTER_LABELS.all}
        </FilterGroup.Option>
        <FilterGroup.Option value="pending" count={stats.pending}>
          {FILTER_LABELS.pending}
        </FilterGroup.Option>
        <FilterGroup.Option value="overdue" count={stats.overdue}>
          {FILTER_LABELS.overdue}
        </FilterGroup.Option>
        <FilterGroup.Option value="completed" count={stats.completed}>
          {FILTER_LABELS.completed}
        </FilterGroup.Option>
      </FilterGroup>

      <DeadlineList items={deadlines} filter={filter} />
    </section>
  )
}
