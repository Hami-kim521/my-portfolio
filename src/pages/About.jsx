import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Link, Stack } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BasicInfoCard from '../components/about/basic-info-card.jsx'
import AboutSections from '../components/about/about-sections.jsx'
import AboutSkills from '../components/about/about-skills.jsx'
import SaveStatus from '../components/about/save-status.jsx'
import { usePortfolio } from '../context/use-portfolio.js'
import { colors, fonts } from '../theme.js'

export default function About() {
  const { aboutMeData, updateSection } = usePortfolio()

  return (
    <Box sx={ { bgcolor: colors.bgSecondary, minHeight: 'calc(100vh - 64px)', py: { xs: 6, md: 12 } } }>
      <Container maxWidth="lg">
        <Stack spacing={ { xs: 4, md: 6 } }>
          <Stack spacing={ 2 }>
            <Link
              component={ RouterLink }
              to="/"
              underline="hover"
              color="inherit"
              sx={ { display: 'inline-flex', alignItems: 'center', gap: 0.5, fontFamily: fonts.mono, fontSize: 14, alignSelf: 'flex-start' } }
            >
              <ArrowBackIcon sx={ { fontSize: 16 } } aria-hidden="true" />
              홈으로
            </Link>
            <SaveStatus />
          </Stack>
          <BasicInfoCard basicInfo={ aboutMeData.basicInfo } />
          <AboutSections sections={ aboutMeData.sections } onUpdateSection={ updateSection } />
          <AboutSkills />
        </Stack>
      </Container>
    </Box>
  )
}
