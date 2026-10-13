import { FILTER_LABELS, type Deadline, type FilterValue } from '../types'
import { DeadlineItem } from './DeadlineItem'

interface DeadlineListProps {
  items: Deadline[]
  filter: FilterValue
}

export function DeadlineList({ items, filter }: DeadlineListProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Không có bài tập nào trong mục “{FILTER_LABELS[filter]}”.</p>
        <p className="empty-state__hint">
          {filter === 'all'
            ? 'Thêm bài tập đầu tiên bằng nút “Thêm bài tập”.'
            : 'Hãy đổi bộ lọc để xem các bài tập khác.'}
        </p>
      </div>
    )
  }

  return (
    <div className="deadline-list">
      {items.map((deadline) => (
        <DeadlineItem key={deadline.id} deadline={deadline} />
      ))}
      <div className="deadline-list__rule" />
    </div>
  )
}
