import { useCountdown } from '../../../hooks/useCountdown'
import { toggleCompleted, removeDeadline } from '../deadlineSlice'
import { PRIORITY_LABELS, type Deadline } from '../types'
import { formatFullDate } from '../../../utils/date'
import { useAppDispatch } from '../../../app/hooks'

interface DeadlineItemProps {
  deadline: Deadline
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function DeadlineItem({ deadline }: DeadlineItemProps) {
  const dispatch = useAppDispatch()
  const { id, subject, title, dueDate, priority, completed } = deadline
  const countdown = useCountdown(dueDate)

  return (
    <li className="deadline-row">
      <input
        id={`toggle-${id}`}
        className="deadline-row__check"
        type="checkbox"
        checked={completed}
        onChange={() => dispatch(toggleCompleted(id))}
      />

      <div className="deadline-row__body">
        <label htmlFor={`toggle-${id}`} className={`deadline-row__title${completed ? ' is-done' : ''}`}>
          {title}
        </label>
        <div className="deadline-row__subject">{subject}</div>
      </div>

      <div className={`deadline-row__priority priority--${priority}`}>{PRIORITY_LABELS[priority]}</div>
      <div className="deadline-row__date">{formatFullDate(dueDate)}</div>

      <div className={`deadline-row__countdown countdown--${completed ? 'done' : countdown.tone}`}>
        {completed ? 'Đã hoàn thành' : countdown.label}
      </div>

      <button
        type="button"
        className="icon-button"
        aria-label={`Xoá bài tập ${title}`}
        onClick={() => dispatch(removeDeadline(id))}
      >
        <CloseIcon />
      </button>
    </li>
  )
}
