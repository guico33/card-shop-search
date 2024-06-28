import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
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
import { useCallback } from 'react';

import { websites } from '../../constants/stores';
import { useCardsContext } from '../../contexts/CardsContext/useCardsContext';
import useIndexedDB from '../../hooks/useIndexedDB';
import { CardData } from '../../types/card';
import { Website } from '../../types/shops';
import CardRow from './CardRow';
import HeaderCell from './HeaderCell';

type RegularCardsTableProps = {
  viewType: 'regular';
  cards: CardData[];
  onRemoveCard: (cardName: string) => void;
  toggleCheckCard: (cardName: string) => void;
  toggleCheckAllCards: () => void;
  isAllCardsChecked: boolean;
  isSomeCardsChecked: boolean;
};

type HistoryCardsTableProps = {
  viewType: 'history';
  cards: CardData[];
};

type CardsTableProps = RegularCardsTableProps | HistoryCardsTableProps;

export const CardsTable = ({ cards, ...props }: CardsTableProps) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [columns, setColumns] = useIndexedDB<Website[]>('columns', websites);

  const { clearCards } = useCardsContext();

  const handleClearCards = useCallback(() => {
    if (confirm('Are you sure you want to clear the cards?')) {
      clearCards();
    }
  }, [clearCards]);

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
    top: 63,
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
                {props.viewType === 'regular' && (
                  <Checkbox
                    indeterminate={props.isSomeCardsChecked}
                    checked={props.isAllCardsChecked}
                    onClick={props.toggleCheckAllCards}
                  />
                )}
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
            {props.viewType === 'regular' && (
              <TableCell>
                <DisabledByDefaultIcon
                  role="button"
                  sx={{ cursor: 'pointer', mt: 3 }}
                  onClick={handleClearCards}
                />
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {cards.map((card, i) => {
            return (
              <CardRow
                key={card.cardName}
                card={card}
                index={i}
                columns={columns}
                {...(props.viewType === 'regular'
                  ? {
                      viewType: 'regular',
                      onToggleCheckCard: props.toggleCheckCard,
                      onRemoveCard: props.onRemoveCard,
                    }
                  : { viewType: 'history' })}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CardsTable;
