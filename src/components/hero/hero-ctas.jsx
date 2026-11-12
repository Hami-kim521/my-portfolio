import { Box, Button } from '@mui/material'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import GitHubIcon from '@mui/icons-material/GitHub'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { EMAIL, SNS_LINKS } from '../../utils/contact-info.js'
import { scrollToId } from '../../utils/scroll.js'
import { MOBILE_COMPACT } from './hero-layout.js'
import { colors, fonts } from '../../theme.js'

const github = SNS_LINKS.find(({ id }) => id === 'github')

const TOUCH_SIZE = 48 // 터치 목표 크기(px). 권장 최소 44px 이상

const pillSx = {
  fontFamily: fonts.mono,
  fontSize: 14,
  borderRadius: 999,
  px: { xs: 1.5, tablet: 2.5 },
  minHeight: TOUCH_SIZE,
  width: { xs: '100%', tablet: 'auto' }, // 모바일에서는 칸을 가득 채워 누르기 쉽게
  textTransform: 'none',
  whiteSpace: 'nowrap',
  transition: 'background-color .3s, color .3s, transform .3s',
  '& .MuiButton-endIcon': { transition: 'transform .3s', ml: 0.75 },
  '&:hover .MuiButton-endIcon': { transform: 'translate(3px, -3px)' },
  '@media (max-width: 359.95px)': { fontSize: 13, px: 1.25 },
}

const iconLinkSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
  // 모바일: 글자가 있는 칸 / 태블릿 이상: 동그란 아이콘
  width: { xs: '100%', tablet: TOUCH_SIZE },
  height: TOUCH_SIZE,
  borderRadius: 999,
  border: `1px dashed ${colors.textPrimary}`,
  color: colors.textPrimary,
  fontFamily: fonts.mono,
  fontSize: 14,
  textDecoration: 'none',
  transition: 'background-color .3s, color .3s, transform .3s',
  '&:hover': { bgcolor: colors.primary, color: '#fff', transform: 'rotate(-6deg)' },
  // 작은 폰(가로 767 이하 + 세로 700 이하)에서는 공간이 부족해 보조 링크를 숨깁니다. (Contact 섹션에 같은 링크가 있습니다.)
  [`@media ${MOBILE_COMPACT}`]: { display: 'none' },
}

const labelSx = { display: { xs: 'inline', tablet: 'none' } }

/**
 * 히어로의 행동 유도 버튼. 방문자가 다음에 할 일(프로젝트 보기 / 연락하기)을 알려 줍니다.
 * - 데스크톱·태블릿: 알약 버튼 2개 + 원형 아이콘 링크(GitHub, 이메일)가 가로로 나열
 * - 모바일: 2열 격자로 칸을 가득 채움 (위: 주 버튼 2개 / 아래: GitHub · 이메일)
 * - 모든 터치 목표는 48px 이상입니다.
 *
 * Example usage:
 * <HeroCtas />
 */
export default function HeroCtas() {
  return (
    <Box
      sx={ {
        display: { xs: 'grid', tablet: 'flex' },
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: { xs: 1, tablet: 1.25 },
        width: { xs: '100%', tablet: 'auto' },
      } }
    >
      <Button
        variant="contained"
        color="primary"
        endIcon={ <ArrowOutwardIcon sx={ { fontSize: 18 } } /> }
        onClick={ () => scrollToId('projects') }
        sx={ { ...pillSx, '&:hover': { bgcolor: colors.buttonHover, transform: 'translateY(-2px)' } } }
      >
        프로젝트 보기
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        onClick={ () => scrollToId('contact') }
        sx={ { ...pillSx, border: `1px dashed ${colors.textPrimary}`, color: colors.textPrimary, '&:hover': { bgcolor: colors.primary, color: '#fff', border: `1px dashed ${colors.textPrimary}`, transform: 'translateY(-2px)' } } }
      >
        연락하기
      </Button>
      { github && (
        <Box component="a" href={ github.href } target="_blank" rel="noopener noreferrer" aria-label="GitHub (새 창)" sx={ iconLinkSx }>
          <GitHubIcon sx={ { fontSize: 20 } } />
          <Box component="span" aria-hidden="true" sx={ labelSx }>GitHub</Box>
        </Box>
      ) }
      <Box component="a" href={ `mailto:${EMAIL}` } aria-label="이메일 보내기" sx={ iconLinkSx }>
        <EmailOutlinedIcon sx={ { fontSize: 20 } } />
        <Box component="span" aria-hidden="true" sx={ labelSx }>Email</Box>
      </Box>
    </Box>
  )
}
