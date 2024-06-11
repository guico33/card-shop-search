import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
} from '@mui/material';
import { websites } from './constants';
import { Website } from './types';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

type LinksTableProps = {
  links: {
    cardName: string;
    links: Record<Website, string>;
  }[];
  onRemoveCard: (cardName: string) => void;
};

export const LinksTable = ({ links, onRemoveCard }: LinksTableProps) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Card Name</TableCell>
          {websites.map((website) => {
            return (
              <TableCell
                key={website}
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
        </TableRow>
      </TableHead>
      <TableBody>
        {links.map((link) => {
          return (
            <TableRow key={link.cardName}>
              <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DisabledByDefaultIcon
                  role="button"
                  sx={{ mr: 'auto', cursor: 'pointer' }}
                  onClick={() => {
                    onRemoveCard(link.cardName);
                  }}
                />
                {link.cardName}
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
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

export default LinksTable;
