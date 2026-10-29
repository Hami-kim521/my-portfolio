import { Box, Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { colors } from '../../theme.js';
import useGuestbook from '../../hooks/use-guestbook.js';
import ContactLinks from './contact-links.jsx';
import GuestbookForm from './guestbook-form.jsx';
import GuestbookList from './guestbook-list.jsx';

const panelSx = {
  p: { xs: 2.5, md: 3 },
  bgcolor: colors.bgPrimary,
  border: `1px solid ${colors.border}`,
  borderRadius: 3,
};

/** 나란히 놓인 두 패널이 같은 높이가 되도록 늘려 줍니다. */
const fillHeightSx = { height: '100%', display: 'flex', flexDirection: 'column' };

/**
 * Home 의 Contact 섹션. 위: 방명록 목록(전체 너비), 아래 왼쪽: 연락처 / SNS, 아래 오른쪽: 방명록 작성.
 *
 * Example usage:
 * <ContactSection />
 */
export default function ContactSection() {
  const { entries, isLoading, error, addEntry } = useGuestbook();

  return (
    <Box id="contact" component="section" sx={ { bgcolor: colors.warmBg, py: { xs: 6, md: 10 } } }>
      <Container maxWidth="md" sx={ { px: { xs: 2, md: 3 } } }>
        <Box sx={ { textAlign: 'center', mb: { xs: 4, md: 6 } } }>
          <Typography variant="overline" sx={ { color: colors.accent, fontWeight: 700, letterSpacing: 2 } }>
            05 · CONTACT
          </Typography>
          <Typography variant="h4" component="h2" sx={ { mt: 1, mb: 1.5, fontSize: { xs: '1.6rem', md: '2.2rem' } } }>
            Contact
          </Typography>
          <Typography sx={ { color: colors.warmText } }>
            메일도 좋고, 방명록도 좋아요. 편하게 한마디 남겨 주세요 💬
          </Typography>
        </Box>

        <Paper elevation={ 0 } sx={ { ...panelSx, mb: { xs: 2, md: 3 } } }>
          <Typography sx={ { fontWeight: 700, mb: 2, color: colors.warmText } }>
            💌 방명록 ({ entries.length })
          </Typography>
          <GuestbookList entries={ entries } isLoading={ isLoading } error={ error } />
        </Paper>

        <Grid container spacing={ { xs: 2, md: 3 } }>
          <Grid size={ { xs: 12, md: 6 } }>
            <Paper elevation={ 0 } sx={ { ...panelSx, ...fillHeightSx } }>
              <ContactLinks />
            </Paper>
          </Grid>
          <Grid size={ { xs: 12, md: 6 } }>
            <Paper elevation={ 0 } sx={ { ...panelSx, ...fillHeightSx } }>
              <GuestbookForm onSubmit={ addEntry } />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
