import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';

import CardsList from '../components/CardsList';
import CardsTable from '../components/CardsTable';
import SearchCardInput from '../components/SearchCardInput';
import { useCardsContext } from '../contexts/CardsContext/useCardsContext';
import useBreakpoints from '../hooks/useBreakpoints';
import useIndexedDB from '../hooks/useIndexedDB';
import MainLayout from '../layouts/MainLayout';

function Home() {
  const { isLgUp } = useBreakpoints();
  const [cardListText, setCardListText] = useIndexedDB<string>('cardList', '');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const {
    cards,
    generateLinks,
    removeCard,
    toggleCheckCard,
    isAllCardsChecked,
    isSomeCardsChecked,
    toggleCheckAllCards,
    fetchingCards,
  } = useCardsContext();

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
    }
  }, [setCardListText]);

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
              <Button onClick={handleClear} disabled={!cardListText && cards.length === 0}>
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
          <Stack spacing={3} width="100%">
            <Typography variant="h4">Cards</Typography>
            {fetchingCards && (
              <Box display="flex" justifyContent="center" alignItems="center" gap={2} width="100%">
                <Typography variant="caption">Fetching cards...</Typography>
                <CircularProgress size={20} />
              </Box>
            )}
            {!fetchingCards && cards.length === 0 && (
              <Typography variant="body1" textAlign={'center'}>
                No cards to display
              </Typography>
            )}
            {!fetchingCards &&
              cards.length !== 0 &&
              (isLgUp ? (
                <CardsTable
                  viewType="regular"
                  cards={cards}
                  onRemoveCard={handleRemoveCard}
                  isAllCardsChecked={isAllCardsChecked}
                  isSomeCardsChecked={isSomeCardsChecked}
                  toggleCheckAllCards={toggleCheckAllCards}
                  toggleCheckCard={toggleCheckCard}
                />
              ) : (
                <CardsList viewType="regular" cards={cards} onRemoveCard={handleRemoveCard} />
              ))}
          </Stack>
        </Stack>
      </Container>
    </MainLayout>
  );
}

export default Home;
