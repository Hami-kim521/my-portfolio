import { Box, CircularProgress } from '@mui/material';
import { colors } from '../../theme.js';
import GuestbookItem from './guestbook-item.jsx';

/**
 * 방명록 목록 (최신순). 로딩 / 오류 / 빈 상태도 함께 보여줍니다.
 *
 * @param {Array} entries - 방명록 배열 { id, message, rating, created_at } [Required]
 * @param {boolean} isLoading - 불러오는 중 여부 [Optional, 기본값: false]
 * @param {string} error - 오류 메시지 [Optional, 기본값: '']
 *
 * Example usage:
 * <GuestbookList entries={ entries } isLoading={ isLoading } error={ error } />
 */
export default function GuestbookList({ entries, isLoading = false, error = '' }) {
  if (isLoading) {
    return (
      <Box sx={ { display: 'flex', justifyContent: 'center', py: 3 } }>
        <CircularProgress size={ 28 } />
      </Box>
    );
  }
  if (error) {
    return <Box sx={ { color: colors.accent, fontSize: '0.9rem' } }>{ error }</Box>;
  }
  if (entries.length === 0) {
    return (
      <Box sx={ { color: colors.textSecondary, textAlign: 'center', py: 3 } }>
        아직 방명록이 없어요. 첫 번째 손님이 되어 주세요! 👋
      </Box>
    );
  }

  return (
    <Box
      sx={ {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxHeight: { xs: 360, md: 420 },
        overflowY: 'auto',
        pr: 0.5,
      } }
    >
      { entries.map(({ id, message, rating, created_at: createdAt }) => (
        <GuestbookItem key={ id } id={ id } message={ message } rating={ rating } createdAt={ createdAt } />
      )) }
    </Box>
  );
}
