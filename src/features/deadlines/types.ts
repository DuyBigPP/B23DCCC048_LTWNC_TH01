export type Priority = 'low' | 'medium' | 'high'

export type FilterValue = 'all' | 'pending' | 'overdue' | 'completed'

export interface Deadline {
  id: string
  subject: string
  title: string
  dueDate: string
  priority: Priority
  completed: boolean
}

export type NewDeadlineInput = Omit<Deadline, 'id' | 'completed'>

export type DeadlineField = keyof NewDeadlineInput

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Thấp',
  medium: 'Vừa',
  high: 'Cao',
}

export const FILTER_LABELS: Record<FilterValue, string> = {
  all: 'Tất cả',
  pending: 'Chưa hoàn thành',
  overdue: 'Quá hạn',
  completed: 'Đã hoàn thành',
}

export interface DeadlineStats {
  total: number
  pending: number
  overdue: number
  completed: number
}
