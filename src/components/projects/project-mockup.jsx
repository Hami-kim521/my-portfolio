import { Box } from '@mui/material';
import { colors } from '../../theme.js';

/**
 * 모바일 목업(폰 프레임) 안에 썸네일을 보여주는 4:3 이미지 영역.
 *
 * @param {string} src - 썸네일 이미지 URL [Required]
 * @param {string} alt - 이미지 대체 텍스트 [Required]
 *
 * Example usage:
 * <ProjectMockup src="https://image.thum.io/get/https://example.com" alt="예시" />
 */
export default function ProjectMockup({ src, alt }) {
  return (
    <Box
      sx={ {
        aspectRatio: '4 / 3',
        bgcolor: colors.bgSecondary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        overflow: 'hidden',
        pt: 2,
      } }
    >
      <Box
        sx={ {
          height: '100%',
          aspectRatio: '9 / 16',
          maxWidth: '55%',
          bgcolor: colors.primaryDark,
          border: `4px solid ${colors.primaryDark}`,
          borderBottom: 0,
          borderRadius: '20px 20px 0 0',
          overflow: 'hidden',
        } }
      >
        <Box
          component="img"
          src={ src }
          alt={ alt }
          loading="lazy"
          sx={ { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block', bgcolor: '#fff' } }
        />
      </Box>
    </Box>
  );
}
