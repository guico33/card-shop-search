import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Box, Link, Stack, Typography } from '@mui/material';

import { CardData } from '../types/card';

type RegularLinksListProps = {
  viewType: 'regular';
  links: CardData[];
  onRemoveCard: (cardName: string) => void;
};

type HistoryLinksListProps = {
  viewType: 'history';
  links: CardData[];
};

type LinksListProps = RegularLinksListProps | HistoryLinksListProps;

export const LinksList = ({ links, ...props }: LinksListProps) => {
  return (
    <Stack spacing={2}>
      {links.map((link) => {
        return (
          <Stack key={link.cardName} sx={{ border: '1px solid white', p: 2, width: 'fit-content' }}>
            <Box display={'flex'} dir="row">
              <Typography variant="h5" mb={2}>
                {link.cardName}
              </Typography>
              {props.viewType === 'regular' && (
                <DisabledByDefaultIcon
                  role="button"
                  sx={{ ml: 'auto', cursor: 'pointer' }}
                  onClick={() => {
                    props.onRemoveCard(link.cardName);
                  }}
                />
              )}
            </Box>

            <Box display="flex" flexDirection="row" gap={2} flexWrap={'wrap'}>
              {Object.entries(link.links).map(([website, link]) => {
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

export default LinksList;
