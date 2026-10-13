import { useId, useRef, useState } from 'react'
import { useDismiss } from '../../../hooks/useDismiss'
import { useNow } from '../../../hooks/useNow'
import {
  formatViDate,
  formatViDateFromTime,
  parseDateOnly,
  parseViDate,
  toISODate,
  toISODateFromTime,
} from '../../../utils/date'

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const CELLS_PER_GRID = 42

interface DayCell {
  iso: string
  day: number
  inMonth: boolean
}

function buildMonthGrid(year: number, month: number): DayCell[] {
  const firstDay = new Date(year, month, 1)
  const offset = (firstDay.getDay() + 6) % 7
  const start = new Date(year, month, 1 - offset)

  const cells: DayCell[] = []
  for (let index = 0; index < CELLS_PER_GRID; index += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)
    cells.push({
      iso: toISODate(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month,
    })
  }
  return cells
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
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
      <path d={direction === 'left' ? 'M14.5 6l-6 6 6 6' : 'M9.5 6l6 6-6 6'} />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="5.5" width="17" height="15" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
    </svg>
  )
}

interface DatePickerProps {
  id: string
  value: string
  placeholder?: string
  invalid: boolean
  describedBy?: string
  onChange: (value: string) => void
}

export function DatePicker({
  id,
  value,
  placeholder,
  invalid,
  describedBy,
  onChange,
}: DatePickerProps) {
  const popoverId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const now = useNow()

  const selectedIso = parseViDate(value)
  const [viewDate, setViewDate] = useState<Date>(() =>
    selectedIso ? parseDateOnly(selectedIso) : new Date(),
  )

  useDismiss(containerRef, isOpen, () => setIsOpen(false))

  const cells = buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth())
  const todayIso = toISODateFromTime(now)

  function shiftMonth(step: number): void {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + step, 1))
  }

  function toggleOpen(): void {
    if (!isOpen && selectedIso) setViewDate(parseDateOnly(selectedIso))
    setIsOpen((open) => !open)
  }

  function selectDay(iso: string): void {
    onChange(formatViDate(parseDateOnly(iso)))
    setIsOpen(false)
  }

  return (
    <div className="datepicker" ref={containerRef}>
      <input
        id={id}
        className="field__input datepicker__input"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />

      <button
        type="button"
        className="datepicker__toggle"
        aria-label={isOpen ? 'Đóng lịch' : 'Mở lịch chọn ngày'}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={toggleOpen}
      >
        <CalendarIcon />
      </button>

      {isOpen ? (
        <div className="datepicker__popover" id={popoverId} role="dialog" aria-label="Chọn hạn nộp">
          <div className="datepicker__head">
            <button type="button" className="datepicker__nav" aria-label="Tháng trước" onClick={() => shiftMonth(-1)}>
              <ChevronIcon direction="left" />
            </button>
            <span className="datepicker__month">
              Tháng {viewDate.getMonth() + 1} / {viewDate.getFullYear()}
            </span>
            <button type="button" className="datepicker__nav" aria-label="Tháng sau" onClick={() => shiftMonth(1)}>
              <ChevronIcon direction="right" />
            </button>
          </div>

          <div className="datepicker__weekdays" aria-hidden="true">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          <div className="datepicker__grid">
            {cells.map((cell) => (
              <button
                key={cell.iso}
                type="button"
                className={[
                  'datepicker__day',
                  cell.inMonth ? '' : 'is-outside',
                  cell.iso === todayIso ? 'is-today' : '',
                  cell.iso === selectedIso ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-current={cell.iso === todayIso ? 'date' : undefined}
                onClick={() => selectDay(cell.iso)}
              >
                {cell.day}
              </button>
            ))}
          </div>

          <button type="button" className="datepicker__today" onClick={() => selectDay(todayIso)}>
            Hôm nay · {formatViDateFromTime(now)}
          </button>
        </div>
      ) : null}
    </div>
  )
}
