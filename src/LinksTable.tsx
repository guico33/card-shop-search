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
  Theme,
  Typography,
} from '@mui/material';
import { websites } from './constants';
import { CardData } from './types';
import { Website } from './types';
import useLocalStorage from './hooks/useLocalStorage';

type LinksTableProps = {
  links: CardData[];
  onRemoveCard: (cardName: string) => void;
  onToggleCheckCard: (cardName: string) => void;
};

export const LinksTable = ({ links, onRemoveCard, onToggleCheckCard }: LinksTableProps) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [columns, setColumns] = useLocalStorage<Website[]>('columns', websites);

  const moveColumn = (from: number, to: number) => {
    setColumns((prev) => {
      const next = [...prev];
      const [removed] = next.splice(from, 1);
      next.splice(to, 0, removed);
      return next;
    });
  };

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
            {columns.map((website) => {
              return (
                <TableCell
                  key={website}
                  sx={{ verticalAlign: 'bottom' }}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', website);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    const from = columns.indexOf(e.dataTransfer.getData('text/plain') as Website);
                    const to = columns.indexOf(website);
                    moveColumn(from, to);
                  }}
                  draggable
                >
                  <Typography
                    sx={{ cursor: 'pointer' }}
                    role="button"
                    onClick={() => {
                      links.forEach((link) => {
                        window.open(link.links[website], '_blank');
                      });
                    }}
                  >
                    {website}
                  </Typography>
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
                    maxWidth: '300px',
                  }}
                >
                  <Typography
                    role="button"
                    noWrap
                    sx={{
                      cursor: 'pointer',
                    }}
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
                {columns.map((website) => {
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
};

export default LinksTable;
