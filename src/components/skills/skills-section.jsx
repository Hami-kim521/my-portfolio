import { Box, Container, Typography } from '@mui/material'
import { usePortfolio } from '../../context/use-portfolio.js'
import { colors } from '../../theme.js'
import MainSkillGroups from './main-skill-groups.jsx'

/**
 * 홈 화면의 Skill 섹션. About Me 탭에서 정한 메인 스킬을 Code × Design 그룹으로 아이콘과 이름으로 보여줍니다.
 *
 * Example usage:
 * <SkillsSection />
 */
export default function SkillsSection() {
  const { homeData } = usePortfolio()

  return (
    <Box
      id="skills"
      component="section"
      sx={ { bgcolor: colors.bgPrimary, py: { xs: 8, md: 14 }, borderTop: `1px solid ${colors.border}`, scrollMarginTop: '64px' } }
    >
      <Container maxWidth="lg">
        <Typography variant="overline" sx={ { color: colors.textSecondary } }>
          [03] SKILLS
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          sx={ { mt: 1, fontSize: { xs: '2.4rem', md: '4.5rem' }, lineHeight: 1.05, fontWeight: 400 } }
        >
          Skills
        </Typography>
        <Typography sx={ { mt: 3, color: colors.textSecondary, maxWidth: 560 } }>
          가장 자신 있게 다루는 도구들입니다.
        </Typography>

        <Box sx={ { mt: { xs: 5, md: 8 } } }>
          <MainSkillGroups groups={ homeData.mainSkillGroups } />
        </Box>
      </Container>
    </Box>
  )
}
