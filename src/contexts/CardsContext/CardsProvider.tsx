import { doc, getDoc, setDoc } from '@firebase/firestore';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { useUpdateCardsHistory as useUpdateCardsHistory } from '../../api/cardsHistory';
import { db } from '../../firebaseConfig';
import useIndexedDB from '../../hooks/useIndexedDB';
import { CardData } from '../../types/card';
import { getCardsList } from '../../utils';
import useAuthContext from '../AuthContext/useAuthContext';

type CardsContextType = {
  cards: CardData[];
  removeCard: (cardName: string) => void;
  toggleCheckCard: (cardName: string) => void;
  toggleCheckAllCards: () => void;
  generateLinks: (cardsList: string) => void;
  clearCards: () => void;
  isAllCardsChecked: boolean;
  isSomeCardsChecked: boolean;
  isNoCardsChecked: boolean;
  fetchingCards: boolean;
};

export const CardsContext = createContext<CardsContextType | undefined>(undefined);

type CardsProviderProps = {
  children: React.ReactNode;
};

const CardsProvider = ({ children }: CardsProviderProps) => {
  const { user } = useAuthContext();
  const [cards, setCards, loadingIndexedDB] = useIndexedDB<CardData[]>('cards', []);
  const [cardsFetched, setCardsFetched] = useState(false);
  const [fetchingCards, setFetchingCards] = useState(false);

  const { mutate: updateCardsHistory } = useUpdateCardsHistory(user?.uid);

  // Fetch the cards from Firestore when the user logs in
  // after cards have been fetched from IndexedDB
  useEffect(() => {
    if (user && !loadingIndexedDB && !cardsFetched) {
      setFetchingCards(true);

      const fetchData = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const cards = docSnap.data().cards ?? [];
            setCards(cards);
          }
        } catch (error) {
          console.error('Error fetching cards:', error);
        } finally {
          setCardsFetched(true);
          setFetchingCards(false);
        }
      };

      fetchData();
    }
  }, [user, setCards, loadingIndexedDB, cardsFetched]);

  // Reset cardsFetched when the user logs out
  useEffect(() => {
    if (!user && cardsFetched) {
      setCardsFetched(false);
    }
  }, [user, cardsFetched]);

  useEffect(() => {
    if (user && !loadingIndexedDB && cardsFetched && cards.length > 0) {
      const saveData = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, { cards }, { merge: true });
        } catch (error) {
          console.error('Error saving cards:', error);
        }
      };

      saveData();
    }
  }, [cards, cardsFetched, loadingIndexedDB, user]);

  useEffect(() => {
    if (user && cards.length > 0) {
      updateCardsHistory(cards);
    }
  }, [cards, cardsFetched, updateCardsHistory, user]);

  const removeCard = useCallback(
    (cardName: string) => {
      setCards((prevCards) => {
        const updatedCards = prevCards.filter((card) => card.cardName !== cardName);
        return updatedCards;
      });
    },
    [setCards],
  );

  const toggleCheckCard = useCallback(
    (cardName: string) => {
      setCards((prevCards) => {
        const updatedCards = prevCards.map((card) => {
          if (card.cardName === cardName) {
            return { ...card, checked: !card.checked };
          }
          return card;
        });
        return updatedCards;
      });
    },
    [setCards],
  );

  const checkAllCards = useCallback(() => {
    setCards((prevCards) => {
      const updatedCards = prevCards.map((card) => {
        return { ...card, checked: true };
      });
      return updatedCards;
    });
  }, [setCards]);

  const uncheckAllCards = useCallback(() => {
    setCards((prevCards) => {
      const updatedCards = prevCards.map((card) => {
        return { ...card, checked: false };
      });
      return updatedCards;
    });
  }, [setCards]);

  const generateLinks = useCallback(
    (cardsList: string) => {
      setCards((prevCards) => {
        const updatedCards = getCardsList(cardsList.trim(), prevCards);
        return updatedCards;
      });
    },
    [setCards],
  );

  const clearCards = useCallback(() => {
    setCards([]);
  }, [setCards]);

  const nbCardsChecked = useMemo(() => cards.filter((card) => card.checked).length, [cards]);

  const isAllCardsChecked = nbCardsChecked === cards.length && cards.length > 0;

  const isSomeCardsChecked = nbCardsChecked > 0 && !isAllCardsChecked;

  const isNoCardsChecked = !isSomeCardsChecked && !isAllCardsChecked;

  const toggleCheckAllCards = useCallback(() => {
    if (isAllCardsChecked) {
      uncheckAllCards();
    } else {
      checkAllCards();
    }
  }, [checkAllCards, isAllCardsChecked, uncheckAllCards]);

  return (
    <CardsContext.Provider
      value={{
        cards: cards,
        removeCard,
        toggleCheckCard,
        toggleCheckAllCards,
        generateLinks,
        clearCards,
        isAllCardsChecked,
        isSomeCardsChecked,
        isNoCardsChecked,
        fetchingCards: fetchingCards,
      }}
    >
      {children}
    </CardsContext.Provider>
  );
};

export default CardsProvider;
