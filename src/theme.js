import { createTheme } from '@mui/material/styles'

// index.css 의 CSS 변수와 같은 값을 MUI 테마에 연결합니다.
export const colors = {
  primary: '#3E3F44',
  primaryLight: '#A6A7AD',
  primaryDark: '#141414',
  secondary: '#0F0E0E',
  accent: '#F03A3A',
  accentWarm: '#F5A623',
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F4F5F6',
  bgDark: '#141414',
  textPrimary: '#3E3F44',
  textSecondary: '#797B87',
  textMuted: '#B5B5B5',
  textOnDark: '#FFFFFF',
  border: '#E5E5E5',
  buttonHover: '#141414',
}

const theme = createTheme({
  palette: {
    primary: { main: colors.primary, dark: colors.primaryDark, light: colors.primaryLight, contrastText: '#fff' },
    secondary: { main: colors.accent },
    background: { default: colors.bgPrimary, paper: colors.bgPrimary },
    text: { primary: colors.textPrimary, secondary: colors.textSecondary },
    divider: colors.border,
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
    h2: { fontWeight: 700 },
    h4: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, textTransform: 'none', fontWeight: 600 },
        containedPrimary: { '&:hover': { backgroundColor: colors.buttonHover } },
      },
    },
  },
})

export default theme
