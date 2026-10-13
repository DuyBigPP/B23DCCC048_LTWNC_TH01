import { useState, type FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { setFilter } from '../deadlineSlice'
import { isPriority } from '../guards'
import { selectCreateState, selectSubjects } from '../selectors'
import { createDeadline } from '../thunks'
import { PRIORITY_LABELS, type Priority } from '../types'
import { parseViDate } from '../../../utils/date'
import { DatePicker } from './DatePicker'
import { SubjectCombobox } from './SubjectCombobox'

interface FormValues {
  subject: string
  title: string
  dueDate: string
  priority: Priority
}

type FormField = keyof FormValues
type FormErrors = Partial<Record<FormField, string>>

const EMPTY_FORM: FormValues = { subject: '', title: '', dueDate: '', priority: 'medium' }

const PRIORITIES: Priority[] = ['low', 'medium', 'high']

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (values.subject.trim().length < 2) {
    errors.subject = 'Vui lòng nhập tên môn học (tối thiểu 2 ký tự).'
  }
  if (values.title.trim().length < 3) {
    errors.title = 'Vui lòng nhập tên bài tập (tối thiểu 3 ký tự).'
  }
  if (!values.dueDate.trim()) {
    errors.dueDate = 'Vui lòng chọn hạn nộp.'
  } else if (parseViDate(values.dueDate) === null) {
    errors.dueDate = 'Định dạng hạn nộp là dd/mm/yyyy.'
  }
  if (!isPriority(values.priority)) {
    errors.priority = 'Mức ưu tiên không hợp lệ.'
  }

  return errors
}

interface DeadlineFormProps {
  onClose: () => void
}

export function DeadlineForm({ onClose }: DeadlineFormProps) {
  const dispatch = useAppDispatch()
  const subjects = useAppSelector(selectSubjects)
  const { isCreating, createError } = useAppSelector(selectCreateState)

  const [values, setValues] = useState<FormValues>(() => ({ ...EMPTY_FORM }))
  const [errors, setErrors] = useState<FormErrors>(() => ({}))
  const [success, setSuccess] = useState<string | null>(null)

  function updateField<K extends FormField>(field: K, value: FormValues[K]): void {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
    setSuccess(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setSuccess(null)

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    const isoDate = parseViDate(values.dueDate)
    if (!isoDate) return

    try {
      await dispatch(
        createDeadline({
          subject: values.subject.trim(),
          title: values.title.trim(),
          dueDate: isoDate,
          priority: values.priority,
        }),
      ).unwrap()

      setValues({ ...EMPTY_FORM })
      setErrors({})
      setSuccess(`Đã thêm “${values.title.trim()}”.`)
      dispatch(setFilter('all'))
    } catch {
      return
    }
  }

  return (
    <form className="panel form" onSubmit={(event) => void handleSubmit(event)} noValidate>
      <h2 className="form__heading">Thêm bài tập</h2>

      <div className="field">
        <label className="field__label" htmlFor="subject">
          Môn học
        </label>
        <SubjectCombobox
          id="subject"
          value={values.subject}
          options={subjects}
          placeholder="Lập trình Web"
          invalid={errors.subject !== undefined}
          describedBy={errors.subject ? 'subject-error' : undefined}
          onChange={(next) => updateField('subject', next)}
        />
        {errors.subject ? (
          <p id="subject-error" className="field__error">
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="title">
          Tên bài tập
        </label>
        <input
          id="title"
          className="field__input"
          value={values.title}
          placeholder="Báo cáo đồ án giữa kỳ"
          aria-invalid={errors.title !== undefined}
          aria-describedby={errors.title ? 'title-error' : undefined}
          onChange={(event) => updateField('title', event.target.value)}
        />
        {errors.title ? (
          <p id="title-error" className="field__error">
            {errors.title}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="dueDate">
          Hạn nộp
        </label>
        <DatePicker
          id="dueDate"
          value={values.dueDate}
          placeholder="18/10/2026"
          invalid={errors.dueDate !== undefined}
          describedBy={errors.dueDate ? 'dueDate-error' : undefined}
          onChange={(next) => updateField('dueDate', next)}
        />
        {errors.dueDate ? (
          <p id="dueDate-error" className="field__error">
            {errors.dueDate}
          </p>
        ) : null}
      </div>

      <fieldset className="priority-field">
        <legend className="field__label">Độ ưu tiên</legend>
        <div className="priority-options">
          {PRIORITIES.map((priority) => (
            <button
              key={priority}
              type="button"
              className={`priority-option${values.priority === priority ? ' is-active' : ''}`}
              aria-pressed={values.priority === priority}
              onClick={() => updateField('priority', priority)}
            >
              {PRIORITY_LABELS[priority]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="form__actions">
        <button type="submit" className="button button--primary" disabled={isCreating}>
          {isCreating ? 'Đang thêm…' : 'Thêm bài tập'}
        </button>
        <button type="button" className="button button--ghost" onClick={onClose}>
          Hủy
        </button>
      </div>

      <p className="form__message" role="status" aria-live="polite">
        {createError ? <span className="form__error">{createError}</span> : null}
        {success ? <span className="form__success">{success}</span> : null}
      </p>
    </form>
  )
}
