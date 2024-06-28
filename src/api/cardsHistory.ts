import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import useAuthContext from '../contexts/AuthContext/useAuthContext';
import { db } from '../firebaseConfig';
import { CardData } from '../types/card';

const updateCardsHistory = async (userId: string, cards: CardData[]) => {
  const userDocRef = doc(db, 'users', userId);

  const userDocSnap = await getDoc(userDocRef);

  let cardsHistory: CardData[] = [];

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    cardsHistory = userData.cardsHistory || [];
  }

  cards.forEach((newCard) => {
    // Check if the card already exists
    const existingCard = cardsHistory.findIndex((card) => card.cardName === newCard.cardName);

    if (existingCard !== -1) {
      // Update the entire existing card object
      cardsHistory[existingCard] = {
        ...newCard,
        timestamp: Timestamp.now(),
      };
    } else {
      // Add new card
      cardsHistory.push({ ...newCard, timestamp: Timestamp.now() });
    }
  });

  // Limit the history to 100 entries
  if (cardsHistory.length > 100) {
    cardsHistory = cardsHistory.slice(-100);
  }

  // Update the document with the new history array
  await setDoc(userDocRef, { cardsHistory }, { merge: true });
};

export const useUpdateCardsHistory = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (cards: CardData[]) => {
      if (!userId) {
        return Promise.reject(new Error('User is not logged in'));
      }
      return updateCardsHistory(userId, cards);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['cardsHistory', userId]);
      },
    },
  );
};

const getCardsHistory = async (userId?: string) => {
  if (!userId) return [];

  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    const cardsHistory: CardData[] = userData.cardsHistory || [];
    cardsHistory.sort(
      (a, b) => (b.timestamp as Timestamp).toMillis() - (a.timestamp as Timestamp).toMillis(),
    );
    return cardsHistory;
  }

  return [];
};

export const useGetCardsHistory = () => {
  const { user } = useAuthContext();
  const query = useQuery(['cardsHistory', user?.uid], () => getCardsHistory(user?.uid));
  return query;
};
