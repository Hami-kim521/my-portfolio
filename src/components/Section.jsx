import { Box, Button, Card, CardContent, Container, Typography } from '@mui/material'
import { colors } from '../theme.js'

// 홈 화면의 각 섹션을 같은 틀로 보여주는 카드. dark=true 면 다크 섹션 스타일을 씁니다.
export default function Section({ id, label, title, children, dark = false, bg, buttonLabel }) {
  const background = dark ? colors.bgDark : bg ?? colors.bgPrimary
  const fg = dark ? colors.textOnDark : colors.textPrimary
  const sub = dark ? colors.primaryLight : colors.textSecondary

  return (
    <Box id={id} component="section" sx={{ bgcolor: background, py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Card
          elevation={0}
          sx={{
            textAlign: 'center',
            color: fg,
            bgcolor: dark ? colors.secondary : colors.bgPrimary,
            border: `1px solid ${dark ? 'rgba(255,255,255,.18)' : colors.border}`,
            borderRadius: { xs: 3, md: 4 },
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 6 } }}>
            <Typography variant="overline" sx={{ color: colors.accent, fontWeight: 700, letterSpacing: 2 }}>
              {label}
            </Typography>
            <Typography variant="h4" component="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '1.6rem', md: '2.2rem' } }}>
              {title}
            </Typography>
            <Typography sx={{ color: sub, maxWidth: 560, mx: 'auto' }}>{children}</Typography>
            {buttonLabel && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                {buttonLabel}
              </Button>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
