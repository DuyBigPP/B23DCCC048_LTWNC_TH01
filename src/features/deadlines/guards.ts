import type { Deadline, Priority } from './types'

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isPriority(value: unknown): value is Priority {
  return value === 'low' || value === 'medium' || value === 'high'
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function isISODate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(year, month - 1, day)
  return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day
}

export function isDeadline(value: unknown): value is Deadline {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    isNonEmptyString(value.subject) &&
    isNonEmptyString(value.title) &&
    isISODate(value.dueDate) &&
    isPriority(value.priority) &&
    typeof value.completed === 'boolean'
  )
}

export function isDeadlineArray(value: unknown): value is Deadline[] {
  return Array.isArray(value) && value.every(isDeadline)
}

export function isOverdue(deadline: Pick<Deadline, 'dueDate' | 'completed'>, today: string): boolean {
  return !deadline.completed && deadline.dueDate < today
}
