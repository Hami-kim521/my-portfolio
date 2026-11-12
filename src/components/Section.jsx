import { Box, Button, Container, Typography } from '@mui/material'
import { colors } from '../theme.js'

// 홈 화면의 각 섹션을 같은 틀로 보여주는 미니멀 블록. 카드 테두리 없이 여백과 가는 선으로 구분합니다.
// dark=true 면 다크 섹션 스타일을 씁니다.
export default function Section({ id, label, title, children, dark = false, bg, buttonLabel }) {
  const background = dark ? colors.bgDark : bg ?? colors.bgPrimary
  const fg = dark ? colors.textOnDark : colors.textPrimary
  const sub = dark ? colors.primaryLight : colors.textSecondary

  return (
    <Box
      id={id}
      component="section"
      sx={{ bgcolor: background, color: fg, py: { xs: 8, md: 14 }, borderTop: `1px solid ${dark ? colors.borderOnDark : colors.border}` }}
    >
      <Container maxWidth="lg">
        <Typography variant="overline" sx={{ color: sub }}>
          {label}
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          sx={{ mt: 1, mb: { xs: 3, md: 4 }, fontSize: { xs: '2.4rem', md: '4.5rem' }, lineHeight: 1.05, fontWeight: 400 }}
        >
          {title}
        </Typography>
        <Typography sx={{ color: sub, maxWidth: 560 }}>{children}</Typography>
        {buttonLabel && (
          <Button variant="contained" color="primary" sx={{ mt: 4, px: 4, py: 1.25 }}>
            {buttonLabel}
          </Button>
        )}
      </Container>
    </Box>
  )
}
