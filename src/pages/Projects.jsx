import { useState } from 'react'
import { Alert, Box, CircularProgress, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import ProjectCard from '../components/projects/project-card.jsx'
import ProjectDetailDialog from '../components/projects/project-detail-dialog.jsx'
import useProjects from '../hooks/use-projects.js'
import { colors } from '../theme.js'

export default function Projects() {
  const { projects, isLoading, error } = useProjects()
  const [selected, setSelected] = useState(null)

  return (
    <Box sx={{ bgcolor: colors.bgSecondary, minHeight: 'calc(100vh - 64px)', py: { xs: 4, md: 8 }, overflow: 'hidden' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 700, letterSpacing: 2 }}>
            PROJECTS
          </Typography>
          <Typography variant="h4" component="h1" sx={{ mt: 1, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
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
