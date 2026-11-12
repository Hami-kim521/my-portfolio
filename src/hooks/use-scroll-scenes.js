import { useEffect } from 'react'

const clamp = (value) => Math.min(1, Math.max(0, value))

/**
 * 화면에 고정(sticky)된 섹션의 스크롤 진행도를 CSS 변수로 전달하는 훅.
 * React state 를 쓰지 않고 style 만 바꾸므로 스크롤 중에 리렌더링이 일어나지 않습니다. (rAF 로 프레임당 1번만 계산)
 *
 * - --p : 섹션 전체 진행도 0~1
 * - --{name} : scenes 에서 정한 구간(from~to)의 진행도 0~1  (예: ['a', 0, 0.3] → --a)
 *
 * @param {React.RefObject} sectionRef - 스크롤 길이를 만드는 바깥 섹션 [Required]
 * @param {React.RefObject} stageRef - CSS 변수를 받을 고정(sticky) 무대 [Required]
 * @param {Array<[string, number, number]>} scenes - [이름, 시작 진행도, 끝 진행도] 목록. 컴포넌트 밖의 상수로 넘기세요 [Required]
 *
 * Example usage:
 * useScrollScenes(sectionRef, stageRef, SCENES)
 */
export default function useScrollScenes(sectionRef, stageRef, scenes) {
  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return undefined

    let frame = 0
    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const progress = total > 0 ? clamp(-rect.top / total) : 0
      stage.style.setProperty('--p', progress.toFixed(4))
      scenes.forEach(([name, from, to]) => {
        stage.style.setProperty(`--${name}`, clamp((progress - from) / (to - from)).toFixed(4))
      })
    }
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [sectionRef, stageRef, scenes])
}
