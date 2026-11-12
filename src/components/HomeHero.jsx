import { useEffect, useRef } from 'react'
import { Box, Container, Typography, useMediaQuery } from '@mui/material'
import { keyframes, useTheme } from '@mui/material/styles'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import HeroCtas from './hero/hero-ctas.jsx'
import HeroInfoBox from './hero/hero-info-box.jsx'
import HeroLetters3D from './hero/hero-letters-3d.jsx'
import {
  HEADLINE_FONT_SIZE,
  HEADLINE_FONT_SIZE_SHORT,
  HERO_PX,
  SHORT_SCREEN,
  SUBTITLE_CAPTION_FONT_SIZE,
  SUBTITLE_FONT_SIZE,
} from './hero/hero-layout.js'
import { getLetterAspect } from './hero/letter-shapes.js'
import Sparkle from './hero/sparkle.jsx'
import useReducedMotion from '../hooks/use-reduced-motion.js'
import useScrollScenes from '../hooks/use-scroll-scenes.js'
import { colors, fonts } from '../theme.js'

// 장면별 스크롤 구간 [이름, 시작, 끝] (전체 진행도 0~1 기준). 구간이 살짝 겹쳐서 장면이 자연스럽게 이어집니다.
//  a: 포스터가 올라와 화면을 채움 / x: 포스터가 위로 퇴장 / b: 큰 단어 3개가 차례로 등장 / c: 소개 문장이 한 단어씩 진해짐
const SCENES = [
  ['a', 0, 0.28],
  ['x', 0.27, 0.5],
  ['b', 0.42, 0.78],
  ['c', 0.66, 0.94],
]

const STACK_WORDS = [
  { word: 'Design', caption: '디자인의 의도를 읽고' },
  { word: 'Code', caption: '코드로 그대로 옮기고' },
  { word: 'Detail', caption: '디테일까지 끝까지 완성합니다' },
]

// 소개 문장. oval: 타원으로 강조할 단어 / slot: 3D 글자가 날아와 앉을 자리 (이름 HAMI 를 이루는 글자)
const INTRO_TOKENS = [
  { text: '시안을' },
  { slot: 'H' },
  { text: '그대로', oval: true },
  { text: '구현하는' },
  { slot: 'A' },
  { text: '프론트엔드' },
  { text: '개발자' },
  { slot: 'M' },
  { text: '김하미입니다.' },
  { text: '디자인을' },
  { text: '배우다' },
  { text: '코드를' },
  { text: '만났고,' },
  { text: '둘을' },
  { text: '합치는' },
  { text: '일을' },
  { text: '합니다.' },
  { slot: 'I' },
]
// 글자 자리는 단어 순서(진하게 켜지는 순서)에서 제외하고, 단어끼리만 번호를 붙입니다.
let wordCounter = 0
const INTRO_ITEMS = INTRO_TOKENS.map((token) => (token.slot ? token : { ...token, order: wordCounter++ }))
const WORD_COUNT = wordCounter

// 글자 자리의 높이(em). 폭은 3D 글자의 가로세로 비율에 맞춰 비워 둡니다.
const SLOT_HEIGHT_EM = 1.5

// 소개 문장과 겹치지 않도록 오른쪽 띠와 아래쪽 띠에만 배치합니다.
const SPARKLES = [
  { top: '20%', left: '92%', size: 40, k: 1 },
  { top: '52%', left: '94%', size: 28, k: -1.4 },
  { top: '76%', left: '82%', size: 56, k: -0.8 },
  { top: '80%', left: '32%', size: 34, k: 1.2 },
  { top: '88%', left: '56%', size: 24, k: 1.6 },
]

const YEAR = new Date().getFullYear()

