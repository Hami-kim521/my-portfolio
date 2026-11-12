import { memo, useMemo } from 'react'
import { Box, Button, Grow, Paper, Slider, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { colors, fonts } from '../../theme.js'
import SkillImage from '../skills/skill-image.jsx'
import { usePortfolio } from '../../context/use-portfolio.js'
import { getCategoryColor, groupSkillsByCategory, optionalSkills } from '../../utils/skills-data.js'

/**
 * 스킬 카드 한 장. 평소엔 흑백, 마우스를 올리거나 포커스하면 원래 색으로 바뀝니다.
 *
 * 다른 카드의 숙련도를 바꿔도 이 카드는 다시 그려지지 않도록 memo 로 감쌉니다.
 *
 * @param {{ id: number, name: string, icon: string, category: string, level: number }} skill - 스킬 정보 [Required]
 * @param {Function} onLevelChange - (id, level) => void [Required]
 * @param {Function} onRemove - (id) => void. 추가한 스킬을 지우는 함수 (없으면 삭제 버튼 숨김) [Optional]
 */
const SkillCard = memo(function SkillCard({ skill, onLevelChange, onRemove }) {
  const { id, name, icon, category, level } = skill
  const accent = getCategoryColor(category)

  return (
    <Grow in appear timeout={ 350 }>
    <Paper
      elevation={ 0 }
      component="li"
      sx={ {
        listStyle: 'none',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        border: `1px solid ${colors.border}`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: 0,
        transition: 'box-shadow .3s, transform .3s',
        '& img': { filter: 'grayscale(1)', opacity: 0.85, transition: 'filter .3s, opacity .3s' },
        '&:hover, &:focus-within': { boxShadow: '0 6px 18px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' },
        '&:hover img, &:focus-within img': { filter: 'none', opacity: 1 },
        '&:hover .remove-btn, &:focus-within .remove-btn': { opacity: 1 },
      } }
    >
      <Box sx={ { width: 48, height: 48, display: 'grid', placeItems: 'center', flexShrink: 0 } }>
        <SkillImage name={ name } icon={ icon } size={ 40 } fallbackColor={ accent } />
      </Box>
      <Box sx={ { flex: 1, minWidth: 0 } }>
        <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }>
          <Typography sx={ { fontFamily: fonts.mono, fontSize: 15, fontWeight: 700 } }>{ name }</Typography>
          <Typography sx={ { fontFamily: fonts.mono, fontSize: 12, color: colors.textSecondary, mr: onRemove ? 2.5 : 0 } }>{ level }</Typography>
        </Box>
        <Slider
          size="small"
          value={ level }
          min={ 0 }
          max={ 100 }
          onChange={ (_, value) => onLevelChange(id, value) }
          aria-label={ `${name} 숙련도` }
          getAriaValueText={ (value) => `100점 만점에 ${value}점` }
          sx={ { color: accent, py: 1, mb: -0.5 } }
        />
      </Box>
      { onRemove && (
        <Box
          component="button"
          type="button"
          className="remove-btn"
          aria-label={ `${name} 삭제` }
          onClick={ () => onRemove(id) }
          sx={ {
            position: 'absolute', top: 2, right: 2, opacity: { xs: 1, md: 0 }, transition: 'opacity .2s', '&:focus-visible': { opacity: 1 },
            border: 0, bgcolor: 'transparent', cursor: 'pointer', p: 0.5, display: 'grid', color: colors.textSecondary,
          } }
        >
          <CloseIcon sx={ { fontSize: 16 } } />
        </Box>
      ) }
    </Paper>
    </Grow>
  )
})

/**
 * About Me 탭의 스킬 섹션. 카테고리별로 묶어 반응형 그리드(모바일 1열 / 태블릿 2열 / 데스크탑 3열)로 보여줍니다.
 * 아래 "기술 추가" 버튼으로 Node.js, Python, Git, Notion, Claude, Gemini 를 추가하거나 뺄 수 있습니다.
 *
 * Example usage:
 * <AboutSkills />
 */
export default function AboutSkills() {
  const { aboutMeData, updateSkillLevel, addSkill, removeSkill } = usePortfolio()
  const { skills } = aboutMeData

  const groups = useMemo(() => groupSkillsByCategory(skills), [skills])
  const optionalIds = useMemo(() => new Set(optionalSkills.map(({ id }) => id)), [])
  const availableToAdd = optionalSkills.filter(({ id }) => !skills.some((skill) => skill.id === id))

  return (
    <Paper elevation={ 0 } sx={ { border: `1px solid ${colors.border}`, borderRadius: 0, p: { xs: 3, md: 5 } } }>
      <Typography variant="h6" component="h2" sx={ { fontWeight: 700 } }>
        스킬
      </Typography>
      <Typography sx={ { mt: 1, color: colors.textSecondary } }>
        아이콘에 마우스를 올리면 원래 색이 나타납니다. 슬라이더로 숙련도를 바꾸면 홈 탭 메인 스킬의 순서가 바로 바뀝니다.
      </Typography>

      <Stack spacing={ 4 } sx={ { mt: 4 } }>
        { groups.map(({ category, skills: items }) => (
          <Box key={ category } component="section" aria-label={ `${category} 스킬` }>
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, mb: 2 } }>
              <Box sx={ { width: 10, height: 10, borderRadius: '50%', bgcolor: getCategoryColor(category) } } />
              <Typography sx={ { fontFamily: fonts.mono, fontSize: 14, color: getCategoryColor(category), fontWeight: 700 } }>
                { category }
              </Typography>
            </Box>
            <Box
              component="ul"
              aria-label={ `${category} 스킬 목록` }
              sx={ {
                m: 0,
                p: 0,
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              } }
            >
              { items.map((skill) => (
                <SkillCard
                  key={ skill.id }
                  skill={ skill }
                  onLevelChange={ updateSkillLevel }
                  onRemove={ optionalIds.has(skill.id) ? removeSkill : undefined }
                />
              )) }
            </Box>
          </Box>
        )) }
      </Stack>

      { availableToAdd.length > 0 && (
        <Box sx={ { mt: 5, pt: 3, borderTop: `1px solid ${colors.border}` } }>
          <Typography sx={ { fontFamily: fonts.mono, fontSize: 13, color: colors.textSecondary, mb: 1.5 } }>
            기술 추가
          </Typography>
          <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1 } }>
            { availableToAdd.map(({ id, name }) => (
              <Button
                key={ id }
                size="small"
                variant="outlined"
                color="inherit"
                startIcon={ <AddIcon /> }
                onClick={ () => addSkill(id) }
              >
                { name }
              </Button>
            )) }
          </Box>
        </Box>
      ) }
    </Paper>
  )
}
