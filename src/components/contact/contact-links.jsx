import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { colors } from '../../theme.js';
import { EMAIL, SNS_LINKS } from '../../utils/contact-info.js';

const SNS_ICONS = {
  github: GitHubIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
};

/**
 * 이메일 큰 버튼 + SNS 아이콘 한 줄. (Contact 섹션 왼쪽 영역)
 *
 * Example usage:
 * <ContactLinks />
 */
export default function ContactLinks() {
  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 3, flex: 1, justifyContent: 'space-between' } }>
      <Box>
        <Typography sx={ { fontWeight: 700, mb: 1.5, color: colors.warmText } }>
          📮 편하게 연락 주세요!
        </Typography>
        <Button
          fullWidth
          size="large"
          href={ `mailto:${EMAIL}` }
          startIcon={ <EmailRoundedIcon /> }
          sx={ {
            py: { xs: 1.75, md: 2.25 },
            fontSize: { xs: '1rem', md: '1.15rem' },
            color: colors.warmText,
            bgcolor: colors.warmBubble,
            '&:hover': { bgcolor: colors.accentWarm, color: '#fff' },
          } }
        >
          { EMAIL }
        </Button>
      </Box>

      <Box>
        <Typography sx={ { fontWeight: 700, mb: 1, color: colors.warmText } }>
          🔗 여기서도 만나요
        </Typography>
        <Box sx={ { display: 'flex', flexWrap: 'nowrap', gap: 1 } }>
          { SNS_LINKS.map(({ id, label, href }) => {
            const Icon = SNS_ICONS[id];
            return (
              <Tooltip key={ id } title={ label }>
                <IconButton
                  component="a"
                  href={ href }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ label }
                  sx={ {
                    color: colors.warmText,
                    bgcolor: colors.bgPrimary,
                    border: `1px solid ${colors.border}`,
                    '&:hover': { bgcolor: colors.warmBubble },
                  } }
                >
                  <Icon />
                </IconButton>
              </Tooltip>
            );
          }) }
        </Box>
      </Box>
    </Box>
  );
}
