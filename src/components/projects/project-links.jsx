import { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

/** 새 탭이 열리는 동안 보여줄 로딩 표시 시간(ms) */
const LOADING_MS = 700;

/**
 * Live Demo / GitHub / View Details 버튼 묶음. 터치하기 쉬운 높이(40px)를 사용합니다.
 *
 * @param {string} detailUrl - 배포된 사이트 URL [Required]
 * @param {string} githubUrl - GitHub 저장소 URL [Optional]
 * @param {function} onViewDetails - View Details 클릭 시 실행할 함수 [Optional]
 *
 * Example usage:
 * <ProjectLinks detailUrl="https://example.com" githubUrl="https://github.com/a/b" onViewDetails={ open } />
 */
export default function ProjectLinks({ detailUrl, githubUrl, onViewDetails }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleDemoClick = () => {
    setIsOpening(true);
    setTimeout(() => setIsOpening(false), LOADING_MS);
  };

  const pressSx = { minHeight: 40, transition: 'transform 0.15s', '&:active': { transform: 'scale(0.96)' } };

  return (
    <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 1 } }>
      <Button
        variant="contained"
        size="small"
        href={ detailUrl }
        target="_blank"
        rel="noopener noreferrer"
        onClick={ handleDemoClick }
        startIcon={ isOpening ? <CircularProgress size={ 14 } color="inherit" /> : <OpenInNewIcon /> }
        sx={ pressSx }
      >
        Live Demo
      </Button>
      { githubUrl && (
        <Button
          variant="outlined"
          size="small"
          href={ githubUrl }
          target="_blank"
          rel="noopener noreferrer"
          startIcon={ <GitHubIcon /> }
          sx={ pressSx }
        >
          GitHub
        </Button>
      ) }
      { onViewDetails && (
        <Button variant="text" size="small" onClick={ onViewDetails } sx={ pressSx }>
          View Details
        </Button>
      ) }
    </Box>
  );
}
