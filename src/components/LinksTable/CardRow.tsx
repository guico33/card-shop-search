import { Checkbox, Link, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { CardData, Website } from '../../types';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { memo } from 'react';

type CardRowProps = {
  link: CardData;
  columns: Website[];
  index: number;
  onToggleCheckCard: (cardName: string) => void;
  onRemoveCard: (cardName: string) => void;
};

const CardRow = memo(
  ({ link, columns, index, onToggleCheckCard, onRemoveCard }: CardRowProps) => {
    const handleClickCardName = () => {
      Object.values(link.links).forEach((link) => {
        window.open(link, '_blank');
      });
    };

    const handleCheckCard = () => {
      onToggleCheckCard(link.cardName);
    };

    const handleRemoveCard = () => {
      onRemoveCard(link.cardName);
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
          <Checkbox checked={!!link.checked} value={!!link.checked} onChange={handleCheckCard} />
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
        <TableCell>
          <DisabledByDefaultIcon
            role="button"
            sx={{ cursor: 'pointer' }}
            onClick={handleRemoveCard}
          />
        </TableCell>
      </TableRow>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.link.checked === nextProps.link.checked;
  },
);

export default CardRow;
