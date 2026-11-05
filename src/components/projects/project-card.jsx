import { Box, Card, Chip } from '@mui/material';
import { colors } from '../../theme.js';
import ProjectLinks from './project-links.jsx';
import ProjectMockup from './project-mockup.jsx';

/**
 * 프로젝트 한 장의 카드. 호버 시 1.2배 확대 + 아래쪽 옅은 그림자(터치 기기에서는 눌림 효과).
 *
 * @param {object} project - projects 테이블의 한 행 [Required]
 * @param {function} onViewDetails - View Details 클릭 시 project 를 넘겨 실행 [Required]
 *
 * Example usage:
 * <ProjectCard project={ project } onViewDetails={ setSelected } />
 */
export default function ProjectCard({ project, onViewDetails }) {
  const {
    title,
    description,
    tech_stack: techStack,
    detail_url: detailUrl,
    github_url: githubUrl,
    thumbnail_url: thumbnailUrl,
  } = project;

  return (
    <Card
      elevation={ 0 }
      sx={ {
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${colors.border}`,
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:active': { transform: 'scale(0.98)' },
        '@media (hover: hover)': {
          '&:hover': { transform: 'scale(1.2)', boxShadow: '0 12px 20px -8px rgba(0, 0, 0, 0.12)', zIndex: 2 },
        },
      } }
    >
      <ProjectMockup src={ thumbnailUrl } alt={ `${title} 미리보기` } />
      <Box sx={ { p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 } }>
        <Box component="h3" sx={ { m: 0, fontSize: { xs: '1.1rem', md: '1.2rem' }, lineHeight: 1.4, color: colors.textPrimary } }>
          { title }
        </Box>
        <Box sx={ { color: colors.textSecondary, fontSize: '0.95rem', lineHeight: 1.6 } }>{ description }</Box>
        <Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.75 } }>
          { techStack.map((tech) => (
            <Chip key={ tech } label={ tech } size="small" sx={ { bgcolor: colors.bgSecondary, color: colors.textPrimary } } />
          )) }
        </Box>
        <Box sx={ { mt: 'auto', pt: 1 } }>
          <ProjectLinks detailUrl={ detailUrl } githubUrl={ githubUrl } onViewDetails={ () => onViewDetails(project) } />
        </Box>
      </Box>
    </Card>
  );
}
