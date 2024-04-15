import { useEffect } from 'react'

const useAutoFocus = (
  ref: React.RefObject<HTMLElement> | null,
  isOpen: boolean,
  delay: number = 200
): void => {
  useEffect(() => {
    if (isOpen && ref?.current) {
      const timeoutId = setTimeout(() => {
        ref.current?.focus()
      }, delay)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [ref, delay, isOpen])
}

export default useAutoFocus
