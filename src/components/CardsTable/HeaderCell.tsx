import { TableCell, Typography } from '@mui/material';
import { memo, useCallback } from 'react';

import { useCardsContext } from '../../contexts/CardsContext/useCardsContext';
import { Website } from '../../types/shops';

type HeaderCellProps = {
  website: Website;
  columns: Website[];
  moveColumn: (from: number, to: number) => void;
};

const HeaderCell = memo(({ columns, moveColumn, website }: HeaderCellProps) => {
  const { cards, isNoCardsChecked } = useCardsContext();

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLTableCellElement>) => {
      e.dataTransfer.setData('text/plain', website);
    },
    [website],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLTableCellElement>) => {
      const from = columns.indexOf(e.dataTransfer.getData('text/plain') as Website);
      const to = columns.indexOf(website);
      moveColumn(from, to);
    },
    [columns, moveColumn, website],
  );

  const handleClickWebsite = useCallback(() => {
    if (isNoCardsChecked) {
      cards.forEach((card) => {
        window.open(card.links[website], '_blank');
      });
    } else {
      cards
        .filter((card) => card.checked)
        .forEach((card) => {
          window.open(card.links[website], '_blank');
        });
    }
  }, [isNoCardsChecked, cards, website]);

  return (
    <TableCell
      key={website}
      sx={{ verticalAlign: 'bottom' }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      draggable
    >
      <Typography sx={{ cursor: 'pointer' }} role="button" onClick={handleClickWebsite}>
        {website}
      </Typography>
    </TableCell>
  );
});

export default HeaderCell;
