import { Box, Container, Typography } from '@mui/material'
import { colors } from '../theme.js'

// Projects 등 서브 페이지가 공유하는 미니멀 페이지 틀 (왼쪽 정렬, 큰 제목)
export default function PageShell({ label, title, children }) {
  return (
    <Box sx={{ bgcolor: colors.bgPrimary, minHeight: 'calc(100vh - 64px)', py: { xs: 8, md: 14 } }}>
      <Container maxWidth="lg">
        <Typography variant="overline" sx={{ color: colors.textSecondary }}>
          {label}
        </Typography>
        <Typography variant="h1" sx={{ mt: 1, mb: 3, fontSize: { xs: '2.8rem', md: '5rem' }, lineHeight: 1.05, fontWeight: 400 }}>
          {title}
        </Typography>
        <Typography sx={{ color: colors.textSecondary, maxWidth: 560 }}>{children}</Typography>
      </Container>
    </Box>
  )
}
