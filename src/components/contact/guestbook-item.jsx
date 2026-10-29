import { Box, Rating } from '@mui/material';
import { colors } from '../../theme.js';
import { formatChatTime } from '../../utils/format-date.js';
import { pickCharacter } from '../../utils/guestbook-characters.js';
import CharacterAvatar from './character-avatar.jsx';

/**
 * 카카오톡 대화처럼 보이는 방명록 한 줄. 프로필은 id 로 정해지는 유명 캐릭터입니다.
 *
 * @param {number} id - 방명록 ID [Required]
 * @param {string} message - 방명록 내용 [Required]
 * @param {number} rating - 별점 (1~5) [Required]
 * @param {string} createdAt - 작성 시각 (ISO 문자열) [Required]
 *
 * Example usage:
 * <GuestbookItem id={ 1 } message="반가워요" rating={ 5 } createdAt="2026-10-29T10:00:00Z" />
 */
export default function GuestbookItem({ id, message, rating, createdAt }) {
  const character = pickCharacter(id);

  return (
    <Box sx={ { display: 'flex', gap: 1.25, alignItems: 'flex-start' } }>
      <CharacterAvatar imageUrl={ character.imageUrl } emoji={ character.emoji } name={ character.name } />
      <Box sx={ { minWidth: 0 } }>
        <Box sx={ { fontSize: '0.8rem', color: colors.textSecondary, mb: 0.5 } }>{ character.name }</Box>
        <Box sx={ { display: 'flex', alignItems: 'flex-end', gap: 0.75 } }>
          <Box
            sx={ {
              px: 1.75,
              py: 1,
              bgcolor: colors.warmBubble,
              color: colors.textPrimary,
              borderRadius: '4px 16px 16px 16px',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
            } }
          >
            <Rating value={ rating } size="small" readOnly sx={ { display: 'flex', mb: 0.5, color: colors.accentWarm } } />
            { message }
          </Box>
          <Box sx={ { fontSize: '0.7rem', color: colors.textSecondary, flexShrink: 0 } }>
            { formatChatTime(createdAt) }
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
