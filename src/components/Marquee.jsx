import { Box } from '@mui/material'
import { keyframes } from '@mui/material/styles'
import Sparkle from './hero/sparkle.jsx'
import { colors, fonts } from '../theme.js'

const scroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`

const WORDS = ['Design', 'Code', 'React', 'Figma', 'Detail', 'Photoshop', 'Illustrator']

/**
 * 히어로와 About 사이를 잇는 가로 흐르는 띠. 마우스를 올리면 멈춥니다.
 * 장식이므로 스크린 리더에는 읽히지 않고, "동작 줄이기" 설정이면 index.css 에 의해 멈춥니다.
 *
 * Example usage:
 * <Marquee />
 */
export default function Marquee() {
  // 끊김 없이 이어지도록 같은 목록을 두 번 이어 붙이고, -50% 만큼 이동시킵니다.
  const items = [...WORDS, ...WORDS]
  return (
    <Box
      aria-hidden="true"
      sx={ {
        bgcolor: colors.bgDark,
        color: '#F1F1F1',
        overflow: 'hidden',
        py: { xs: 1.5, md: 2.5 },
        '&:hover > div': { animationPlayState: 'paused' },
      } }
    >
      <Box sx={ { display: 'flex', width: 'max-content', animation: `${scroll} 32s linear infinite` } }>
        { [0, 1].map((copy) => (
          <Box key={ copy } sx={ { display: 'flex', alignItems: 'center', flexShrink: 0 } }>
            { items.slice(0, WORDS.length).map((word) => (
              <Box key={ word + copy } sx={ { display: 'flex', alignItems: 'center' } }>
                <Box
                  component="span"
                  sx={ { fontFamily: fonts.display, fontSize: { xs: '1.8rem', md: '3.2rem' }, textTransform: 'uppercase', letterSpacing: '0.02em', px: { xs: 2, md: 4 } } }
                >
                  { word }
                </Box>
                <Sparkle size={ 22 } style={ { flexShrink: 0 } } />
              </Box>
            )) }
          </Box>
        )) }
      </Box>
    </Box>
  )
}
