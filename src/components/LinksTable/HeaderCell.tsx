import { TableCell, Typography } from '@mui/material';
import { Website } from '../../types';
import { memo, useCallback } from 'react';
import { useLinksContext } from '../../contexts/LinksContext/useLinksContext';

type HeaderCellProps = {
  website: Website;
  columns: Website[];
  moveColumn: (from: number, to: number) => void;
};

const HeaderCell = memo(({ columns, moveColumn, website }: HeaderCellProps) => {
  const { links, isNoCardsChecked } = useLinksContext();

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
      links.forEach((link) => {
        window.open(link.links[website], '_blank');
      });
    } else {
      links
        .filter((link) => link.checked)
        .forEach((link) => {
          window.open(link.links[website], '_blank');
        });
    }
  }, [isNoCardsChecked, links, website]);

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
