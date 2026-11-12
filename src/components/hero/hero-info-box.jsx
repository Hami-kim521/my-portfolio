import { Box, Typography, useMediaQuery } from '@mui/material'
import SkillImage from '../skills/skill-image.jsx'
import { COMPACT_SCREEN, SHORT_SCREEN } from './hero-layout.js'
import { usePortfolio } from '../../context/use-portfolio.js'
import { colors, fonts } from '../../theme.js'

const YEAR = new Date().getFullYear()

const cellSx = { border: `1px solid ${colors.textPrimary}`, bgcolor: 'rgba(241, 241, 241, 0.7)', backdropFilter: 'blur(6px)' }

// 아주 좁은 폰에서는 기술 이름을 화면에서만 숨기고(스크린 리더에는 그대로 읽힘) 아이콘만 보여줍니다.
const visuallyHiddenOnNarrow = {
  '@media (max-width: 359.95px)': { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' },
}

/**
 * 히어로 좌하단 정보 박스. 한 줄 소개와 주력 기술 아이콘, 이름·연도를 작은 표처럼 보여줍니다.
 * 기술 아이콘은 About Me 에서 정한 메인 Code 스킬 중 숙련도 상위 4개이며, 호버하면 컬러로 바뀝니다.
 *
 * 화면에 맞춰 달라집니다.
 *  - 세로가 매우 짧은 화면(가로 모드 휴대폰): 아예 숨김
 *  - 세로가 낮은 화면(작은 폰): 기술 아이콘 한 줄만 있는 작은 박스
 *  - 그 외: 설명 + 기술 + 이름·연도를 모두 보여줌
 *
 * Example usage:
 * <HeroInfoBox />
 */
export default function HeroInfoBox() {
  const { homeData } = usePortfolio()
  const isShort = useMediaQuery(SHORT_SCREEN, { noSsr: true })
  const isCompact = useMediaQuery(COMPACT_SCREEN, { noSsr: true })
  const stack = homeData.mainSkillGroups.find(({ id }) => id === 'code')?.skills.slice(0, 4) ?? []

  if (isShort) return null

  return (
    <Box sx={ { width: { xs: '100%', tablet: 320, lg: 340 }, fontFamily: fonts.mono, color: colors.textPrimary } }>
      <Box sx={ { display: 'flex' } }>
        { !isCompact && (
          <Box sx={ { ...cellSx, width: 36, display: 'grid', placeItems: 'center', flexShrink: 0 } }>
            <Typography aria-hidden="true" sx={ { writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'inherit', fontSize: 11 } }>
              ©HAMI
            </Typography>
          </Box>
        ) }
        <Box sx={ { ...cellSx, ...(!isCompact && { borderLeft: 0 }), flex: 1, minWidth: 0, p: 1.25 } }>
          { !isCompact && (
            <Typography sx={ { fontFamily: 'inherit', fontSize: 11, lineHeight: 1.5, textTransform: 'uppercase' } }>
              Frontend developer turning design into code
            </Typography>
          ) }
          <Box
            role="list"
            aria-label="주력 기술"
            sx={ { mt: isCompact ? 0 : 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 1.2, rowGap: 0.75 } }
          >
            { stack.map(({ id, name, icon }) => (
              <Box
                key={ id }
                role="listitem"
                title={ name }
                sx={ {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '& img': { filter: 'grayscale(1)', opacity: 0.8, transition: 'filter .3s, opacity .3s' },
                  '&:hover img': { filter: 'none', opacity: 1 },
                } }
              >
                <SkillImage name={ name } icon={ icon } size={ 20 } />
                <Typography sx={ { fontFamily: 'inherit', fontSize: 10, ...visuallyHiddenOnNarrow } }>{ name }</Typography>
              </Box>
            )) }
          </Box>
        </Box>
      </Box>
      { !isCompact && (
        <Box sx={ { display: 'flex', mt: '-1px' } }>
          <Box sx={ { ...cellSx, flex: 1, px: 1.25, py: 0.75, fontSize: 11, textTransform: 'uppercase' } }>Hami Kim</Box>
          <Box sx={ { ...cellSx, borderLeft: 0, width: 56, px: 1.25, py: 0.75, fontSize: 11, textAlign: 'center' } }>{ YEAR }</Box>
        </Box>
      ) }
    </Box>
  )
}
