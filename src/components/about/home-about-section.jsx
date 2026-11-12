import { Box, Container, Typography } from '@mui/material'
import ProfileAvatar from './profile-avatar.jsx'
import Paragraphs from './paragraphs.jsx'
import { usePortfolio } from '../../context/use-portfolio.js'
import { colors, fonts } from '../../theme.js'

/**
 * 홈 화면의 About Me 섹션.
 * About Me 탭에서 수정한 내용이 Context 를 통해 바로 반영됩니다.
 * - 사이드: 프로필 사진 + 기본 정보
 * - 메인: "나의 개발 스토리" 요약 + showInHome 인 나머지 항목의 요약
 *
 * Example usage:
 * <HomeAboutSection />
 */
export default function HomeAboutSection() {
  const { homeData } = usePortfolio()
  const { basicInfo, content } = homeData
  const story = content.find(({ id }) => id === 'dev-story')
  const otherItems = content.filter(({ id }) => id !== 'dev-story')

  return (
    <Box
      id="about"
      component="section"
      aria-labelledby="home-about-title"
      sx={ { bgcolor: colors.bgSecondary, py: { xs: 8, md: 14 }, borderTop: `1px solid ${colors.border}`, scrollMarginTop: '64px' } }
    >
      <Container maxWidth="lg">
        <Typography variant="overline" sx={ { color: colors.textSecondary } }>
          [02] ABOUT ME
        </Typography>
        <Typography
          id="home-about-title"
          variant="h2"
          component="h2"
          sx={ { mt: 1, fontSize: { xs: '2.4rem', md: '4.5rem' }, lineHeight: 1.05, fontWeight: 400 } }
        >
          About Me
        </Typography>

        <Box
          sx={ {
            mt: { xs: 5, md: 8 },
            display: 'grid',
            gap: { xs: 5, md: 8 },
            gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
            alignItems: 'start',
          } }
        >
          {/* 프로필 */}
          <Box sx={ { display: 'flex', flexDirection: { xs: 'row', md: 'column' }, alignItems: { xs: 'center', md: 'flex-start' }, gap: 2 } }>
            <ProfileAvatar photo={ basicInfo.photo } name={ basicInfo.name } size={ { xs: 96, md: 200 } } />
            <Box>
              <Typography sx={ { fontSize: { xs: 22, md: 28 }, lineHeight: 1.2 } }>{ basicInfo.name }</Typography>
              <Typography sx={ { fontFamily: fonts.mono, fontSize: 13, color: colors.textSecondary, mt: 0.75 } }>
                Frontend Developer
                <br />
                Design × Code
              </Typography>

              {/* 학력 · 전공 */}
              <Box sx={ { mt: 2, display: 'flex', flexDirection: 'column', gap: 1 } }>
                { [
                  { label: 'EDUCATION', value: basicInfo.education },
                  { label: 'MAJOR', value: basicInfo.major },
                ].map(({ label, value }) => (
                  <Box key={ label }>
                    <Typography sx={ { fontFamily: fonts.mono, fontSize: 11, color: colors.textSecondary } }>{ label }</Typography>
                    <Typography sx={ { fontSize: 14, lineHeight: 1.4 } }>{ value }</Typography>
                  </Box>
                )) }
              </Box>
            </Box>
          </Box>

          <Box>
            {/* 메인: 개발 스토리 요약 (100자 요약, 줄바꿈은 문단으로 표시) */}
            { story && (
              <Box sx={ { pb: 4 } }>
                <Typography component="h3" sx={ { fontFamily: fonts.mono, fontSize: 14, mb: 1.5 } }>
                  { story.title }
                </Typography>
                <Paragraphs text={ story.summary } gap={ 2 } sx={ { fontSize: { xs: 18, md: 22 }, lineHeight: 1.5 } } />
              </Box>
            ) }

            {/* 그 밖에 홈에 표시하기로 한 항목: 카드 대신 가는 선으로 구분 */}
            { otherItems.map(({ id, title, summary }, index) => (
              <Box
                key={ id }
                sx={ {
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
                  gap: { xs: 1, sm: 4 },
                  py: 3,
                  borderTop: `1px solid ${colors.border}`,
                  borderBottom: index === otherItems.length - 1 ? `1px solid ${colors.border}` : 0,
                } }
              >
                <Typography component="h3" sx={ { fontFamily: fonts.mono, fontSize: 14 } }>
                  { title }
                </Typography>
                <Paragraphs text={ summary } sx={ { color: colors.textSecondary, lineHeight: 1.6 } } />
              </Box>
            )) }

            {/* 홈에 보여줄 항목이 하나도 없을 때 */}
            { content.length === 0 && (
              <Typography sx={ { color: colors.textSecondary, py: 3 } }>
                홈에 표시할 항목이 없어요. About Me 페이지에서 "홈 탭에 표시"를 켜 주세요.
              </Typography>
            ) }
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
