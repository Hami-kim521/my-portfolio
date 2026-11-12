// 아이콘은 devicon (https://devicon.dev) 을 버전 고정(v2.16.0)으로 불러옵니다.
const ICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons'
const AI_ICON_BASE = 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.34.0/icons'

// ─────────────────────────────────────────────────────────────
// About Me 탭용 스킬 데이터
// ─────────────────────────────────────────────────────────────

/**
 * 기본 스킬 7종.
 * - icon: devicon 이미지 주소 (흑백 → 컬러 호버 효과를 위해 실제 브랜드 아이콘을 사용)
 * - level: 숙련도 0~100 (홈 탭에서 "숙련도 높은 순" 정렬에 사용, About Me 탭의 슬라이더로 수정)
 * - showInMain: 홈 탭 메인 스킬(Code / Design 그룹)로 노출할지 여부
 */
export const skillsData = [
  { id: 1, icon: `${ICON_BASE}/html5/html5-original.svg`, name: 'HTML', category: 'Frontend', level: 90, showInMain: true },
  { id: 2, icon: `${ICON_BASE}/css3/css3-original.svg`, name: 'CSS', category: 'Frontend', level: 85, showInMain: true },
  { id: 3, icon: `${ICON_BASE}/javascript/javascript-original.svg`, name: 'JavaScript', category: 'Frontend', level: 80, showInMain: true },
  { id: 4, icon: `${ICON_BASE}/react/react-original.svg`, name: 'React', category: 'Framework', level: 75, showInMain: true },
  { id: 5, icon: `${ICON_BASE}/figma/figma-original.svg`, name: 'Figma', category: 'Design', level: 75, showInMain: true },
  { id: 6, icon: `${ICON_BASE}/photoshop/photoshop-plain.svg`, name: 'Photoshop', category: 'Design', level: 85, showInMain: true },
  { id: 7, icon: `${ICON_BASE}/illustrator/illustrator-plain.svg`, name: 'illustrator', category: 'Design', level: 80, showInMain: true },
]

/** 나중에 추가할 수 있는 기술 후보. 화면의 "기술 추가" 버튼으로 skillsData 에 합쳐집니다. */
export const optionalSkills = [
  { id: 101, icon: `${ICON_BASE}/nodejs/nodejs-original.svg`, name: 'Node.js', category: 'Backend', level: 40, showInMain: true },
  { id: 102, icon: `${ICON_BASE}/python/python-original.svg`, name: 'Python', category: 'Backend', level: 50, showInMain: true },
  { id: 103, icon: `${ICON_BASE}/git/git-original.svg`, name: 'Git', category: 'Tools', level: 60, showInMain: true },
  // 생성형 AI 아이콘은 devicon 에 없어 LobeHub 아이콘(컬러 SVG, 버전 고정)을 사용합니다.
  { id: 104, icon: `${AI_ICON_BASE}/claude-color.svg`, name: 'Claude', category: 'AI', level: 70, showInMain: true },
  { id: 106, icon: `${AI_ICON_BASE}/gemini-color.svg`, name: 'Gemini', category: 'AI', level: 65, showInMain: true },
  { id: 105, icon: `${ICON_BASE}/notion/notion-original.svg`, name: 'Notion', category: 'Tools', level: 70, showInMain: true },
]

/** 카테고리별 표시 순서와 색상 */
export const categoryMeta = {
  Frontend: { color: '#E8590C' },
  Framework: { color: '#1C7ED6' },
  Design: { color: '#AE3EC9' },
  Backend: { color: '#2F9E44' },
  Tools: { color: '#F08C00' },
  AI: { color: '#0CA678' },
}

const FALLBACK_COLOR = '#6B6B6B'
export const getCategoryColor = (category) => categoryMeta[category]?.color ?? FALLBACK_COLOR

/** 카테고리별로 묶습니다. categoryMeta 에 적은 순서를 따르고, 빈 카테고리는 제외합니다. */
export function groupSkillsByCategory(skills) {
  const order = Object.keys(categoryMeta)
  const map = new Map()
  skills.forEach((skill) => {
    if (!map.has(skill.category)) map.set(skill.category, [])
    map.get(skill.category).push(skill)
  })
  return [...map.entries()]
    .sort(([a], [b]) => {
      const ia = order.indexOf(a) === -1 ? order.length : order.indexOf(a)
      const ib = order.indexOf(b) === -1 ? order.length : order.indexOf(b)
      return ia - ib
    })
    .map(([category, items]) => ({ category, skills: items }))
}

// ── 홈 탭 연동용 헬퍼 ────────────────────────────────────────

/** 숙련도 높은 순으로 정렬한 새 배열 (원본은 바꾸지 않음) */
export const sortByLevel = (skills) => [...skills].sort((a, b) => b.level - a.level)

/** 숙련도 상위 n 개 */
export const getTopSkills = (skills, n) => sortByLevel(skills).slice(0, n)

/** 메인 스킬(showInMain)만. n 을 주면 그중 숙련도 상위 n 개 */
export const getMainSkills = (skills, n) => {
  const main = sortByLevel(skills.filter((skill) => skill.showInMain))
  return n === undefined ? main : main.slice(0, n)
}

/**
 * 홈 탭용: 메인 스킬을 Code / Design / Tools / AI 그룹으로 나누고 각 그룹 안에서 숙련도 높은 순으로 정렬합니다.
 * Design 카테고리는 Design, Tools 카테고리는 Tools, AI 카테고리는 AI, 나머지(Frontend, Framework, Backend)는 Code 그룹입니다.
 * 비어 있는 그룹은 빠집니다.
 */
export const getMainSkillGroups = (skills) => {
  const main = getMainSkills(skills)
  const groupOf = ({ category }) => {
    if (category === 'Design') return 'design'
    if (category === 'Tools') return 'tools'
    if (category === 'AI') return 'ai'
    return 'code'
  }
  return [
    { id: 'code', title: 'Code' },
    { id: 'design', title: 'Design' },
    { id: 'tools', title: 'Tools' },
    { id: 'ai', title: 'AI' },
  ]
    .map((group) => ({ ...group, skills: main.filter((skill) => groupOf(skill) === group.id) }))
    .filter(({ skills: items }) => items.length > 0)
}
