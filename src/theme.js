import { createTheme } from '@mui/material/styles'

// 포트폴리오 기획서(BPCO 레퍼런스 분석)의 무채색 팔레트.
// index.css 의 CSS 변수와 같은 값을 MUI 테마에 연결합니다.
export const colors = {
  primary: '#121212',
  primaryLight: '#C5C5C5',
  primaryDark: '#000000',
  secondary: '#121212',
  accent: '#121212', // 포인트 색 없이 무채색 유지 (강조는 굵기·크기·밑줄로)
  accentWarm: '#121212',
  warmBg: '#F1F1F1',
  warmBubble: '#F1F1F1',
  warmText: '#121212',
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F1F1F1',
  bgDark: '#121212',
  textPrimary: '#121212',
  textSecondary: '#6B6B6B', // 흰 배경에서 읽기 편한 대비를 위해 #C5C5C5 보다 진한 회색
  textMuted: '#C5C5C5',
  textOnDark: '#FFFFFF',
  border: 'rgba(0, 0, 0, 0.12)',
  borderOnDark: 'rgba(255, 255, 255, 0.18)',
  buttonHover: '#000000',
}

// 폰트: 모던(메인) Space Grotesk, 코드 느낌(보조) Space Mono, 개성(포인트) Rock Salt. 한글은 Pretendard.
export const fonts = {
  main: '"Space Grotesk", Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
  mono: '"Space Mono", Pretendard, ui-monospace, monospace',
  point: '"Rock Salt", cursive',
  display: '"Anton", "Space Grotesk", Pretendard, sans-serif', // 히어로의 거대한 세로형 단어용
}

const headingStyle = { fontFamily: fonts.main, fontWeight: 500, letterSpacing: '-0.02em' }

const theme = createTheme({
  // 히어로 반응형 기준: 모바일 ≤767 / 태블릿 768~1199 / 데스크톱 1200+.
  // MUI 기본값(sm 600, md 900)은 그대로 두고, 768px 기준점인 tablet 만 추가했습니다. (sx 에서 { xs, tablet, lg } 로 사용)
  breakpoints: { values: { xs: 0, sm: 600, tablet: 768, md: 900, lg: 1200, xl: 1536 } },
  palette: {
    primary: { main: colors.primary, dark: colors.primaryDark, light: colors.primaryLight, contrastText: '#fff' },
    secondary: { main: colors.accent },
    background: { default: colors.bgPrimary, paper: colors.bgPrimary },
    text: { primary: colors.textPrimary, secondary: colors.textSecondary },
    divider: colors.border,
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: fonts.main,
    h1: headingStyle,
    h2: headingStyle,
    h3: headingStyle,
    h4: headingStyle,
    h5: headingStyle,
    h6: headingStyle,
    overline: { fontFamily: fonts.mono, fontWeight: 400, letterSpacing: '0.08em', textTransform: 'none', lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 0, textTransform: 'none', fontWeight: 500, fontFamily: fonts.mono, boxShadow: 'none' },
        containedPrimary: { '&:hover': { backgroundColor: colors.buttonHover, boxShadow: 'none' } },
      },
    },
  },
})

export default theme
