import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from '@mui/material';
import { websites } from '../../constants';
import useIndexedDB from '../../hooks/useIndexedDB';
import { Website } from '../../types';
import CardRow from './CardRow';
import HeaderCell from './HeaderCell';
import { useCallback } from 'react';
import { useLinksContext } from '../../contexts/LinksContext/useLinksContext';

type LinksTableProps = {
  onRemoveCard: (cardName: string) => void;
};

export const LinksTable = ({ onRemoveCard }: LinksTableProps) => {
  const { links, toggleCheckCard, isAllCardsChecked, isSomeCardsChecked, toggleCheckAllCards } =
    useLinksContext();

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
            <TableCell
              sx={{
                verticalAlign: 'bottom',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  maxWidth: '300px',
                }}
              >
                <Typography>Card Name</Typography>
                <Checkbox
                  indeterminate={isSomeCardsChecked}
                  checked={isAllCardsChecked}
                  onClick={toggleCheckAllCards}
                />
              </Box>
            </TableCell>
            {columns.map((website) => (
              <HeaderCell
                columns={columns}
                key={website}
                moveColumn={moveColumn}
                website={website}
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
                onToggleCheckCard={toggleCheckCard}
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
