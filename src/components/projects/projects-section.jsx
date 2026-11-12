import { useState } from 'react'
import { Alert, Box, CircularProgress, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import useProjects from '../../hooks/use-projects.js'
import { colors } from '../../theme.js'
import ProjectCard from './project-card.jsx'
import ProjectDetailDialog from './project-detail-dialog.jsx'

/**
 * 홈 화면의 Projects 섹션. DB 의 프로젝트 카드를 바로 보여줍니다. (id="projects" 로 메뉴 스크롤 대상)
 *
 * Example usage:
 * <ProjectsSection />
 */
export default function ProjectsSection() {
  const { projects, isLoading, error } = useProjects()
  const [selected, setSelected] = useState(null)

  return (
    <Box
      id="projects"
      component="section"
      sx={{
        bgcolor: colors.bgPrimary,
        py: { xs: 8, md: 14 },
        overflow: 'hidden',
        scrollMarginTop: '64px',
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ mb: { xs: 4, md: 8 } }}>
          <Typography variant="overline" sx={{ color: colors.textSecondary }}>
            [04] PROJECTS
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            sx={{ mt: 1, fontSize: { xs: '2.4rem', md: '4.5rem' }, lineHeight: 1.05, fontWeight: 400 }}
          >
            Projects
          </Typography>
        </Box>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {!isLoading && !error && projects.length === 0 && (
          <Box sx={{ textAlign: 'center', color: colors.textSecondary }}>아직 등록된 프로젝트가 없어요.</Box>
        )}

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ProjectCard project={project} onViewDetails={setSelected} />
            </Grid>
          ))}
        </Grid>
      </Container>
      <ProjectDetailDialog project={selected} onClose={() => setSelected(null)} />
    </Box>
  )
}
