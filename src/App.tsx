import { Button, Container, Stack, TextareaAutosize, Typography } from '@mui/material'
import React, { useState } from 'react'
import LinksList from './LinksList'
import LinksTable from './LinksTable'
import SearchCardInput from './SearchCardInput'
import { SearchCardResponse } from './api'
import { Website } from './types'
import { generateLinks, useBreakpoints } from './utils'

function App() {
  const { isLgUp } = useBreakpoints()
  const [cardListText, setCardListText] = useState('')
  const [selectedCard, setSelectedCard] = useState<SearchCardResponse['data'][number] | null>(null)
  const LinksContainerRef = React.useRef<HTMLDivElement>(null)

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

  const handleGenerateLinks = () => {
    const links = generateLinks(cardListText.trim())
    setLinks(links)
    // scroll to links
    LinksContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAddCard = () => {
    setCardListText((prev) => {
      const cardName = `1x ${selectedCardName}`
      return !prev ? cardName : prev.includes(cardName) ? prev : `${prev}\n${cardName}`
    })
    setSelectedCard(null)
  }

  return (
    <Container sx={{ pt: 2, pb: 4 }} maxWidth="xl">
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
        <Stack spacing={3}>
          <Typography variant="h4">Cards list</Typography>
          <Stack direction="row" spacing={2}>
            <SearchCardInput selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
            <Button onClick={handleAddCard} disabled={!selectedCardName} size="small">
              Add
            </Button>
          </Stack>
          <Button
            onClick={handleGenerateLinks}
            disabled={!cardListText}
            sx={{ width: 'fit-content' }}
          >
            Generate links
          </Button>
          <TextareaAutosize
            style={{ maxWidth: '300px', height: '500px', fontSize: '18px' }}
            onChange={handleChangeCardList}
            value={cardListText}
          />
        </Stack>
        <Stack spacing={3} ref={LinksContainerRef}>
          <Typography variant="h4">Links</Typography>
          {isLgUp ? <LinksTable links={links} /> : <LinksList links={links} />}
        </Stack>
      </Stack>
    </Container>
  )
}

export default App
