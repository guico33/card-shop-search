import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Box, Link, Stack, Typography } from '@mui/material';

import { CardData } from '../types/card';

type RegularCardsListProps = {
  viewType: 'regular';
  cards: CardData[];
  onRemoveCard: (cardName: string) => void;
};

type HistoryCardsListProps = {
  viewType: 'history';
  cards: CardData[];
};

type CardsListProps = RegularCardsListProps | HistoryCardsListProps;

export const CardsList = ({ cards, ...props }: CardsListProps) => {
  return (
    <Stack spacing={2}>
      {cards.map((card) => {
        return (
          <Stack key={card.cardName} sx={{ border: '1px solid white', p: 2, width: 'fit-content' }}>
            <Box display={'flex'} dir="row">
              <Typography variant="h5" mb={2}>
                {card.cardName}
              </Typography>
              {props.viewType === 'regular' && (
                <DisabledByDefaultIcon
                  role="button"
                  sx={{ ml: 'auto', cursor: 'pointer' }}
                  onClick={() => {
                    props.onRemoveCard(card.cardName);
                  }}
                />
              )}
            </Box>

            <Box display="flex" flexDirection="row" gap={2} flexWrap={'wrap'}>
              {Object.entries(card.links).map(([website, link]) => {
                return (
                  <Link key={website} href={link} target="_blank" rel="noreferrer">
                    {website}
                  </Link>
                );
              })}
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default CardsList;
