import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Checkbox, Link, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { memo } from 'react';

import { CardData } from '../../types/card';
import { Website } from '../../types/shops';

type CommonCardRowProps = {
  card: CardData;
  columns: Website[];
  index: number;
};

type RegularCardRowProps = CommonCardRowProps & {
  viewType: 'regular';
  onToggleCheckCard: (cardName: string) => void;
  onRemoveCard: (cardName: string) => void;
};

type HistoryCardRowProps = CommonCardRowProps & {
  viewType: 'history';
};

type CardRowProps = RegularCardRowProps | HistoryCardRowProps;

const CardRow = memo(({ card, columns, index, ...props }: CardRowProps) => {
  const handleClickCardName = () => {
    Object.values(card.links).forEach((link) => {
      window.open(link, '_blank');
    });
  };

  const handleCheckCard = () => {
    if (props.viewType === 'regular') {
      props.onToggleCheckCard(card.cardName);
    }
  };

  const handleRemoveCard = () => {
    if (props.viewType === 'regular') {
      props.onRemoveCard(card.cardName);
    }
  };

  return (
    <TableRow
      key={card.cardName}
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
          maxWidth: '300px',
        }}
      >
        <Typography
          role="button"
          noWrap
          sx={{
            cursor: 'pointer',
          }}
          onClick={handleClickCardName}
        >
          {index + 1}. {card.cardName}
        </Typography>
        {props.viewType === 'regular' && (
          <Checkbox checked={!!card.checked} value={!!card.checked} onChange={handleCheckCard} />
        )}
      </TableCell>
      {columns.map((website) => {
        return (
          <TableCell key={website}>
            <Tooltip title={website} enterDelay={0} leaveDelay={0}>
              <Link href={card.links[website]} target="_blank" rel="noreferrer">
                Open
              </Link>
            </Tooltip>
          </TableCell>
        );
      })}
      {props.viewType === 'regular' && (
        <TableCell>
          <DisabledByDefaultIcon
            role="button"
            sx={{ cursor: 'pointer' }}
            onClick={handleRemoveCard}
          />
        </TableCell>
      )}
    </TableRow>
  );
});

export default CardRow;
