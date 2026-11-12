import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import useReducedMotion from '../hooks/use-reduced-motion.js'

/**
 * 화면에 들어올 때 한 번만 아래에서 부드럽게 떠오르는 등장 효과 래퍼.
 * "동작 줄이기"를 켰거나 IntersectionObserver 를 못 쓰면 바로 보여줍니다.
 *
 * @param {React.ReactNode} children - 감쌀 내용 [Required]
 * @param {number} delay - 등장 지연(ms) [Optional, 기본값: 0]
 *
 * Example usage:
 * <Reveal><ProjectsSection /></Reveal>
 */
export default function Reveal({ children, delay = 0 }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const canObserve = typeof IntersectionObserver !== 'undefined'
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (reduced || !canObserve || !element) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // 한 번 보이면 끝: 스크롤을 되돌려도 다시 숨기지 않습니다.
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [reduced, canObserve])

  const shown = reduced || !canObserve || isVisible

  return (
    <Box
      ref={ ref }
      sx={ {
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(48px)',
        transition: `opacity .9s ease ${delay}ms, transform .9s cubic-bezier(.2, .7, .2, 1) ${delay}ms`,
      } }
    >
      { children }
    </Box>
  )
}
