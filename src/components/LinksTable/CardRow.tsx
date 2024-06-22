import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Checkbox, Link, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { memo } from 'react';

import { CardData } from '../../types/card';
import { Website } from '../../types/shops';

type CommonCardRowProps = {
  link: CardData;
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

const CardRow = memo(({ link, columns, index, ...props }: CardRowProps) => {
  const handleClickCardName = () => {
    Object.values(link.links).forEach((link) => {
      window.open(link, '_blank');
    });
  };

  const handleCheckCard = () => {
    if (props.viewType === 'regular') {
      props.onToggleCheckCard(link.cardName);
    }
  };

  const handleRemoveCard = () => {
    if (props.viewType === 'regular') {
      props.onRemoveCard(link.cardName);
    }
  };

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
          {index + 1}. {link.cardName}
        </Typography>
        {props.viewType === 'regular' && (
          <Checkbox checked={!!link.checked} value={!!link.checked} onChange={handleCheckCard} />
        )}
      </TableCell>
      {columns.map((website) => {
        return (
          <TableCell key={website}>
            <Tooltip title={website} enterDelay={0} leaveDelay={0}>
              <Link href={link.links[website]} target="_blank" rel="noreferrer">
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
