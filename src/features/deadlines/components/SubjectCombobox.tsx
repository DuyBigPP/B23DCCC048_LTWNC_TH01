import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { useDismiss } from '../../../hooks/useDismiss'

interface SubjectComboboxProps {
  id: string
  value: string
  options: string[]
  placeholder?: string
  invalid: boolean
  describedBy?: string
  onChange: (value: string) => void
}

function ChevronDownIcon() {
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
      <path d="M6 9.5l6 6 6-6" />
    </svg>
  )
}

export function SubjectCombobox({
  id,
  value,
  options,
  placeholder,
  invalid,
  describedBy,
  onChange,
}: SubjectComboboxProps) {
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const keyword = value.trim().toLowerCase()
  const suggestions = keyword
    ? options.filter((option) => option.toLowerCase().includes(keyword))
    : options

  useDismiss(containerRef, isOpen, () => setIsOpen(false))

  function selectOption(option: string): void {
    onChange(option)
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setIsOpen(true)
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
      return
    }
    if (event.key === 'Enter' && isOpen) {
      const option = suggestions[activeIndex]
      if (option) {
        event.preventDefault()
        selectOption(option)
      }
      return
    }
    if (event.key === 'Escape') setIsOpen(false)
  }

  return (
    <div className="combobox" ref={containerRef}>
      <input
        id={id}
        className="field__input combobox__input"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={invalid}
        aria-describedby={describedBy}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value)
          setIsOpen(true)
          setActiveIndex(-1)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />

      <button
        type="button"
        className="combobox__toggle"
        aria-label={isOpen ? 'Đóng danh sách môn học' : 'Mở danh sách môn học'}
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <ChevronDownIcon />
      </button>

      {isOpen && suggestions.length > 0 ? (
        <ul className="combobox__list" id={listId} role="listbox" aria-label="Môn học">
          {suggestions.map((option, index) => (
            <li key={option} className="combobox__item">
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                className={[
                  'combobox__option',
                  index === activeIndex ? 'is-active' : '',
                  option === value ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
