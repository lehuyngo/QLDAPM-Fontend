import { useEffect, useState } from 'react'
export const useDebounce = (value: string | null, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<string | null>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}
