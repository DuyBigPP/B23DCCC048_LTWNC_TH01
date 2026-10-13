import { useEffect, type RefObject } from 'react'

export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onDismiss: () => void,
): void {
  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: PointerEvent): void {
      const target = event.target as Node
      if (ref.current && !ref.current.contains(target)) onDismiss()
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') onDismiss()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, isOpen, onDismiss])
}
