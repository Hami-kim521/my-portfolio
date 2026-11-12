import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import { scrollToId } from '../utils/scroll.js'
import { HERO_PX } from './hero/hero-layout.js'
import { colors, fonts } from '../theme.js'

const NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'contact', label: 'CONTACT' },
]

// 홈 화면의 섹션 id → 메뉴 항목 (스크롤 위치에 따라 현재 메뉴를 표시)
const SECTION_TO_NAV = { hero: 'home', about: 'about', skills: 'about', projects: 'projects', contact: 'contact' }
const ROUTE_TO_NAV = { '/about': 'about', '/projects': 'projects' }

/** 홈이 아닌 페이지에서 메뉴를 누르면 홈으로 이동한 뒤 해당 섹션까지 스크롤합니다. */
const goToSection = (navigate, pathname, id) => {
  if (pathname === '/') {
    scrollToId(id)
  } else {
    navigate('/')
    setTimeout(() => scrollToId(id), 150)
  }
}

// 메타 정보 칸: 모노 폰트. 글자색은 부모(헤더 레이어)의 difference 블렌드를 따라갑니다.
const metaSx = {
  fontFamily: fonts.mono,
  fontSize: { xs: 12, tablet: 13, lg: 14 },
  lineHeight: 1.2,
  color: 'inherit',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  '@media (max-width: 359.95px)': { fontSize: 11 }, // 아주 좁은 폰에서 로고와 메뉴가 겹치지 않게
}

/**
 * 화면 상단에 고정되는 헤더.
 * 모노 폰트 메타 정보 5칸 + 가운데 점선 알약 메뉴로 구성되고, 현재 위치의 메뉴를 알약 하이라이트가 따라다닙니다.
 * 홈에서는 스크롤 위치(IntersectionObserver)로, 다른 페이지에서는 주소로 현재 메뉴를 정합니다.
 *
 * Example usage:
 * <Navbar />
 */
