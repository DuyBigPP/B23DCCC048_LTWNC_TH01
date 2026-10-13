import { isDeadline, isDeadlineArray } from '../guards'
import type { Deadline, NewDeadlineInput } from '../types'
import { addDaysISO } from '../../../utils/date'

export type Validator<T> = (value: unknown) => value is T

const LATENCY_MS = 700

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `dl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function createSampleData(): Deadline[] {
  const today = new Date()
  const rows: Array<Omit<Deadline, 'id'>> = [
    { subject: 'Lập Trình Web', title: 'Bài tập 1: Xây dựng trang HTML/CSS', dueDate: addDaysISO(today, -3), priority: 'high', completed: false },
    { subject: 'Lập Trình Web', title: 'Assignment 2: Responsive layout', dueDate: addDaysISO(today, 2), priority: 'medium', completed: false },
    { subject: 'Cấu Trúc Dữ Liệu', title: 'BTL: Cây nhị phân tìm kiếm', dueDate: addDaysISO(today, -1), priority: 'high', completed: false },
    { subject: 'Cấu Trúc Dữ Liệu', title: 'Bài tập tuần 5: Đệ quy', dueDate: addDaysISO(today, 0), priority: 'low', completed: true },
    { subject: 'Mạng Máy Tính', title: 'Lab 3: Cấu hình subnetting', dueDate: addDaysISO(today, 1), priority: 'medium', completed: false },
    { subject: 'Mạng Máy Tính', title: 'Báo cáo thực tập Wireshark', dueDate: addDaysISO(today, 6), priority: 'low', completed: false },
    { subject: 'Tiếng Anh Kỹ Thuật', title: 'Essay: Technology in education', dueDate: addDaysISO(today, 4), priority: 'medium', completed: false },
    { subject: 'Xác Thống Thống Kê', title: 'Bài tập chương 4: Phân phối', dueDate: addDaysISO(today, 9), priority: 'high', completed: false },
    { subject: 'Tiếng Anh Kỹ Thuật', title: 'Quiz 1: Vocabulary', dueDate: addDaysISO(today, -5), priority: 'low', completed: true },
    { subject: 'Lập Trình Hướng Đối Tượng', title: 'Thiết kế hệ thống quản lý thư viện', dueDate: addDaysISO(today, 14), priority: 'high', completed: false },
  ]

  return rows.map((row) => ({ id: createId(), ...row }))
}

const SAMPLE_DATA: Deadline[] = createSampleData()

async function fakeFetch(path: string, init?: { body?: NewDeadlineInput }): Promise<unknown> {
  await delay(LATENCY_MS)

  if (path === '/api/deadlines' && init?.body === undefined) {
    return JSON.parse(JSON.stringify(SAMPLE_DATA)) as unknown
  }

  if (path === '/api/deadlines' && init?.body !== undefined) {
    return JSON.parse(
      JSON.stringify({ id: createId(), completed: false, ...init.body }),
    ) as unknown
  }

  throw new Error(`404 – Không tìm thấy tài nguyên ${path}`)
}

async function request<T>(path: string, validator: Validator<T>, init?: { body?: NewDeadlineInput }): Promise<T> {
  try {
    const payload: unknown = await fakeFetch(path, init)
    if (!validator(payload)) {
      throw new Error('Dữ liệu API trả về không đúng định dạng (type guard thất bại).')
    }
    return payload
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Lỗi không xác định khi gọi API.')
  }
}

export function getDeadlines(): Promise<Deadline[]> {
  return request('/api/deadlines', isDeadlineArray)
}

export function postDeadline(body: NewDeadlineInput): Promise<Deadline> {
  return request('/api/deadlines', isDeadline, { body })
}