const visuallyHidden = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
`

/** 로딩이 끝나면(html[data-loaded]) 아래에서 떠오르며 나타나는 등장 효과 */
const enter = (delayMs = 0) => ({
  opacity: 0,
  transform: 'translateY(32px)',
  transition: `opacity .9s ease ${delayMs}ms, transform .9s cubic-bezier(.2, .7, .2, 1) ${delayMs}ms`,
  'html[data-loaded="true"] &': { opacity: 1, transform: 'none' },
})

/** 한 줄씩 마스크 안에서 올라오는 제목 줄 */
function MaskLine({ children, delay = 0 }) {
  return (
    <Box component="span" sx={ { display: 'block', overflow: 'hidden', pb: '0.08em' } }>
      <Box
        component="span"
        sx={ {
          display: 'block',
          transform: 'translateY(112%)',
          transition: `transform 1.05s cubic-bezier(.2, .7, .2, 1) ${delay}ms`,
          'html[data-loaded="true"] &': { transform: 'none' },
        } }
      >
        { children }
      </Box>
    </Box>
  )
}

/** 원 안에 들어간 × 표시. "디자인 × 코드"의 결합을 가장 진하게 보여줍니다. */
function CrossMark() {
  return (
    <Box
      component="span"
      aria-hidden="true"
      sx={ {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '0.74em',
        height: '0.74em',
        mr: '0.14em',
        border: '0.055em solid currentColor',
        borderRadius: '50%',
        verticalAlign: '0.02em',
        fontWeight: 400,
      } }
    >
      <Box component="span" sx={ { fontSize: '0.6em', lineHeight: 1, mt: '-0.05em' } }>×</Box>
    </Box>
  )
}

/**
 * 포스터 안의 거대한 제목. 페이지에서 유일한 h1 이며 스크린 리더에는 직무와 이름까지 읽힙니다.
 * 글자 크기는 화면 구간별로 다릅니다: 데스크톱은 h1(6rem+), 태블릿은 중간, 모바일은 h2(3.75rem 이하) 크기.
 */
function HeroHeadline() {
  return (
    <Typography
      variant="h1"
      sx={ {
        fontSize: HEADLINE_FONT_SIZE,
        [`@media ${SHORT_SCREEN}`]: { fontSize: HEADLINE_FONT_SIZE_SHORT },
        lineHeight: 0.92,
        fontWeight: 500,
        letterSpacing: '-0.045em',
        color: colors.textPrimary,
      } }
    >
      <MaskLine>DESIGN</MaskLine>
      <MaskLine delay={ 130 }>
        <CrossMark />
        CODE
      </MaskLine>
      <Box component="span" sx={ visuallyHidden }>
        , 프론트엔드 개발자 김하미
      </Box>
    </Typography>
  )
}

/**
 * 스크롤 연동 히어로. 섹션이 길게 늘어나 있고 화면은 고정(sticky)된 채, 스크롤에 맞춰 장면이 바뀝니다.
 *  1) 기울어진 포스터가 올라와 화면을 채움 (마우스 움직임에 살짝 따라 기울어짐)
 *  2) DESIGN / CODE / DETAIL 큰 단어가 차례로 등장
 *  3) 소개 문장이 한 단어씩 진해짐
 * 계산은 CSS 변수(--a, --b, --c)로만 전달해서 스크롤 중에 React 리렌더링이 없습니다.
 */
function HeroScenes() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  useScrollScenes(sectionRef, stageRef, SCENES)

  // 모바일(768px 미만)에서는 장식과 3D 해상도를 줄여 가볍게 만듭니다.
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('tablet'), { noSsr: true })
  const sparkles = isMobile ? SPARKLES.slice(0, 3) : SPARKLES

  // 마우스 위치(-1~1)를 CSS 변수로 전달: 포스터가 마우스 쪽으로 살짝 기울어집니다. (터치 기기에서는 사용 안 함)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || !window.matchMedia('(pointer: fine)').matches) return undefined
    let frame = 0
    const onMove = (event) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        stage.style.setProperty('--mx', ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3))
        stage.style.setProperty('--my', ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <Box
      id="hero"
      component="section"
      ref={ sectionRef }
      aria-label="소개"
      sx={ { position: 'relative', height: { xs: '300vh', tablet: '330vh', lg: '360vh' }, bgcolor: '#EDEDED' } }
    >
      <Box
        ref={ stageRef }
        sx={ {
          '--p': '0',
          '--a': '0',
          '--x': '0',
          '--b': '0',
          '--c': '0',
          '--mx': '0',
          '--my': '0',
          // 포스터가 시작하는 높이와 기울기: 화면이 작을수록 낮게/덜 기울게
          '--poster-y': '30vh',
          '--tilt': '8deg',
          '@media (min-width: 768px)': { '--poster-y': '33vh', '--tilt': '12deg' },
          '@media (min-width: 1200px)': { '--tilt': '14deg' },
          '@media (max-height: 520px)': { '--poster-y': '21vh' },
          position: 'sticky',
          top: 0,
          height: '100svh',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #E6E6E6 0%, #F4F4F4 100%)',
          color: colors.textPrimary,
        } }
      >
        {/* 별 장식: 스크롤에 따라 회전하며 위로 흘러감 */}
        <Box
          aria-hidden="true"
          sx={ { position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 'calc(var(--b) * (1 - var(--c) * 0.6))', [`@media ${SHORT_SCREEN}`]: { display: 'none' } } }
        >
          { sparkles.map(({ top, left, size, k }) => (
            <Sparkle
              key={ `${top}-${left}` }
              size={ size }
              style={ { position: 'absolute', top, left, transform: `rotate(calc(var(--p) * ${540 * k}deg)) translateY(calc(var(--p) * ${-14 * k}vh))` } }
            />
          )) }
        </Box>

        {/* 소개 한 줄: 포스터가 올라오면 위로 사라짐 */}
        <Box
          sx={ {
            position: 'absolute',
            top: { xs: 84, tablet: 'calc(92px + 3vh)', lg: 'calc(92px + 5vh)' },
            left: 0,
            right: 0,
            px: HERO_PX,
            textAlign: 'center',
            [`@media ${SHORT_SCREEN}`]: { display: 'none' }, // 세로가 매우 짧으면 제목에 자리를 양보
          } }
        >
          <Box sx={ { opacity: 'calc(1 - var(--a) * 2)', transform: 'translateY(calc(var(--a) * -7vh))' } }>
            <Typography
              sx={ {
                ...enter(900),
                mx: 'auto',
                maxWidth: 640,
                fontSize: SUBTITLE_FONT_SIZE,
                lineHeight: 1.55,
                letterSpacing: '-0.02em',
              } }
            >
              시안을 코드로, 의도 그대로 옮기는
              <br />
              프론트엔드 개발자 <b>김하미</b>입니다.
              <Box component="span" sx={ { display: 'block', mt: 0.75, fontFamily: fonts.mono, fontSize: SUBTITLE_CAPTION_FONT_SIZE, lineHeight: 1.5, color: colors.textSecondary } }>
                React · Figma · Photoshop / 신입 · Busan
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* 1. 포스터 */}
        <Box
          sx={ {
            position: 'absolute',
            top: 0,
            left: { xs: '16px', tablet: '32px', lg: '48px' },
            right: { xs: '16px', tablet: '32px', lg: '48px' },
            height: '135vh',
            transformOrigin: '50% 0',
            transform:
              'perspective(1500px) translateY(calc(var(--poster-y) * (1 - var(--a)) - 140vh * var(--x))) rotateX(calc(var(--tilt) * (1 - var(--a)) + var(--my) * -2deg)) rotateY(calc(var(--mx) * 3deg)) scale(calc(0.94 + 0.06 * var(--a)))',
            willChange: 'transform',
          } }
        >
          <Box sx={ { height: 22, bgcolor: '#2B2B2B', borderRadius: '6px 6px 0 0', boxShadow: 'inset 0 -3px 6px rgba(255,255,255,.12)' } } />
          <Box
            sx={ {
              height: 'calc(100% - 22px)',
              bgcolor: '#FAFAFA',
              boxShadow: '0 40px 90px rgba(0, 0, 0, 0.14)',
              px: { xs: 2.5, tablet: 4, lg: 6 },
              pt: { xs: 2.5, tablet: 3.5, lg: 5 },
            } }
          >
            <Box sx={ { ...enter(700), fontFamily: fonts.mono, fontSize: { xs: 11, tablet: 12, lg: 13 }, lineHeight: 1.35 } }>
              Portfolio_{ YEAR }
              <br />
              Selected works
              <br />& experiments
            </Box>
            <Box sx={ { mt: { xs: 2.5, tablet: 4, lg: 5 }, position: 'relative' } }>
              <HeroHeadline />
              {/* 타원 라벨: 비스듬히 붙어 있는 스티커 느낌. 모바일은 제목 아래, 태블릿 이상은 제목 오른쪽에 둬서 하단 정보 박스와 겹치지 않습니다. */}
              <Box
                aria-hidden="true"
                sx={ {
                  ...enter(1300),
                  position: { xs: 'static', tablet: 'absolute' },
                  right: { tablet: '4%', lg: '8%' },
                  top: { tablet: '38%' },
                  mt: { xs: 3, tablet: 0 },
                  display: 'inline-block',
                  px: 3,
                  py: 0.75,
                  border: '1.5px solid currentColor',
                  borderRadius: '50%',
                  fontFamily: fonts.mono,
                  fontSize: { xs: 12, tablet: 14, lg: 15 },
                  transform: 'rotate(-6deg)',
                  '@media (max-height: 700px)': { display: 'none' }, // 세로가 낮으면 아래 버튼에 자리를 양보
                } }
              >
                PIXEL PERFECT
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 2. 큰 단어 3개 */}
        <Box
          aria-hidden="true"
          sx={ {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            opacity: 'calc(1 - var(--c) * 4)',
            transform: 'rotate(-4deg) translateY(calc(var(--c) * -40vh))',
          } }
        >
          { STACK_WORDS.map(({ word, caption }, index) => (
            <Box
              key={ word }
              sx={ {
                '--w': `clamp(0, calc((var(--b) - ${index * 0.22}) / 0.45), 1)`,
                opacity: 'var(--w)',
                transform: 'translateY(calc((1 - var(--w)) * 55vh))',
                textAlign: 'center',
              } }
            >
              <Typography component="div" sx={ { fontFamily: fonts.display, fontSize: 'min(23vh, 21vw)', lineHeight: 0.92, textTransform: 'uppercase' } }>
                { word }
              </Typography>
              <Typography sx={ { fontFamily: fonts.mono, fontSize: SUBTITLE_CAPTION_FONT_SIZE, textTransform: 'uppercase', my: { xs: 0.5, tablet: 1 } } }>
                { caption }
              </Typography>
            </Box>
          )) }
        </Box>

        {/* 3. 소개 문장 (한 단어씩 진해짐) */}
        <Box
          sx={ {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: HERO_PX,
            opacity: 'calc(var(--c) * 3)',
            pointerEvents: 'none',
          } }
        >
          <Typography sx={ { fontFamily: fonts.mono, fontSize: 13, mb: { xs: 2, tablet: 3 } } }>[01] INTRODUCTION</Typography>
          <Typography
            component="p"
            sx={ {
              fontSize: 'clamp(1.7rem, 4.6vw, 4.4rem)',
              [`@media ${SHORT_SCREEN}`]: { fontSize: 'clamp(1.3rem, min(4.6vw, 8svh), 2.4rem)' },
              lineHeight: 1.25,
              fontWeight: 500,
              letterSpacing: '-0.03em',
              maxWidth: 1180,
            } }
          >
            { INTRO_ITEMS.map((item, index) => (
              <span key={ item.slot ?? item.text + index }>
                { index > 0 && ' ' }
                { item.slot ? (
                  // 3D 글자가 앉을 자리. 3D 가 준비되기 전/불가능할 때는 일반 글자가 보이고, 스크린 리더에는 읽히지 않습니다.
                  <Box
                    component="span"
                    aria-hidden="true"
                    data-letter-slot={ item.slot }
                    sx={ {
                      display: 'inline-block',
                      width: `${(getLetterAspect(item.slot) * SLOT_HEIGHT_EM).toFixed(3)}em`,
                      height: `${SLOT_HEIGHT_EM}em`,
                      mx: '0.12em',
                      verticalAlign: '-0.42em',
                      textAlign: 'center',
                      fontFamily: fonts.display,
                      fontSize: '1.25em',
                      lineHeight: `${(SLOT_HEIGHT_EM / 1.25).toFixed(3)}em`,
                      opacity: 'clamp(0, calc(var(--c) * 6 - 0.3), 1)',
                      '[data-letters="3d"] &': { color: 'transparent' },
                    } }
                  >
                    { item.slot }
                  </Box>
                ) : (
                  <Box
                    component="span"
                    sx={ {
                      '--i': String(item.order),
                      display: 'inline-block',
                      opacity: `clamp(0.16, calc(0.16 + var(--c) * ${WORD_COUNT + 3} - var(--i)), 1)`,
                      ...(item.oval && { border: '0.055em solid currentColor', borderRadius: '50%', px: '0.35em', mx: '0.06em' }),
                    } }
                  >
                    { item.text }
                  </Box>
                ) }
              </span>
            )) }
          </Typography>
        </Box>

        {/* 소개 문장 위에 날아와 앉는 3D 글자 (three.js 는 로딩 후 따로 불러옴) */}
        <HeroLetters3D stageRef={ stageRef } maxPixelRatio={ isMobile ? 1.5 : 1.75 } />

        {/* 항상 보이는 하단: 정보 박스 / 스크롤 안내 / CTA */}
        <Box
          sx={ {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            px: HERO_PX,
            pb: { xs: 2, tablet: 3 },
            display: 'flex',
            // 모바일: 세로로 쌓음(버튼이 위, 정보 박스가 아래) / 태블릿 이상: 정보 박스는 왼쪽, 버튼은 오른쪽
            flexDirection: { xs: 'column-reverse', tablet: 'row' },
            alignItems: { xs: 'stretch', tablet: 'flex-end' },
            justifyContent: 'space-between',
            gap: { xs: 1.5, tablet: 2 },
          } }
        >
          <Box sx={ { ...enter(1100), width: { xs: '100%', tablet: 'auto' } } }>
            <HeroInfoBox />
          </Box>
          <Box
            aria-hidden="true"
            sx={ {
              display: { xs: 'none', lg: 'flex' }, // 태블릿에서는 좌우 요소와 겹치므로 데스크톱에서만
              position: 'absolute',
              left: '50%',
              bottom: 24,
              transform: 'translateX(-50%)',
              flexDirection: 'column',
              alignItems: 'center',
              fontFamily: fonts.mono,
              fontSize: 13,
              opacity: 'calc(1 - var(--a) * 4)',
            } }
          >
            <KeyboardArrowDownIcon sx={ { animation: `${bounce} 1.4s ease-in-out infinite` } } />
            PLEASE SCROLL DOWN
          </Box>
          <Box sx={ { ...enter(1200), width: { xs: '100%', tablet: 'auto' } } }>
            <HeroCtas />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

/** "동작 줄이기" 사용자를 위한 정적 히어로. 스크롤 연동 없이 같은 정보를 한 화면에 보여줍니다. (반응형 값은 동일) */
function HeroStatic() {
  return (
    <Box
      id="hero"
      component="section"
      aria-label="소개"
      sx={ {
        minHeight: '100svh',
        bgcolor: '#EDEDED',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 3,
        pt: { xs: 11, tablet: 14 },
        pb: { xs: 2, tablet: 3 },
      } }
    >
      <Container maxWidth="lg" sx={ { px: HERO_PX } }>
        <HeroHeadline />
        <Typography sx={ { mt: { xs: 3, tablet: 4 }, maxWidth: 560, fontSize: SUBTITLE_FONT_SIZE, lineHeight: 1.55 } }>
          시안을 코드로, 의도 그대로 옮기는 프론트엔드 개발자 <b>김하미</b>입니다.
        </Typography>
        <Box sx={ { mt: { xs: 2.5, tablet: 3 } } }>
          <HeroCtas />
        </Box>
      </Container>
      <Container maxWidth="lg" sx={ { px: HERO_PX } }>
        <HeroInfoBox />
      </Container>
    </Box>
  )
}

/**
 * 홈 상단 Hero. 레퍼런스(bpco.kr)의 구성처럼 고정된 화면 위에서 스크롤로 장면이 넘어갑니다.
 * "동작 줄이기"를 켠 환경에서는 정적인 히어로를 보여줍니다.
 *
 * Example usage:
 * <HomeHero />
 */
export default function HomeHero() {
  const reduced = useReducedMotion()
  return reduced ? <HeroStatic /> : <HeroScenes />
}