export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [spyId, setSpyId] = useState('home')
  const [highlight, setHighlight] = useState(null) // { left, width }
  const itemRefs = useRef({})
  const pillRef = useRef(null)

  const activeId = pathname === '/' ? spyId : ROUTE_TO_NAV[pathname] ?? 'home'

  // 홈 화면에서 지금 보고 있는 섹션 감시
  useEffect(() => {
    if (pathname !== '/') return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setSpyId(SECTION_TO_NAV[entry.target.id])
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    Object.keys(SECTION_TO_NAV).forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [pathname])

  // 하이라이트 위치 측정 (폰트가 늦게 로드돼 글자 폭이 바뀌어도 다시 측정)
  useLayoutEffect(() => {
    const measure = () => {
      const element = itemRefs.current[activeId]
      if (element) setHighlight({ left: element.offsetLeft, width: element.offsetWidth })
    }
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeId])

  const itemSx = (id) => ({
    position: 'relative',
    zIndex: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: { xs: 1.1, tablet: 1.5, lg: 1.75 },
    py: 0.75,
    minHeight: { xs: 44, tablet: 44, lg: 36 }, // 터치 화면에서는 44px 이상
    border: 0,
    bgcolor: 'transparent',
    cursor: 'pointer',
    font: 'inherit',
    fontFamily: fonts.mono,
    fontSize: { xs: 12, tablet: 13, lg: 14 },
    letterSpacing: '0.02em',
    textDecoration: 'none',
    borderRadius: 999,
    color: activeId === id ? '#fff' : colors.textPrimary,
    transition: 'color .35s',
    '&:hover': { color: activeId === id ? '#fff' : colors.textSecondary },
    '@media (max-width: 389.95px)': { fontSize: 11, px: 0.9 },
  })

  return (
    <>
      {/* 레이어 1: 메타 정보 5칸. 이 레이어 자체가 화면 위에 섞여(difference) 밝은 배경에선 검게, 어두운 구간에선 희게 보입니다. */}
      <Box
        component="header"
        sx={ {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          px: HERO_PX,
          pt: { xs: 0, tablet: 3 },
          height: { xs: 72, tablet: 'auto' },
          display: 'grid',
          // 모바일: 로고만 / 태블릿: 로고 · 메뉴 자리 · 위치 / 데스크톱: 메타 5칸
          gridTemplateColumns: { xs: '1fr', tablet: '1fr 340px 1fr', lg: '1fr 1fr 340px 1fr 1fr' },
          columnGap: 2,
          alignItems: { xs: 'center', tablet: 'start' },
          color: '#fff',
          mixBlendMode: 'difference',
          pointerEvents: 'none', // 빈 칸을 눌러도 뒤의 화면이 눌리도록 하고, 눌러야 하는 요소만 다시 켭니다.
        } }
      >
        <Box
          component={ Link }
          to="/"
          aria-label="김하미 포트폴리오 홈"
          sx={ { ...metaSx, pointerEvents: 'auto', '@media (max-width: 339.95px)': { display: 'none' } } } // 아주 좁으면 메뉴에 자리를 양보(HOME 메뉴가 있음)
        >
          Hami Kim
          <Box component="span" sx={ { display: { xs: 'none', tablet: 'block' } } }>Design × Code</Box>
          <Box component="span" sx={ { display: { xs: 'none', tablet: 'block' } } }>Portfolio</Box>
        </Box>
        <Box aria-hidden="true" sx={ { ...metaSx, display: { xs: 'none', lg: 'block' } } }>Frontend_developer</Box>
        <Box aria-hidden="true" sx={ { display: { xs: 'none', tablet: 'block' } } } />
        <Box aria-hidden="true" sx={ { ...metaSx, display: { xs: 'none', lg: 'block' }, justifySelf: 'start', ml: 6 } }>Design_to_code</Box>
        <Box aria-hidden="true" sx={ { ...metaSx, display: { xs: 'none', tablet: 'flex' }, alignItems: 'center', gap: 0.75, justifySelf: 'end' } }>
          <PublicIcon sx={ { fontSize: 18 } } />
          Busan,Korea
        </Box>
      </Box>

      {/* 레이어 2: 가운데 점선 알약 메뉴. 섞이지 않는 일반 레이어입니다. */}
      <Box
        component="nav"
        aria-label="주요 메뉴"
        ref={ pillRef }
        sx={ {
          position: 'fixed',
          zIndex: 1201,
          top: { xs: 10, tablet: 20 },
          right: { xs: 16, tablet: 'auto' },
          left: { xs: 'auto', tablet: '50%' },
          transform: { xs: 'none', tablet: 'translateX(-50%)' },
          display: 'flex',
          alignItems: 'center',
          p: '4px',
          border: `1px dashed ${colors.textPrimary}`,
          borderRadius: 999,
          bgcolor: 'rgba(241, 241, 241, 0.6)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        } }
      >
        {/* 현재 메뉴를 따라다니는 알약 하이라이트 */}
        { highlight && (
          <Box
            aria-hidden="true"
            sx={ {
              position: 'absolute',
              top: '4px',
              bottom: '4px',
              left: 0,
              width: highlight.width,
              transform: `translateX(${highlight.left}px)`,
              bgcolor: colors.primary,
              borderRadius: 999,
              transition: 'transform .45s cubic-bezier(.65, 0, .35, 1), width .45s cubic-bezier(.65, 0, .35, 1)',
            } }
          />
        ) }
        { NAV_ITEMS.map(({ id, label }) =>
          id === 'home' ? (
            <Box
              key={ id }
              component={ Link }
              to="/"
              ref={ (node) => { itemRefs.current[id] = node } }
              aria-current={ activeId === id ? 'page' : undefined } // NavLink 가 아닌 Link 를 써서 현재 메뉴 표시를 직접 제어합니다.
              onClick={ (event) => {
                if (pathname === '/') {
                  event.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              } }
              sx={ itemSx(id) }
            >
              { label }
            </Box>
          ) : (
            <Box
              key={ id }
              component="button"
              type="button"
              ref={ (node) => { itemRefs.current[id] = node } }
              aria-current={ activeId === id ? 'true' : undefined }
              onClick={ () => goToSection(navigate, pathname, id) }
              sx={ itemSx(id) }
            >
              { label }
            </Box>
          ),
        ) }
      </Box>
    </>
  )
}
