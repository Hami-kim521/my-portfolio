import { memo } from 'react'
import { Box, Typography } from '@mui/material'
import SkillImage from './skill-image.jsx'
import { colors, fonts } from '../../theme.js'

/**
 * 스킬 아이콘 한 칸. 평소엔 무채색, 마우스를 올리면 원래 색으로 바뀝니다.
 * - 이미지 로딩·실패 표시는 SkillImage 가 맡습니다.
 * - 목록 항목(listitem)으로 읽히도록 부모에 role="list" 가 필요합니다.
 * - props 가 같으면 다시 그리지 않도록 memo 로 감쌌습니다.
 *
 * @param {string} name - 기술 이름 [Required]
 * @param {string} icon - 아이콘 이미지 주소. 비어 있으면 글자로 표시 [Required]
 *
 * Example usage:
 * <SkillIcon name="React" icon={ url } />
 */
const SkillIcon = memo(function SkillIcon({ name, icon }) {
  return (
    <Box
      role="listitem"
      sx={ {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        width: 88,
        '& img': { filter: 'grayscale(1)', opacity: 0.85, transition: 'filter .3s, opacity .3s, transform .3s' },
        '&:hover img': { filter: 'none', opacity: 1, transform: 'translateY(-6px) scale(1.06)' },
        '&:hover .skill-name': { color: colors.textPrimary },
      } }
    >
      <Box sx={ { width: 72, height: 72, display: 'grid', placeItems: 'center' } }>
        <SkillImage name={ name } icon={ icon } size={ 56 } />
      </Box>
      <Typography className="skill-name" sx={ { fontFamily: fonts.mono, fontSize: 13, color: colors.textSecondary, transition: 'color .3s' } }>
        { name }
      </Typography>
    </Box>
  )
})

export default SkillIcon
