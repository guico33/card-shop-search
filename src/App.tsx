import { Box, Button, Container, Stack, TextareaAutosize, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import LinksList from './LinksList';
import LinksTable from './LinksTable';
import SearchCardInput from './SearchCardInput';
import { CardData } from './types';
import { generateLinks } from './utils';
import useBreakpoints from './hooks/useBreakpoints';
import useIndexedDB from './hooks/useIndexedDB';

function App() {
  const { isLgUp } = useBreakpoints();
  const [cardListText, setCardListText] = useIndexedDB<string>('cardList', '');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const LinksContainerRef = React.useRef<HTMLDivElement>(null);

  const [links, setLinks] = useIndexedDB<CardData[]>('cardLinks', []);

  const handleChangeCardList = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const cardList = e.target.value;
      setCardListText(cardList);
    },
    [setCardListText],
  );

  const handleGenerateLinks = useCallback(() => {
    setLinks((prevLinks) => {
      const updatedLinks = generateLinks(cardListText.trim(), prevLinks);
      return updatedLinks;
    });
  }, [cardListText, setLinks]);

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

  const handleRemoveCard = useCallback(
    (cardName: string) => {
      setLinks((prevLinks) => {
        const updatedCardListText = cardListText
          .split('\n')
          .filter((card) => !card.includes(cardName))
          .join('\n');
        setCardListText(updatedCardListText);
        const updatedLinks = prevLinks.filter((link) => link.cardName !== cardName);
        return updatedLinks;
      });
    },
    [cardListText, setCardListText, setLinks],
  );

  const handleToggleCheckCard = useCallback(
    (cardName: string) => {
      setLinks((prevLinks) => {
        const updatedLinks = prevLinks.map((link) => {
          if (link.cardName === cardName) {
            return {
              ...link,
              checked: !link.checked,
            };
          }
          return link;
        });
        return updatedLinks;
      });
    },
    [setLinks],
  );

  const handleSearchNow = useCallback(() => {
    const updatedCardListText = handleAddCard();
    setLinks((prevLinks) => {
      const updatedLinks = generateLinks(updatedCardListText.trim(), prevLinks);
      return updatedLinks;
    });
  }, [handleAddCard, setLinks]);

  const handleClear = useCallback(() => {
    if (confirm('Are you sure you want to clear the cards list?')) {
      setCardListText('');
      setLinks([]);
    }
  }, [setCardListText, setLinks]);

  return (
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
            <LinksTable
              links={links}
              onRemoveCard={handleRemoveCard}
              onToggleCheckCard={handleToggleCheckCard}
            />
          ) : (
            <LinksList links={links} onRemoveCard={handleRemoveCard} />
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
