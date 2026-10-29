import { useState } from 'react';
import { Alert, Box, Button, Rating, TextField, Typography } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { colors } from '../../theme.js';

const MAX_NAME = 20;
const MAX_MESSAGE = 300;

/**
 * 방명록 작성 폼 (이름 / 메시지 / 별점).
 *
 * @param {function} onSubmit - 저장 함수. { authorName, message, rating } 를 받아 성공 여부(boolean)를 반환 [Required]
 *
 * Example usage:
 * <GuestbookForm onSubmit={ addEntry } />
 */
export default function GuestbookForm({ onSubmit }) {
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null);

  const canSubmit = authorName.trim() && message.trim() && rating && !isSending;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    setIsSending(true);
    const isOk = await onSubmit({ authorName: authorName.trim(), message: message.trim(), rating });
    setIsSending(false);

    if (isOk) {
      setAuthorName('');
      setMessage('');
      setRating(5);
      setStatus({ severity: 'success', text: '방명록이 등록됐어요. 고마워요! 🎉' });
    } else {
      setStatus({ severity: 'error', text: '등록하지 못했어요. 잠시 후 다시 시도해 주세요.' });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={ handleSubmit }
      sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }
    >
      <Typography sx={ { fontWeight: 700, color: colors.warmText } }>✏️ 방명록 남기기</Typography>

      <TextField
        label="이름"
        value={ authorName }
        onChange={ (event) => setAuthorName(event.target.value) }
        helperText="이름은 비공개로 저장돼요. 목록에는 캐릭터로만 보여요."
        slotProps={ { htmlInput: { maxLength: MAX_NAME } } }
        size="small"
        required
        fullWidth
      />
      <TextField
        label="메시지"
        value={ message }
        onChange={ (event) => setMessage(event.target.value) }
        slotProps={ { htmlInput: { maxLength: MAX_MESSAGE } } }
        helperText={ `${message.length} / ${MAX_MESSAGE}` }
        size="small"
        multiline
        minRows={ 3 }
        required
        fullWidth
      />
      <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
        <Typography sx={ { color: colors.textSecondary, fontSize: '0.9rem' } }>별점</Typography>
        <Rating
          value={ rating }
          onChange={ (_, value) => setRating(value) }
          sx={ { color: colors.accentWarm } }
        />
      </Box>

      { status && <Alert severity={ status.severity }>{ status.text }</Alert> }

      <Button
        type="submit"
        variant="contained"
        disabled={ !canSubmit }
        endIcon={ <SendRoundedIcon /> }
        sx={ { alignSelf: 'flex-end' } }
      >
        { isSending ? '보내는 중...' : '남기기' }
      </Button>
    </Box>
  );
}
