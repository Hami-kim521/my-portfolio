import { useEffect, useRef } from 'react'

/** WebGL 을 쓸 수 있는지 미리 확인합니다. (못 쓰는 기기에서는 용량 큰 three.js 를 내려받지 않습니다.) */
const supportsWebGL = () => {
  try {
    const probe = document.createElement('canvas')
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * 히어로 무대 위에 얹히는 3D 글자 캔버스.
 * three.js 는 용량이 커서 처음 화면에는 포함하지 않고, 로딩이 끝난 뒤 한가한 시간에 따로 불러옵니다.
 * - 준비되면 무대에 data-letters="3d" 를 켜서, 자리에 미리 보이던 일반 글자를 투명하게 바꿉니다.
 * - WebGL 을 쓸 수 없거나 중간에 멈추면 일반 글자가 그대로 보이므로 화면이 비지 않습니다.
 *
 * @param {React.RefObject} stageRef - CSS 변수(--c 등)를 가진 고정(sticky) 무대 [Required]
 * @param {number} maxPixelRatio - 렌더링 해상도 배율 상한. 모바일은 낮춰서 배터리·발열을 줄입니다 [Optional, 기본값: 1.75]
 *
 * Example usage:
 * <HeroLetters3D stageRef={ stageRef } />
 */
export default function HeroLetters3D({ stageRef, maxPixelRatio = 1.75 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas || !supportsWebGL()) return undefined

    let isCancelled = false
    let dispose = () => {}

    const start = () => {
      import('./letters-3d-scene.js')
        .then(({ createLettersScene }) => {
          if (isCancelled) return
          dispose = createLettersScene({ canvas, stage, maxPixelRatio })
          stage.dataset.letters = '3d'
        })
        .catch(() => {
          /* WebGL 불가 등: 일반 글자를 그대로 둡니다. */
        })
    }

    const hasIdle = typeof window.requestIdleCallback === 'function'
    const handle = hasIdle ? window.requestIdleCallback(start, { timeout: 2500 }) : window.setTimeout(start, 1500)

    return () => {
      isCancelled = true
      if (hasIdle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
      dispose()
      delete stage.dataset.letters
    }
  }, [stageRef, maxPixelRatio])

  return (
    <canvas
      ref={ canvasRef }
      aria-hidden="true"
      style={ {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 14px 16px rgba(0, 0, 0, 0.14))',
      } }
    />
  )
}
