import { Box, Typography } from '@mui/material'

/**
 * 글을 줄바꿈 기준으로 문단으로 나누어, 문단 사이에 간격을 두고 보여줍니다.
 * 빈 줄은 무시하므로 "\n" 이든 "\n\n" 이든 같은 간격이 됩니다.
 *
 * @param {string} text - 보여줄 글 [Required]
 * @param {object} sx - 각 문단에 적용할 스타일 (글자 크기, 색 등) [Optional]
 * @param {number|string} gap - 문단 사이 간격 (MUI spacing 단위) [Optional, 기본값: 1.5]
 *
 * Example usage:
 * <Paragraphs text={ story.summary } sx={ { fontSize: 20 } } />
 */
export default function Paragraphs({ text, sx, gap = 1.5 }) {
  const paragraphs = text.split(/\n+/).map((line) => line.trim()).filter(Boolean)

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap } }>
      { paragraphs.map((paragraph, index) => (
        <Typography key={ index } sx={ sx }>
          { paragraph }
        </Typography>
      )) }
    </Box>
  )
}
