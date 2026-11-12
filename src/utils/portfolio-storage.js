import { initialAboutMeData } from './about-me-data.js'
import { optionalSkills, skillsData } from './skills-data.js'

const STORAGE_KEY = 'hami-portfolio:about-me:v1'

/** 아무것도 저장하지 않았을 때의 시작 데이터 (기본 스킬 + 추가 기술 전부) */
export const getDefaultPortfolio = () => ({
  ...initialAboutMeData,
  skills: [...skillsData, ...optionalSkills],
})

const clampLevel = (value) => Math.min(100, Math.max(0, Math.round(Number(value))))

/**
 * 저장된 값을 기본 데이터 위에 덮어씌웁니다. 알 수 없는 id 나 잘못된 타입은 무시하므로
 * 데이터 구조가 바뀌어도(스킬 삭제 등) 앱이 깨지지 않습니다.
 */
function mergeStored(stored) {
  const base = getDefaultPortfolio()
  if (!stored || typeof stored !== 'object') throw new Error('저장된 데이터 형식이 올바르지 않습니다.')

  const storedSections = new Map((Array.isArray(stored.sections) ? stored.sections : []).map((section) => [section?.id, section]))
  const sections = base.sections.map((section) => {
    const saved = storedSections.get(section.id)
    if (!saved) return section
    return {
      ...section,
      content: typeof saved.content === 'string' ? saved.content : section.content,
      showInHome: typeof saved.showInHome === 'boolean' ? saved.showInHome : section.showInHome,
    }
  })

  const storedSkills = new Map((Array.isArray(stored.skills) ? stored.skills : []).map((skill) => [skill?.id, skill]))
  const baseIds = new Set(skillsData.map(({ id }) => id))
  const skills = base.skills
    // 기본 스킬은 항상 유지, 추가 기술은 저장 당시 들어 있던 것만 유지
    .filter(({ id }) => baseIds.has(id) || storedSkills.has(id))
    .map((skill) => {
      const saved = storedSkills.get(skill.id)
      return saved && Number.isFinite(Number(saved.level)) ? { ...skill, level: clampLevel(saved.level) } : skill
    })

  return { ...base, sections, skills }
}

/**
 * 저장된 About Me 데이터를 불러옵니다. 실패해도 예외를 던지지 않고 기본값과 에러 여부를 돌려줍니다.
 *
 * @returns {{ data: object, error: boolean }} error 가 true 면 저장된 값이 손상되어 기본값을 쓴 것입니다.
 */
export function loadPortfolio() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return { data: getDefaultPortfolio(), error: false }
    return { data: mergeStored(JSON.parse(raw)), error: false }
  } catch {
    return { data: getDefaultPortfolio(), error: true }
  }
}

/**
 * 수정 가능한 값(섹션 내용·홈 표시 여부, 스킬 id·숙련도)만 저장합니다.
 * 아이콘 주소 같은 고정 값은 저장하지 않아서 나중에 코드에서 바꿔도 반영됩니다.
 *
 * @returns {boolean} 저장 성공 여부 (시크릿 모드, 용량 초과, 저장소 차단 시 false)
 */
export function savePortfolio({ sections, skills }) {
  try {
    const payload = {
      sections: sections.map(({ id, content, showInHome }) => ({ id, content, showInHome })),
      skills: skills.map(({ id, level }) => ({ id, level })),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

/** 저장된 값을 지웁니다. */
export function clearPortfolio() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
