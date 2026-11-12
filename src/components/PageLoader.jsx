import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import useReducedMotion from '../hooks/use-reduced-motion.js'
import { fonts } from '../theme.js'

const SEEN_KEY = 'hami-portfolio:loader-seen'
const MIN_DURATION_MS = 1700 // 리소스가 빨리 준비돼도 이 시간 동안은 카운트를 보여 줍니다.
const MAX_WAIT_MS = 5000 // 폰트가 느려도 이 시간이 지나면 기다리지 않습니다.
const LEAVE_MS = 850

const hasSeenLoader = () => {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}
const markLoaderSeen = () => {
  try {
    window.sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* 저장소를 못 써도 로더만 다시 보일 뿐입니다 */
  }
}

/** 로딩이 끝났음을 알립니다. 히어로의 등장 애니메이션이 이 값(html[data-loaded])을 기다립니다. */
const announceLoaded = () => {
  document.documentElement.dataset.loaded = 'true'
}

/** 폰트와 페이지 리소스가 준비되면 resolve 되는 Promise */
const waitForResources = () =>
  Promise.race([
    Promise.all([
      document.readyState === 'complete' ? Promise.resolve() : new Promise((resolve) => window.addEventListener('load', resolve, { once: true })),
      document.fonts?.ready ?? Promise.resolve(),
    ]),
    new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS)),
  ])

/**
 * 첫 방문 시 보여주는 로딩 화면. 검은 화면에 퍼센트와 알약 모양 진행 막대가 차오르고, 100% 가 되면 위로 걷힙니다.
 * - 같은 탭에서 다시 방문하거나 "동작 줄이기"를 켠 경우에는 건너뜁니다.
 * - 걷히는 순간 html[data-loaded="true"] 가 켜져서 히어로가 등장합니다.
 * - 로딩 중에는 뒤 화면이 스크롤되지 않도록 잠급니다.
 *
 * Example usage:
 * <PageLoader />
 */
export default function PageLoader() {
  const reduced = useReducedMotion()
  const [skip] = useState(() => hasSeenLoader() || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [percent, setPercent] = useState(0)
  const [phase, setPhase] = useState(skip ? 'done' : 'loading') // 'loading' | 'leaving' | 'done'

  useEffect(() => {
    if (skip || reduced) {
      announceLoaded()
      // 로더를 건너뛰는 경우에도 한 번 본 것으로 기록
      markLoaderSeen()
      return undefined
    }

    let isCancelled = false
    let isReady = false
    let frame = 0
    const startedAt = performance.now()
    document.body.style.overflow = 'hidden'

    waitForResources().then(() => {
      isReady = true
    })

    const tick = (now) => {
      if (isCancelled) return
      const ratio = Math.min(1, (now - startedAt) / MIN_DURATION_MS)
      const eased = 1 - (1 - ratio) ** 2
      // 리소스가 아직이면 90% 에서 기다립니다.
      const value = Math.floor((isReady ? eased : Math.min(eased, 0.9)) * 100)
      setPercent(value)
      if (value >= 100) {
        setPhase('leaving')
        announceLoaded()
        markLoaderSeen()
        setTimeout(() => {
          if (isCancelled) return
          setPhase('done')
          document.body.style.overflow = ''
        }, LEAVE_MS)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      isCancelled = true
      cancelAnimationFrame(frame)
      document.body.style.overflow = ''
    }
  }, [skip, reduced])

  if (phase === 'done' || skip || reduced) return null

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-label={ `페이지 로딩 ${percent}%` }
      sx={ {
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        bgcolor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: phase === 'leaving' ? 'translateY(-100%)' : 'none',
        transition: `transform ${LEAVE_MS}ms cubic-bezier(.76, 0, .24, 1)`,
      } }
    >
      <Typography sx={ { fontFamily: fonts.mono, fontWeight: 700, fontSize: 14, letterSpacing: '0.04em' } }>
        LOADING { percent }%
      </Typography>

      <Box
        role="progressbar"
        aria-valuemin={ 0 }
        aria-valuemax={ 100 }
        aria-valuenow={ percent }
        sx={ { mt: 3, width: 'min(672px, 72vw)', height: 22, border: '1.5px solid #fff', borderRadius: 999, p: '3px' } }
      >
        <Box sx={ { width: `${percent}%`, height: '100%', bgcolor: '#fff', borderRadius: 999 } } />
      </Box>

      <Typography
        aria-hidden="true"
        sx={ {
          position: 'absolute',
          bottom: { xs: 28, md: 36 },
          px: 3,
          maxWidth: 760,
          textAlign: 'center',
          textTransform: 'uppercase',
          fontSize: { xs: 13, md: 15 },
          lineHeight: 1.25,
        } }
      >
        A frontend developer who turns design into code, pixel by pixel.
      </Typography>
    </Box>
  )
}
