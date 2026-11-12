import { useState } from 'react'
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { usePortfolio } from '../../context/use-portfolio.js'
import { colors, fonts } from '../../theme.js'

const STATUS_TEXT = {
  idle: '수정하면 자동으로 저장되고 홈 탭에 바로 반영됩니다.',
  saving: '저장 중…',
  saved: '저장되었습니다. 홈 탭에도 반영됐어요.',
  error: '이 브라우저에서는 저장할 수 없어요. 새로고침하면 수정 내용이 사라집니다.',
}

/**
 * About Me 탭 상단의 저장 상태 표시줄.
 * - 저장 상태(저장 중 / 저장됨 / 저장 실패)를 보여주고 스크린 리더에도 읽어 줍니다. (aria-live)
 * - 저장된 데이터가 손상되어 기본값으로 시작했다면 안내 메시지를 띄웁니다.
 * - "기본값으로 되돌리기"는 실수 방지를 위해 한 번 더 확인합니다.
 *
 * Example usage:
 * <SaveStatus />
 */
export default function SaveStatus() {
  const { saveStatus, loadError, dismissLoadError, resetAll } = usePortfolio()
  const [isConfirming, setIsConfirming] = useState(false)

  return (
    <Box>
      { loadError && (
        <Alert severity="warning" onClose={ dismissLoadError } sx={ { mb: 2, borderRadius: 0 } }>
          저장된 데이터를 읽지 못해 기본 내용으로 시작했어요. 새로 수정하면 다시 저장됩니다.
        </Alert>
      ) }

      <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 } }>
        {/* 상태 문구는 항상 DOM 에 있어야 스크린 리더가 변경을 알려 줍니다 */}
        <Typography
          role="status"
          aria-live="polite"
          sx={ {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontFamily: fonts.mono,
            fontSize: 13,
            color: saveStatus === 'error' ? 'error.main' : colors.textSecondary,
          } }
        >
          { saveStatus === 'saving' && <CircularProgress size={ 14 } thickness={ 5 } color="inherit" aria-hidden="true" /> }
          { saveStatus === 'saved' && <CheckIcon sx={ { fontSize: 16 } } aria-hidden="true" /> }
          { STATUS_TEXT[saveStatus] }
        </Typography>

        { isConfirming ? (
          <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
            <Typography sx={ { fontSize: 13 } }>정말 처음 상태로 되돌릴까요?</Typography>
            <Button size="small" color="inherit" variant="outlined" onClick={ () => setIsConfirming(false) }>
              취소
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={ () => {
                resetAll()
                setIsConfirming(false)
              } }
            >
              되돌리기
            </Button>
          </Box>
        ) : (
          <Button size="small" color="inherit" onClick={ () => setIsConfirming(true) } sx={ { color: colors.textSecondary } }>
            기본값으로 되돌리기
          </Button>
        ) }
      </Box>
    </Box>
  )
}
