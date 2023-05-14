import { Box, Button, Container, Stack, TextareaAutosize, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import LinksList from './LinksList'
import LinksTable from './LinksTable'
import SearchCardInput from './SearchCardInput'
import { Website } from './types'
import { generateLinks, useBreakpoints } from './utils'

function App() {
  const { isLgUp } = useBreakpoints()
  const [cardListText, setCardListText] = useState('')
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const LinksContainerRef = React.useRef<HTMLDivElement>(null)

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
  }

  const handleAddCard = () => {
    const cardName = `1x ${selectedCard}`
    const updatedCardListText = !cardListText
      ? cardName
      : cardListText.includes(cardName)
      ? cardListText
      : `${cardListText}\n${cardName}`
    setCardListText(updatedCardListText)
    setSelectedCard(null)
    return updatedCardListText
  }

  const handleRemoveCard = (cardName: string) => {
    const updatedCardListText = cardListText
      .split('\n')
      .filter((card) => !card.includes(cardName))
      .join('\n')
    setCardListText(updatedCardListText)
    const updatedLinks = links.filter((link) => link.cardName !== cardName)
    setLinks(updatedLinks)
  }

  const handleSearchNow = () => {
    const updatedCardListText = handleAddCard()
    const links = generateLinks(updatedCardListText.trim())
    setLinks(links)
  }

  const handleClear = () => {
    setCardListText('')
    setLinks([])
  }

  useEffect(() => {
    if (links.length) {
      // scroll to links
      LinksContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [links.length])

  return (
    <Container sx={{ pt: 2, pb: 4 }} maxWidth="xl">
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
        <Stack spacing={3}>
          <Typography variant="h4">Cards list</Typography>
          <Stack direction="row" spacing={2}>
            <SearchCardInput selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
            <Button onClick={handleAddCard} disabled={!selectedCard} size="small">
              Add
            </Button>
          </Stack>
          <Box display="flex" gap={2}>
            <Button
              onClick={handleGenerateLinks}
              disabled={!cardListText}
              sx={{ width: 'fit-content' }}
            >
              Generate links
            </Button>
            <Button disabled={!selectedCard} onClick={handleSearchNow}>
              Search Now
            </Button>
            <Button onClick={handleClear} disabled={!cardListText && links.length === 0}>
              Clear
            </Button>
          </Box>
          <TextareaAutosize
            style={{ maxWidth: '300px', height: '500px', fontSize: '18px' }}
            onChange={handleChangeCardList}
            value={cardListText}
          />
        </Stack>
        <Stack spacing={3} ref={LinksContainerRef}>
          <Typography variant="h4">Links</Typography>
          {isLgUp ? (
            <LinksTable links={links} />
          ) : (
            <LinksList links={links} onRemoveCard={handleRemoveCard} />
          )}
        </Stack>
      </Stack>
    </Container>
  )
}

export default App
