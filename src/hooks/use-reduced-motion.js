import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * 사용자가 OS 에서 "동작 줄이기"를 켰는지 알려 주는 훅. 바뀌면 바로 반영됩니다.
 *
 * @returns {boolean} true 면 큰 움직임(스크롤 연동, 로더 등)을 쓰지 말아야 합니다.
 *
 * Example usage:
 * const reduced = useReducedMotion()
 */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = (event) => setReduced(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}
