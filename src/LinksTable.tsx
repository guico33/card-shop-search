import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
} from '@mui/material'
import { websites } from './constants'
import { Website } from './types'

type LinksTableProps = {
  links: {
    cardName: string
    links: Record<Website, string>
  }[]
}

export const LinksTable = ({ links }: LinksTableProps) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Card Name</TableCell>
          {websites.map((website) => {
            return <TableCell key={website}>{website}</TableCell>
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {links.map((link) => {
          return (
            <TableRow key={link.cardName}>
              <TableCell>{link.cardName}</TableCell>
              {websites.map((website) => {
                return (
                  <TableCell key={website}>
                    <Link href={link.links[website]} target="_blank" rel="noreferrer">
                      Open
                    </Link>
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  </TableContainer>
)

export default LinksTable
