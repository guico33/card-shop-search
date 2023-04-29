import { Box, Link, Stack, Typography } from '@mui/material'
import { Website } from './types'

type LinksListProps = {
  links: {
    cardName: string
    links: Record<Website, string>
  }[]
}

export const LinksList = ({ links }: LinksListProps) => (
  <Stack>
    {links.map((link) => {
      return (
        <Stack key={link.cardName} sx={{ border: '1px solid white', p: 2, width: 'fit-content' }}>
          <Typography variant="h5" mb={2}>
            {link.cardName}
          </Typography>
          <Box display="flex" flexDirection="row" gap={2} flexWrap={'wrap'}>
            {Object.entries(link.links).map(([website, link]) => {
              return (
                <Link key={website} href={link} target="_blank" rel="noreferrer">
                  {website}
                </Link>
              )
            })}
          </Box>
        </Stack>
      )
    })}
  </Stack>
)

export default LinksList
