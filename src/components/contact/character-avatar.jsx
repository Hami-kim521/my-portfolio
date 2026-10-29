import { useState } from 'react';
import { Avatar } from '@mui/material';
import { colors } from '../../theme.js';

/**
 * 방명록 프로필 사진 (유명 캐릭터). 이미지를 못 불러오면 emoji 로 대신 보여줍니다.
 *
 * @param {string} imageUrl - 캐릭터 이미지 주소 [Required]
 * @param {string} emoji - 이미지 실패 시 보여줄 emoji [Required]
 * @param {string} name - 캐릭터 이름 (alt 텍스트) [Required]
 * @param {number} size - 아바타 지름(px) [Optional, 기본값: 44]
 *
 * Example usage:
 * <CharacterAvatar imageUrl={ url } emoji="⚡" name="피카츄" />
 */
export default function CharacterAvatar({ imageUrl, emoji, name, size = 44 }) {
  const [isBroken, setIsBroken] = useState(false);

  return (
    <Avatar
      src={ isBroken ? undefined : imageUrl }
      alt={ name }
      slotProps={ { img: { onError: () => setIsBroken(true), loading: 'lazy' } } }
      sx={ {
        width: size,
        height: size,
        bgcolor: colors.warmBubble,
        fontSize: size * 0.5,
        '& img': { objectFit: 'contain', p: 0.5 },
      } }
    >
      { emoji }
    </Avatar>
  );
}
