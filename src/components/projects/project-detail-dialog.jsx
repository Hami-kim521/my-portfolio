import { Box, Chip, Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../theme.js';
import ProjectLinks from './project-links.jsx';
import ProjectMockup from './project-mockup.jsx';

/**
 * 프로젝트 상세 정보 다이얼로그. 모바일에서는 전체 화면으로 열립니다.
 *
 * @param {object} project - 선택된 프로젝트 (없으면 닫힘) [Optional]
 * @param {function} onClose - 닫기 함수 [Required]
 *
 * Example usage:
 * <ProjectDetailDialog project={ selected } onClose={ () => setSelected(null) } />
 */
export default function ProjectDetailDialog({ project, onClose }) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <Dialog open={ Boolean(project) } onClose={ onClose } fullWidth maxWidth="sm" fullScreen={ isMobile }>
      { project && (
        <>
          <DialogTitle sx={ { pr: 7 } }>
            { project.title }
            <IconButton aria-label="닫기" onClick={ onClose } sx={ { position: 'absolute', right: 8, top: 8 } }>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={ { borderRadius: 2, overflow: 'hidden', mb: 2 } }>
              <ProjectMockup src={ project.thumbnail_url } alt={ `${project.title} 미리보기` } />
            </Box>
            <Box sx={ { color: colors.textSecondary, lineHeight: 1.7, mb: 2 } }>{ project.description }</Box>
            <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 } }>
              { project.tech_stack.map((tech) => (
                <Chip key={ tech } label={ tech } size="small" sx={ { bgcolor: colors.bgSecondary } } />
              )) }
            </Box>
            <ProjectLinks detailUrl={ project.detail_url } githubUrl={ project.github_url } />
          </DialogContent>
        </>
      ) }
    </Dialog>
  );
}
