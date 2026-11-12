import { Box, Card, CardContent, Chip, Typography } from '@mui/material'
import ProfileAvatar from './profile-avatar.jsx'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined'
import { colors } from '../../theme.js'

/**
 * About Me 상단의 기본 정보 카드 (프로필 사진, 이름, 학력, 전공, 경력)
 *
 * @param {{ name: string, education: string, major: string, experience: string, photo: string }} basicInfo - 기본 정보 [Required]
 *
 * Example usage:
 * <BasicInfoCard basicInfo={ aboutMeData.basicInfo } />
 */
export default function BasicInfoCard({ basicInfo }) {
  const { name, education, major, experience, photo } = basicInfo

  const infoRows = [
    { icon: <SchoolOutlinedIcon fontSize="small" />, label: '학력', value: education },
    { icon: <MenuBookOutlinedIcon fontSize="small" />, label: '전공', value: major },
  ]

  return (
    <Card elevation={0} sx={ { border: `1px solid ${colors.border}`, borderRadius: 0 } }>
      <CardContent
        sx={ {
          p: { xs: 3, md: 5 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: { xs: 3, md: 5 },
          textAlign: { xs: 'center', sm: 'left' },
        } }
      >
        <ProfileAvatar photo={ photo } name={ name } size={ { xs: 120, md: 180 } } />

        <Box sx={ { flex: 1, minWidth: 0 } }>
          <Typography variant="overline" sx={ { color: colors.textSecondary } }>
            ABOUT ME
          </Typography>
          <Box
            sx={ {
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-start' },
              mb: 2,
            } }
          >
            <Typography variant="h3" component="h1" sx={ { fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 400 } }>
              { name }
            </Typography>
            <Chip
              icon={ <WorkOutlinedIcon /> }
              label={ experience }
              size="small"
              sx={ { borderRadius: 0, bgcolor: colors.primary, color: colors.textOnDark, '& .MuiChip-icon': { color: 'inherit' } } }
            />
          </Box>

          <Box sx={ { display: 'flex', flexDirection: 'column', gap: 1 } }>
            { infoRows.map(({ icon, label, value }) => (
              <Box
                key={ label }
                sx={ {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                  color: colors.textSecondary,
                } }
              >
                <Box sx={ { display: 'flex', mt: '2px' } }>{ icon }</Box>
                <Typography variant="body2" sx={ { textAlign: 'left' } }>
                  <Box component="span" sx={ { fontWeight: 700, color: colors.textPrimary, mr: 1 } }>
                    { label }
                  </Box>
                  { value }
                </Typography>
              </Box>
            )) }
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
