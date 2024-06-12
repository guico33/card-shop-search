import { Box, Link, Stack, Typography } from '@mui/material';
import { Website } from '../types';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

type LinksListProps = {
  links: {
    cardName: string;
    links: Record<Website, string>;
  }[];
  onRemoveCard: (cardName: string) => void;
};

export const LinksList = ({ links, onRemoveCard }: LinksListProps) => (
  <Stack spacing={2}>
    {links.map((link) => {
      return (
        <Stack key={link.cardName} sx={{ border: '1px solid white', p: 2, width: 'fit-content' }}>
          <Box display={'flex'} dir="row">
            <Typography variant="h5" mb={2}>
              {link.cardName}
            </Typography>
            <DisabledByDefaultIcon
              role="button"
              sx={{ ml: 'auto', cursor: 'pointer' }}
              onClick={() => {
                onRemoveCard(link.cardName);
              }}
            />
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

export default LinksList;
