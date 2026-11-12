import { Avatar } from '@mui/material'
import { colors } from '../../theme.js'

/**
 * 프로필 사진(정사각형). 이미지 경로(. 또는 / 포함)는 사진으로, 그 외 글자는 이모지로 가운데 정렬해 보여줍니다.
 *
 * @param {string} photo - 이모지 또는 이미지 경로 [Required]
 * @param {string} name - 접근성용 이름 [Required]
 * @param {number|object} size - 지름(px). 반응형 객체도 가능 [Optional, 기본값: 120]
 *
 * Example usage:
 * <ProfileAvatar photo="🧑‍💻" name="김하미" size={ { xs: 96, md: 200 } } />
 */
export default function ProfileAvatar({ photo, name, size = 120 }) {
  const isImage = /[./]/.test(photo)
  const toFontSize = (value) => (typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, v]) => [key, v * 0.5])) : value * 0.5)

  return (
    <Avatar
      src={ isImage ? photo : undefined }
      alt={ `${name} 프로필` }
      variant="square"
      sx={ { width: size, height: size, bgcolor: colors.primaryLight, fontSize: toFontSize(size) } }
    >
      { isImage ? null : photo }
    </Avatar>
  )
}
