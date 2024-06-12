import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import {
  Checkbox,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { websites } from './constants';
import { CardData } from './types';

type LinksTableProps = {
  links: CardData[];
  onRemoveCard: (cardName: string) => void;
  onToggleCheckCard: (cardName: string) => void;
};

export const LinksTable = ({ links, onRemoveCard, onToggleCheckCard }: LinksTableProps) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Card Name</TableCell>
          {websites.map((website) => {
            return (
              <TableCell
                key={website}
                sx={{ cursor: 'pointer' }}
                role="button"
                onClick={() => {
                  links.forEach((link) => {
                    window.open(link.links[website], '_blank');
                  });
                }}
              >
                {website}
              </TableCell>
            );
          })}
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {links.map((link, i) => {
          return (
            <TableRow
              key={link.cardName}
              sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: (theme) => theme.palette.action.hover,
                },
              }}
            >
              <TableCell
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  whiteSpace: 'nowrap',
                }}
              >
                <Typography
                  role="button"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    // open all links for this card
                    Object.values(link.links).forEach((link) => {
                      window.open(link, '_blank');
                    });
                  }}
                >
                  {i + 1}. {link.cardName}
                </Typography>
                <Checkbox
                  checked={!!link.checked}
                  value={!!link.checked}
                  onChange={() => {
                    onToggleCheckCard(link.cardName);
                  }}
                />
              </TableCell>
              {websites.map((website) => {
                return (
                  <TableCell key={website}>
                    <Link href={link.links[website]} target="_blank" rel="noreferrer">
                      Open
                    </Link>
                  </TableCell>
                );
              })}
              <TableCell>
                <DisabledByDefaultIcon
                  role="button"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    onRemoveCard(link.cardName);
                  }}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

export default LinksTable;
