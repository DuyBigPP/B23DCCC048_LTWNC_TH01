import { useMemo } from 'react'
import { differenceInDays, parseDateOnly } from '../utils/date'
import { useNow } from './useNow'

export type CountdownTone = 'neutral' | 'warning' | 'danger'

export interface Countdown {
  daysLeft: number
  isOverdue: boolean
  isDueToday: boolean
  label: string
  tone: CountdownTone
}

export function resolveCountdown(dueDate: string, now: number): Countdown {
  const due = parseDateOnly(dueDate)
  if (Number.isNaN(due.getTime())) {
    return { daysLeft: 0, isOverdue: false, isDueToday: false, label: 'Chưa rõ hạn', tone: 'neutral' }
  }

  const daysLeft = differenceInDays(due, new Date(now))
  const isOverdue = daysLeft < 0
  const isDueToday = daysLeft === 0

  if (isOverdue) {
    return { daysLeft, isOverdue, isDueToday, label: `Quá hạn ${Math.abs(daysLeft)} ngày`, tone: 'danger' }
  }
  if (isDueToday) {
    return { daysLeft, isOverdue, isDueToday, label: 'Hạn hôm nay', tone: 'danger' }
  }
  return {
    daysLeft,
    isOverdue,
    isDueToday,
    label: `Còn ${daysLeft} ngày`,
    tone: daysLeft <= 2 ? 'warning' : 'neutral',
  }
}

export function useCountdown(dueDate: string): Countdown {
  const now = useNow()
  return useMemo(() => resolveCountdown(dueDate, now), [dueDate, now])
}
