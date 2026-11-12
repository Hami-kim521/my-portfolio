import { Fragment, memo } from 'react'
import { Box, Typography } from '@mui/material'
import { colors, fonts } from '../../theme.js'
import SkillIcon from './skill-icon.jsx'

/** 한 그룹(제목 + 아이콘 목록). 그룹 데이터가 같으면 다시 그리지 않습니다. */
const SkillGroup = memo(function SkillGroup({ group }) {
  return (
    <Box>
      <Typography
        id={ `skill-group-${group.id}` }
        sx={ { fontFamily: fonts.mono, fontSize: 14, mb: 2, pb: 1, borderBottom: `1px solid ${colors.border}` } }
      >
        { group.title }
      </Typography>
      <Box role="list" aria-labelledby={ `skill-group-${group.id}` } sx={ { display: 'flex', flexWrap: 'wrap', gap: 2 } }>
        { group.skills.map(({ id, name, icon }) => (
          <SkillIcon key={ id } name={ name } icon={ icon } />
        )) }
      </Box>
    </Box>
  )
})

/**
 * 메인 스킬 표시.
 * - 위: Code × Design (lg 이상에서는 한 줄, 그보다 좁으면 줄바꿈하고 모바일에서는 세로로 쌓임)
 * - 아래: Tools 와 AI (항상 Code·Design 아래 줄, Tools 오른편에 AI 를 나란히)
 *
 * @param {Array<{ id: string, title: string, skills: Array }>} groups - getMainSkillGroups() 결과 [Required]
 *
 * Example usage:
 * <MainSkillGroups groups={ homeData.mainSkillGroups } />
 */
export default function MainSkillGroups({ groups }) {
  const bottomIds = ['tools', 'ai']
  const topGroups = groups.filter(({ id }) => !bottomIds.includes(id))
  const bottomGroups = bottomIds.map((id) => groups.find((group) => group.id === id)).filter(Boolean)

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 8 } } }>
      { topGroups.length > 0 && (
        <Box
          sx={ {
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            // lg(1200px) 이상에서는 Code × Design 을 한 줄로 고정, 그보다 좁으면 넘치지 않게 줄바꿈
            flexWrap: { xs: 'nowrap', md: 'wrap', lg: 'nowrap' },
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 4, md: 5 },
          } }
        >
          { topGroups.map((group, index) => (
            <Fragment key={ group.id }>
              { index > 0 && (
                <Typography
                  aria-hidden="true"
                  sx={ { fontSize: { xs: 28, md: 48 }, color: colors.textMuted, fontWeight: 300, alignSelf: { xs: 'flex-start', md: 'center' } } }
                >
                  ×
                </Typography>
              ) }
              <SkillGroup group={ group } />
            </Fragment>
          )) }
        </Box>
      ) }
      { bottomGroups.length > 0 && (
        <Box sx={ { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: { xs: 4, md: 8 } } }>
          { bottomGroups.map((group) => (
            <SkillGroup key={ group.id } group={ group } />
          )) }
        </Box>
      ) }
    </Box>
  )
}
