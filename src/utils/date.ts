const MS_PER_DAY = 24 * 60 * 60 * 1000

export function parseDateOnly(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00`)
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function differenceInDays(later: Date, earlier: Date): number {
  const delta = startOfLocalDay(later).getTime() - startOfLocalDay(earlier).getTime()
  return Math.round(delta / MS_PER_DAY)
}

export function toISODate(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function addDaysISO(base: Date, days: number): string {
  return toISODate(new Date(base.getFullYear(), base.getMonth(), base.getDate() + days))
}

export function parseViDate(value: string): string | null {
  const matched = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim())
  if (!matched) return null

  const [, day, month, year] = matched
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null
  }

  return toISODate(date)
}

export function formatShortDate(isoDate: string): string {
  const date = parseDateOnly(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  const pad = (value: number): string => String(value).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`
}

export function formatViDate(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

export function toISODateFromTime(time: number): string {
  return toISODate(new Date(time))
}

export function formatViDateFromTime(time: number): string {
  return formatViDate(new Date(time))
}
