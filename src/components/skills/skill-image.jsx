import { useState } from 'react'
import { Box, Skeleton, Typography } from '@mui/material'
import { fonts } from '../../theme.js'

/**
 * 스킬 아이콘 이미지 한 장. 홈 아이콘과 About Me 카드가 함께 씁니다.
 * - lazy loading: 화면에 가까워질 때까지 불러오지 않습니다.
 * - 불러오는 동안에는 스켈레톤을, 실패하거나 주소가 없으면 이름 앞 두 글자를 보여줍니다.
 * - 장식용이므로 스크린 리더에는 읽히지 않습니다(이름은 옆 글자로 전달).
 *
 * @param {string} name - 기술 이름 (대체 글자용) [Required]
 * @param {string} icon - 이미지 주소. 비어 있으면 글자로 표시 [Required]
 * @param {number} size - 이미지 한 변 길이(px) [Optional, 기본값: 56]
 * @param {string} fallbackColor - 대체 글자 색 [Optional]
 *
 * Example usage:
 * <SkillImage name="React" icon={ url } size={ 40 } />
 */
export default function SkillImage({ name, icon, size = 56, fallbackColor }) {
  const [status, setStatus] = useState(icon ? 'loading' : 'broken') // 'loading' | 'loaded' | 'broken'

  // 캐시된 이미지는 onLoad 가 붙기 전에 이미 끝나 있을 수 있어 ref 로 한 번 더 확인합니다.
  const imgRef = (node) => {
    if (node?.complete && node.naturalWidth > 0) setStatus('loaded')
  }

  if (status === 'broken') {
    return (
      <Typography aria-hidden="true" sx={ { fontFamily: fonts.mono, fontSize: size * 0.36, color: fallbackColor } }>
        { name.slice(0, 2) }
      </Typography>
    )
  }

  return (
    <Box sx={ { position: 'relative', width: size, height: size } }>
      { status === 'loading' && <Skeleton variant="rounded" width={ size } height={ size } animation="wave" sx={ { position: 'absolute', inset: 0 } } /> }
      <Box
        ref={ imgRef }
        component="img"
        src={ icon }
        alt=""
        loading="lazy"
        onLoad={ () => setStatus('loaded') }
        onError={ () => setStatus('broken') }
        sx={ { width: size, height: size, objectFit: 'contain', visibility: status === 'loaded' ? 'visible' : 'hidden' } }
      />
    </Box>
  )
}
