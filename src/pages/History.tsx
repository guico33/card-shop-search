import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material';

import { useGetCardsHistory } from '../api/cardsHistory';
import CardsList from '../components/CardsList';
import CardsTable from '../components/CardsTable';
import useBreakpoints from '../hooks/useBreakpoints';
import MainLayout from '../layouts/MainLayout';

const History = () => {
  const { data: cards } = useGetCardsHistory();

  const { isLgUp } = useBreakpoints();

  return (
    <MainLayout>
      <Container sx={{ pt: 2, pb: 4 }} maxWidth="xl">
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
          {!cards && (
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} width="100%">
              <Typography variant="caption">Fetching cards...</Typography>
              <CircularProgress size={20} />
            </Box>
          )}
          {cards && cards.length === 0 && (
            <Typography variant="body1" textAlign={'center'}>
              The history is empty
            </Typography>
          )}
          {cards &&
            cards.length > 0 &&
            (isLgUp ? (
              <CardsTable viewType="history" cards={cards} />
            ) : (
              <CardsList viewType="history" cards={cards} />
            ))}
        </Stack>
      </Container>
    </MainLayout>
  );
};

export default History;
