import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PortfolioContext } from './portfolio-context.js'
import { clearPortfolio, getDefaultPortfolio, loadPortfolio, savePortfolio } from '../utils/portfolio-storage.js'
import { getMainSkillGroups, optionalSkills } from '../utils/skills-data.js'

const HOME_SUMMARY_LENGTH = 100
const SAVE_DELAY_MS = 500 // 슬라이더를 끌거나 글을 쓰는 동안은 저장을 미루고, 멈추면 한 번만 저장합니다.

const summarize = (text) => (text.length > HOME_SUMMARY_LENGTH ? `${text.slice(0, HOME_SUMMARY_LENGTH)}...` : text)

/**
 * About Me 데이터(기본 정보, 섹션, 스킬)를 한곳에서 관리하고 홈 탭용 데이터를 자동으로 만들어 줍니다.
 * About Me 탭에서 값을 바꾸면 같은 state 를 보는 홈 탭이 즉시 다시 그려지고, 잠시 뒤 브라우저에 저장됩니다.
 *
 * 제공하는 값:
 * - aboutMeData, homeData: 데이터
 * - updateSection / updateSkillLevel / addSkill / removeSkill / resetAll: 수정 함수 (참조가 바뀌지 않음)
 * - saveStatus: 'idle' | 'saving' | 'saved' | 'error'
 * - loadError / dismissLoadError: 저장된 값이 손상되어 기본값으로 시작했는지 여부
 *
 * @param {React.ReactNode} children - 하위 컴포넌트 [Required]
 *
 * Example usage:
 * <PortfolioProvider><App /></PortfolioProvider>
 */
export function PortfolioProvider({ children }) {
  const [initial] = useState(loadPortfolio)
  const [aboutMeData, setAboutMeData] = useState(initial.data)
  const [loadError, setLoadError] = useState(initial.error)
  const [saveStatus, setSaveStatus] = useState('idle')
  // 저장 대상이 아닌 데이터(처음 불러온 값, 초기화한 값)를 기억해 두어 불필요한 저장을 건너뜁니다.
  const lastSeenData = useRef(initial.data)

  // 데이터가 바뀌면 잠시 뒤 저장합니다.
  useEffect(() => {
    if (lastSeenData.current === aboutMeData) return undefined
    lastSeenData.current = aboutMeData
    setSaveStatus('saving')
    const timer = setTimeout(() => setSaveStatus(savePortfolio(aboutMeData) ? 'saved' : 'error'), SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [aboutMeData])

  // 액션들은 함수형 업데이트만 쓰므로 참조가 바뀌지 않아 하위 컴포넌트의 불필요한 리렌더링을 막아 줍니다.
  const updateSection = useCallback((id, patch) => {
    setAboutMeData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === id ? { ...section, ...patch } : section)),
    }))
  }, [])

  const updateSkillLevel = useCallback((id, level) => {
    setAboutMeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) => (skill.id === id ? { ...skill, level } : skill)),
    }))
  }, [])

  const addSkill = useCallback((id) => {
    const skill = optionalSkills.find((item) => item.id === id)
    if (!skill) return
    setAboutMeData((prev) => (prev.skills.some((item) => item.id === id) ? prev : { ...prev, skills: [...prev.skills, skill] }))
  }, [])

  const removeSkill = useCallback((id) => {
    setAboutMeData((prev) => ({ ...prev, skills: prev.skills.filter((skill) => skill.id !== id) }))
  }, [])

  /** 저장된 값을 지우고 처음 상태로 되돌립니다. */
  const resetAll = useCallback(() => {
    const defaults = getDefaultPortfolio()
    lastSeenData.current = defaults
    const isCleared = clearPortfolio()
    setAboutMeData(defaults)
    setLoadError(false)
    setSaveStatus(isCleared ? 'idle' : 'error')
  }, [])

  const dismissLoadError = useCallback(() => setLoadError(false), [])

  // 홈 탭용 데이터: aboutMeData 가 바뀔 때만 다시 계산합니다. (정렬은 복사본에서 하므로 원본 순서는 유지됩니다.)
  const homeData = useMemo(
    () => ({
      basicInfo: aboutMeData.basicInfo,
      content: aboutMeData.sections
        .filter((section) => section.showInHome)
        .map(({ id, title, content }) => ({ id, title, summary: summarize(content) })),
      mainSkillGroups: getMainSkillGroups(aboutMeData.skills),
    }),
    [aboutMeData],
  )

  const value = useMemo(
    () => ({
      aboutMeData,
      homeData,
      saveStatus,
      loadError,
      updateSection,
      updateSkillLevel,
      addSkill,
      removeSkill,
      resetAll,
      dismissLoadError,
    }),
    [aboutMeData, homeData, saveStatus, loadError, updateSection, updateSkillLevel, addSkill, removeSkill, resetAll, dismissLoadError],
  )

  return <PortfolioContext.Provider value={ value }>{ children }</PortfolioContext.Provider>
}
