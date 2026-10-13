/* oxlint-disable react/only-export-components */
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { FilterValue } from '../types'

interface FilterGroupContextValue {
  value: FilterValue
  onChange: (value: FilterValue) => void
}

const FilterGroupContext = createContext<FilterGroupContextValue | null>(null)

function useFilterGroupContext(): FilterGroupContextValue {
  const context = useContext(FilterGroupContext)
  if (!context) {
    throw new Error('FilterGroup.Option phải được sử dụng bên trong <FilterGroup>.')
  }
  return context
}

interface FilterGroupProps {
  value: FilterValue
  onChange: (value: FilterValue) => void
  label: string
  children: ReactNode
}

function FilterGroupRoot({ value, onChange, label, children }: FilterGroupProps) {
  const contextValue = useMemo(() => ({ value, onChange }), [value, onChange])

  return (
    <FilterGroupContext.Provider value={contextValue}>
      <div className="filter-tabs" role="group" aria-label={label}>
        {children}
      </div>
    </FilterGroupContext.Provider>
  )
}

interface FilterGroupOptionProps {
  value: FilterValue
  count?: number
  children: ReactNode
}

function FilterGroupOption({ value, count, children }: FilterGroupOptionProps) {
  const { value: activeValue, onChange } = useFilterGroupContext()
  const isActive = activeValue === value

  return (
    <button
      type="button"
      className={`filter-tab${isActive ? ' filter-tab--active' : ''}`}
      aria-pressed={isActive}
      onClick={() => onChange(value)}
    >
      {children}
      {typeof count === 'number' ? <span className="filter-tab__count">{count}</span> : null}
    </button>
  )
}

export const FilterGroup = Object.assign(FilterGroupRoot, { Option: FilterGroupOption })
