import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import { colors } from '../theme.js'

const tabs = [
  { label: 'Home', to: '/' },
  { label: 'About Me', to: '/about' },
]

/** 홈으로 이동(필요 시)한 뒤 Projects 섹션까지 부드럽게 스크롤합니다. */
const scrollToProjects = (navigate, pathname) => {
  const scroll = () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  if (pathname === '/') {
    scroll()
  } else {
    navigate('/')
    setTimeout(scroll, 150)
  }
}

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: colors.bgPrimary, color: colors.textPrimary, borderBottom: `1px solid ${colors.border}` }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            My Portfolio<Box component="span" sx={{ color: colors.accent }}>.</Box>
          </Typography>
          <Box component="nav" sx={{ display: 'flex', gap: 0.5 }}>
            {tabs.map((tab) => (
              <Box
                key={tab.to}
                component={NavLink}
                to={tab.to}
                end
                sx={{
                  px: 2,
                  py: 0.75,
                  borderRadius: 999,
                  color: colors.textPrimary,
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'background .25s, color .25s',
                  '&:hover': { bgcolor: colors.bgSecondary, color: colors.textPrimary },
                  '&.active': { bgcolor: colors.primary, color: colors.textOnDark },
                }}
              >
                {tab.label}
              </Box>
            ))}
            <Box
              component="button"
              type="button"
              onClick={() => scrollToProjects(navigate, pathname)}
              sx={{
                px: 2,
                py: 0.75,
                border: 0,
                bgcolor: 'transparent',
                cursor: 'pointer',
                font: 'inherit',
                borderRadius: 999,
                color: colors.textPrimary,
                fontWeight: 600,
                transition: 'background .25s, color .25s',
                '&:hover': { bgcolor: colors.bgSecondary },
              }}
            >
              Projects
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
