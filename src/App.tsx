import { Box, Button, Container, Stack, TextareaAutosize, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';

import LinksList from './components/LinksList';
import LinksTable from './components/LinksTable';
import SearchCardInput from './components/SearchCardInput';
import { useLinksContext } from './contexts/LinksContext/useLinksContext';
import useBreakpoints from './hooks/useBreakpoints';
import useIndexedDB from './hooks/useIndexedDB';
import MainLayout from './layouts/MainLayout';

function App() {
  const { isLgUp } = useBreakpoints();
  const [cardListText, setCardListText] = useIndexedDB<string>('cardList', '');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const LinksContainerRef = React.useRef<HTMLDivElement>(null);

  const { links, generateLinks, clearLinks, removeCard } = useLinksContext();

  const handleChangeCardList = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const cardList = e.target.value;
      setCardListText(cardList);
    },
    [setCardListText],
  );

  const handleGenerateLinks = useCallback(() => {
    generateLinks(cardListText);
  }, [cardListText, generateLinks]);

  const handleAddCard = useCallback(() => {
    const cardName = `1x ${selectedCard}`;
    const updatedCardListText = !cardListText
      ? cardName
      : cardListText.includes(cardName)
      ? cardListText
      : `${cardListText}\n${cardName}`;
    setCardListText(updatedCardListText);
    setSelectedCard(null);
    return updatedCardListText;
  }, [cardListText, selectedCard, setCardListText]);

  const handleSearchNow = useCallback(() => {
    const updatedCardListText = handleAddCard();
    generateLinks(updatedCardListText);
  }, [generateLinks, handleAddCard]);

  const handleClear = useCallback(() => {
    if (confirm('Are you sure you want to clear the cards list?')) {
      setCardListText('');
      clearLinks();
    }
  }, [clearLinks, setCardListText]);

  const handleRemoveCard = useCallback(
    (cardName: string) => {
      removeCard(cardName);
      const updatedCardListText = cardListText
        .split('\n')
        .filter((card) => !card.includes(cardName))
        .join('\n');
      setCardListText(updatedCardListText);
    },
    [cardListText, removeCard, setCardListText],
  );

  return (
    <MainLayout>
      <Container sx={{ pt: 2, pb: 4 }} maxWidth="xl">
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
          <Stack spacing={3}>
            <Typography variant="h4">Cards list</Typography>
            <Stack direction="row" spacing={2}>
              <SearchCardInput selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
            </Stack>
            <Box display="flex" gap={2} justifyContent={'space-between'}>
              <Button onClick={handleAddCard} disabled={!selectedCard} size="small">
                Add
              </Button>
              <Button disabled={!selectedCard} onClick={handleSearchNow}>
                Search Now
              </Button>
              <Button onClick={handleClear} disabled={!cardListText && links.length === 0}>
                Clear
              </Button>
            </Box>
            <Box
              sx={{
                width: {
                  xs: '100%',
                  lg: '300px',
                },
              }}
            >
              <TextareaAutosize
                style={{
                  width: '100%',
                  height: '500px',
                  fontSize: '18px',
                }}
                onChange={handleChangeCardList}
                value={cardListText}
              />
            </Box>
            <Button
              onClick={handleGenerateLinks}
              disabled={!cardListText}
              sx={{ width: 'fit-content' }}
            >
              Generate links
            </Button>
          </Stack>
          <Stack spacing={3} ref={LinksContainerRef}>
            <Typography variant="h4">Links</Typography>
            {isLgUp ? (
              <LinksTable onRemoveCard={handleRemoveCard} />
            ) : (
              <LinksList onRemoveCard={handleRemoveCard} />
            )}
          </Stack>
        </Stack>
      </Container>
    </MainLayout>
  );
}

export default App;
