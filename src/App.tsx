import React, { useState } from 'react'
import { Website } from './types'
import { generateLinks } from './utils'
import { websites } from './constants'
import SearchCardInput from './SearchCardInput'
import {
  Button,
  Container,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
} from '@mui/material'
import { SearchCardResponse } from './api'

function App() {
  const [cardListText, setCardListText] = useState('')
  const [selectedCard, setSelectedCard] = useState<SearchCardResponse['data'][number] | null>(null)

  const selectedCardName = selectedCard?.name

  const [links, setLinks] = useState<
    {
      cardName: string
      links: Record<Website, string>
    }[]
  >([])

  const handleChangeCardList = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const cardList = e.target.value
    setCardListText(cardList)
  }

  const handleOpenTabs = () => {
    const links = generateLinks(cardListText.trim())
    setLinks(links)
  }

  const handleAddCard = () => {
    setCardListText((prev) => {
      const cardName = `1x ${selectedCardName}`
      return !prev ? cardName : prev.includes(cardName) ? prev : `${prev}\n${cardName}`
    })
    setSelectedCard(null)
  }

  return (
    <Container sx={{ mt: 2 }} maxWidth="xl">
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Stack spacing={3}>
          <label>Cards list</label>
          <Stack direction="row" spacing={2}>
            <SearchCardInput selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
            <Button onClick={handleAddCard} disabled={!selectedCardName} size="small">
              Add
            </Button>
          </Stack>
          <Button onClick={handleOpenTabs} disabled={!cardListText} sx={{ width: 'fit-content' }}>
            Generate links
          </Button>
          <TextareaAutosize
            style={{ width: '360px', height: '70vh', fontSize: '18px' }}
            onChange={handleChangeCardList}
            value={cardListText}
          />
        </Stack>
        <TableContainer>
          <label>Links</label>
          {/* Table to display the links */}
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
      </Stack>
    </Container>
  )
}

export default App
