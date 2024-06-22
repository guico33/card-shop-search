import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material';

import { useGetLinksHistory } from '../api/linksHistory';
import LinksList from '../components/LinksList';
import LinksTable from '../components/LinksTable';
import useBreakpoints from '../hooks/useBreakpoints';
import MainLayout from '../layouts/MainLayout';

const History = () => {
  const { data: links } = useGetLinksHistory();

  const { isLgUp } = useBreakpoints();

  return (
    <MainLayout>
      <Container sx={{ pt: 2, pb: 4 }} maxWidth="xl">
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
          {!links && (
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} width="100%">
              <Typography variant="caption">Fetching links...</Typography>
              <CircularProgress size={20} />
            </Box>
          )}
          {links && links.length === 0 && (
            <Typography variant="body1" textAlign={'center'}>
              The history is empty
            </Typography>
          )}
          {links &&
            links.length > 0 &&
            (isLgUp ? (
              <LinksTable viewType="history" links={links} />
            ) : (
              <LinksList viewType="history" links={links} />
            ))}
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default History;
