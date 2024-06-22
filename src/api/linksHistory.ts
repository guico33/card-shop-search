import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import useAuthContext from '../contexts/AuthContext/useAuthContext';
import { db } from '../firebaseConfig';
import { CardData } from '../types/card';

const updateLinksHistory = async (userId: string, links: CardData[]) => {
  const userDocRef = doc(db, 'users', userId);

  const userDocSnap = await getDoc(userDocRef);

  let linksHistory: CardData[] = [];

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    linksHistory = userData.linksHistory || [];
  }

  links.forEach((newLink) => {
    // Check if the link already exists
    const existingLinkIndex = linksHistory.findIndex((link) => link.cardName === newLink.cardName);

    if (existingLinkIndex !== -1) {
      // Update the entire existing link object
      linksHistory[existingLinkIndex] = {
        ...newLink,
        timestamp: Timestamp.now(),
      };
    } else {
      // Add new link
      linksHistory.push({ ...newLink, timestamp: Timestamp.now() });
    }
  });

  // Limit the history to 100 entries
  if (linksHistory.length > 100) {
    linksHistory = linksHistory.slice(-100);
  }

  // Update the document with the new history array
  await setDoc(userDocRef, { linksHistory }, { merge: true });
};

export const useUpdateLinksHistory = (userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (links: CardData[]) => {
      if (!userId) {
        return Promise.reject(new Error('User is not logged in'));
      }
      return updateLinksHistory(userId, links);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['linksHistory', userId]);
      },
    },
  );
};

const getLinksHistory = async (userId?: string) => {
  if (!userId) return [];

  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();
    const linksHistory: CardData[] = userData.linksHistory || [];
    linksHistory.sort(
      (a, b) => (b.timestamp as Timestamp).toMillis() - (a.timestamp as Timestamp).toMillis(),
    );
    return linksHistory;
  }

  return [];
};

export const useGetLinksHistory = () => {
  const { user } = useAuthContext();
  const query = useQuery(['linksHistory', user?.uid], () => getLinksHistory(user?.uid));
  return query;
};
