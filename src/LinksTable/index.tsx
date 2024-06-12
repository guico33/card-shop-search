import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from '@mui/material';
import { websites } from '../constants';
import useIndexedDB from '../hooks/useIndexedDB';
import { CardData, Website } from '../types';
import CardRow from './CardRow';
import HeaderCell from './HeaderCell';
import { useCallback } from 'react';

type LinksTableProps = {
  links: CardData[];
  onRemoveCard: (cardName: string) => void;
  onToggleCheckCard: (cardName: string) => void;
};

export const LinksTable = ({ links, onRemoveCard, onToggleCheckCard }: LinksTableProps) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [columns, setColumns] = useIndexedDB<Website[]>('columns', websites);

  const moveColumn = useCallback(
    (from: number, to: number) => {
      setColumns((prev) => {
        const next = [...prev];
        const [removed] = next.splice(from, 1);
        next.splice(to, 0, removed);
        return next;
      });
    },
    [setColumns],
  );

  const headerStyles = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    '& th': {
      paddingBottom: 1.5,
    },
  };

  return (
    <TableContainer
      sx={{
        overflowX: 'initial',
      }}
    >
      <Table>
        <TableHead sx={headerStyles}>
          <TableRow>
            <TableCell sx={{ verticalAlign: 'bottom' }}>
              <Typography>Card Name</Typography>
            </TableCell>
            {columns.map((website) => (
              <HeaderCell
                columns={columns}
                key={website}
                moveColumn={moveColumn}
                website={website}
                links={links}
              />
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map((link, i) => {
            return (
              <CardRow
                key={link.cardName}
                link={link}
                index={i}
                columns={columns}
                onToggleCheckCard={onToggleCheckCard}
                onRemoveCard={onRemoveCard}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LinksTable;
