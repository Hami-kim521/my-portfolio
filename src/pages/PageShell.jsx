import { Box, Card, CardContent, Container, Typography } from '@mui/material'
import { colors } from '../theme.js'

// About / Projects 페이지가 공유하는 중앙정렬 카드 틀
export default function PageShell({ label, title, children }) {
  return (
    <Box sx={{ bgcolor: colors.bgSecondary, minHeight: 'calc(100vh - 64px)', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Card elevation={0} sx={{ textAlign: 'center', border: `1px solid ${colors.border}`, borderRadius: { xs: 3, md: 4 } }}>
          <CardContent sx={{ p: { xs: 3, md: 8 } }}>
            <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 700, letterSpacing: 2 }}>
              {label}
            </Typography>
            <Typography variant="h4" component="h1" sx={{ mt: 1, mb: 2 }}>
              {title}
            </Typography>
            <Typography sx={{ color: colors.textSecondary }}>{children}</Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
