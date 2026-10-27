import { NavLink } from 'react-router-dom'
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import { colors } from '../theme.js'

const tabs = [
  { label: 'Home', to: '/' },
  { label: 'About Me', to: '/about' },
  { label: 'Projects', to: '/projects' },
]

export default function Navbar() {
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
