import { useState } from 'react'
import { DeadlineBoard } from './features/deadlines/components/DeadlineBoard'
import { DeadlineForm } from './features/deadlines/components/DeadlineForm'

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-header__title">Deadline</h1>
        <button
          type="button"
          className="button button--outline"
          aria-expanded={isFormOpen}
          onClick={() => setIsFormOpen((open) => !open)}
        >
          Thêm bài tập
        </button>
      </header>

      {isFormOpen ? <DeadlineForm onClose={() => setIsFormOpen(false)} /> : null}

      <DeadlineBoard />
    </div>
  )
}
